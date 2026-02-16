FROM php:8.3-apache AS expensave-base

LABEL org.opencontainers.image.authors="algirdas@cici.lt"

SHELL ["/bin/bash", "-c"]

# Packages
RUN apt update && \
    apt install -y --no-install-recommends \
    cron \
    jq \
    libzip-dev \
    libicu-dev \
    libcurl4-openssl-dev \
    libonig-dev \
    libpng-dev \
    libxml2-dev \
    supervisor

# PHP Extensions
RUN docker-php-ext-install \
    mysqli \
    pdo \
    pdo_mysql \
    zip \
    intl \
    mbstring \
    curl \
    gd \
    sysvsem \
    dom

# Services
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Config files
COPY docker/apache2/ /etc/apache2/
COPY docker/cron.d/expensave-cron /tmp/expensave-cron
COPY docker/boot.sh /
COPY docker/supervisor /etc/supervisor

RUN chmod +x /boot.sh
RUN cat /tmp/expensave-cron >> /etc/crontab
RUN rm /tmp/expensave-cron

RUN a2dissite 000-default && a2enmod rewrite

FROM --platform=$BUILDPLATFORM node:24-alpine AS frontend

WORKDIR /opt/expensave/frontend

COPY frontend/ /opt/expensave/frontend

RUN npm ci
RUN npm run analyze
RUN npm run build

FROM expensave-base AS application

ARG COMPOSER_ALLOW_SUPERUSER=1

ENV LOCALE=en
ENV REGISTRATION_DISABLED=no

WORKDIR /opt/expensave

# Application files
COPY backend/ /opt/expensave
RUN rm -rf backend/
COPY --from=frontend /opt/expensave/frontend/dist/browser /opt/expensave/public/ui

# Forward symfony cache
RUN mkdir -p /opt/expensave/var/cache

RUN composer install --optimize-autoloader --no-interaction --no-progress --no-dev

RUN a2ensite production

EXPOSE 18000

CMD ["/boot.sh"]

#######################
# Development targets #
#######################
FROM node:24-alpine AS development-frontend

ENV APP_ENV=dev

WORKDIR /opt/expensave/frontend
COPY frontend/package.json /opt/expensave/frontend/
COPY frontend/package-lock.json /opt/expensave/frontend/
RUN npm ci \
    npm i -g @angular/cli \
    apk add git
EXPOSE 18002
CMD ["npm", "run", "dev"]

FROM expensave-base AS development-backend

ENV APP_ENV=dev

WORKDIR /opt/expensave/backend
RUN pecl install \
    xdebug
RUN docker-php-ext-enable \
    xdebug
COPY docker/php/docker-php-ext-xdebug.ini $PHP_INI_DIR/conf.d/
RUN a2ensite development
EXPOSE 18001
