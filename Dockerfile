FROM node:20-alpine as frontend

WORKDIR /opt/expensave/frontend

COPY frontend/ /opt/expensave/frontend

RUN npm ci
# RUN npm run analyze
RUN npm run build

FROM ubuntu:22.04

MAINTAINER Algirdas <algirdas.cic@gmail.com>

ENV PHP_VERSION 8.2
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV CORS_ALLOW_ORIGIN https://expensave.backend

RUN apt update && \
    apt install -y --no-install-recommends \
    apt-utils \
    gpg-agent \
    software-properties-common \
    nginx \
    supervisor
RUN add-apt-repository ppa:ondrej/php
RUN apt install -y \
    php${PHP_VERSION}-fpm \
    php${PHP_VERSION}-cli \
    php${PHP_VERSION}-curl \
    php${PHP_VERSION}-sqlite3 \
    php${PHP_VERSION}-gd \
    php${PHP_VERSION}-zip \
    php${PHP_VERSION}-intl \
    php${PHP_VERSION}-dom

WORKDIR /opt/expensave/backend

# Services
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Entry point
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Config files
COPY docker/supervisor/supervisor.conf /etc/supervisor/conf.d/supervisor.conf
COPY docker/php/ /etc/php/${PHP_VERSION}/fpm
COPY docker/nginx/ /etc/nginx

# Application files
COPY backend/ /opt/expensave/backend
COPY --from=frontend /opt/expensave/frontend/dist /opt/expensave/frontend

# Maintenance
RUN rm /etc/nginx/sites-enabled/default
RUN mkdir -p /opt/expensave/backend/var/db

# Forward symfony cache
RUN mkdir /tmp/symfony-cache && ln -sf /tmp/symfony-cache /opt/expensave/backend/var/cache

RUN composer install --optimize-autoloader --no-interaction --no-progress

VOLUME /opt/expensave/backend/var/db

EXPOSE 18001
EXPOSE 18002

ENTRYPOINT ["/entrypoint.sh"]
