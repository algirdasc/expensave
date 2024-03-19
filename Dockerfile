FROM node:18-alpine as frontend

WORKDIR /opt/expensave/frontend

COPY frontend/ /opt/expensave/frontend

RUN npm ci
# RUN npm run analyze
RUN npm run build

FROM ubuntu:22.04

MAINTAINER Algirdas <algirdas.cic@gmail.com>

ENV PHP_VERSION php8.2
ENV COMPOSER_ALLOW_SUPERUSER 1

RUN apt update && \
    apt install -y --no-install-recommends \
    apt-utils \
    gpg-agent \
    software-properties-common \
    nginx \
    supervisor
RUN add-apt-repository ppa:ondrej/php
RUN apt install -y \
    ${PHP_VERSION}-fpm \
    ${PHP_VERSION}-cli \
    ${PHP_VERSION}-curl \
    ${PHP_VERSION}-sqlite3 \
    ${PHP_VERSION}-gd \
    ${PHP_VERSION}-zip \
    ${PHP_VERSION}-intl \
    ${PHP_VERSION}-dom

WORKDIR /opt/expensave/backend

# Services
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
COPY docker/entrypoint.sh /entrypoint.sh
COPY docker/supervisor/supervisor.conf /etc/supervisor/conf.d/supervisor.conf
COPY docker/nginx/ /etc/nginx

# Application files
COPY backend/ /opt/expensave/backend
COPY --from=frontend /opt/expensave/frontend/dist /opt/expensave/frontend

# Maintenance
RUN rm /etc/nginx/sites-enabled/default
RUN mkdir -p /run/php && touch /run/php/${PHP_VERSION}-fpm.sock && touch /run/php/${PHP_VERSION}-fpm.pid
RUN mkdir -p /opt/expensave/backend/var/db
RUN chmod +x /entrypoint.sh
RUN composer install --optimize-autoloader --no-interaction --no-progress

# Redirect logs
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log \
	&& ln -sf /dev/stderr /var/log/${PHP_VERSION}-fpm.log

VOLUME /opt/expensave/backend/var/db

EXPOSE 18001
EXPOSE 18002

ENTRYPOINT ["/entrypoint.sh"]
