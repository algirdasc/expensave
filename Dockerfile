FROM ubuntu:22.04 as base

MAINTAINER Algirdas <algirdas.cic@gmail.com>

ARG DEBIAN_FRONTEND=noninteractive
ARG PHP_VERSION=8.2

RUN apt update && \
    apt install -y --no-install-recommends \
    apt-utils \
    gpg-agent \
    software-properties-common \
    nginx \
    mariadb-server-10.6 \
    cron \
    supervisor
RUN add-apt-repository ppa:ondrej/php
RUN apt install -y \
    php${PHP_VERSION}-fpm \
    php${PHP_VERSION}-cli \
    php${PHP_VERSION}-curl \
    php${PHP_VERSION}-mysql \
    php${PHP_VERSION}-gd \
    php${PHP_VERSION}-zip \
    php${PHP_VERSION}-intl \
    php${PHP_VERSION}-dom

# Services
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Config files
COPY docker/expensave-cron /etc/cron.d/expensave-cron
COPY docker/supervisor/supervisor.conf /etc/supervisor/conf.d/supervisor.conf
COPY docker/php/ /etc/php/${PHP_VERSION}/fpm
COPY docker/nginx/ /etc/nginx
COPY docker/boot-backend.sh /boot-backend.sh
COPY docker/boot-frontend.sh /boot-frontend.sh

RUN chmod +x /boot-*.sh
RUN chmod 0644 /etc/cron.d/expensave-cron
RUN crontab /etc/cron.d/expensave-cron

RUN rm /etc/nginx/sites-enabled/default

# MariaDB config
VOLUME /var/lib/mysql
RUN mkdir -p /run/mysqld && chown mysql:mysql /run/mysqld
RUN mysql_install_db

FROM node:20-alpine as frontend

ENV API_URL http://localhost:18001
ENV LOCALE en

WORKDIR /opt/expensave/frontend

COPY frontend/ /opt/expensave/frontend

RUN npm ci
# RUN npm run analyze
RUN npm run build

FROM base

ARG COMPOSER_ALLOW_SUPERUSER=1

ENV CORS_ALLOW_ORIGIN .*

WORKDIR /opt/expensave/backend

# Application files
COPY backend/ /opt/expensave/backend
COPY --from=frontend /opt/expensave/frontend/dist /opt/expensave/frontend

# Forward symfony cache
RUN mkdir -p /opt/expensave/backend/var/cache
RUN mkdir /tmp/symfony-cache && ln -sf /tmp/symfony-cache /opt/expensave/backend/var/cache
RUN mkdir /tmp/symfony-log && ln -sf /tmp/symfony-log /opt/expensave/backend/var/log
RUN chown www-data:www-data /tmp/symfony-cache
RUN chown www-data:www-data /tmp/symfony-log

RUN composer install --optimize-autoloader --no-interaction --no-progress

EXPOSE 18001
EXPOSE 18002

CMD ["supervisord", "-n", "-t", "-c", "/etc/supervisor/conf.d/supervisor.conf"]
