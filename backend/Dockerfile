FROM webdevops/php-nginx:8.1-alpine

ENV WEB_DOCUMENT_ROOT '/usr/src/app'
EXPOSE 4201

WORKDIR /usr/src/app

# Copy files
COPY ./build/symfony-entrypoint.sh /entrypoint.d/symfony-entrypoint.sh
COPY ./build/wait-for-it.sh /usr/local/bin/wait-for-it
COPY ./build/nginx/vhost.conf /opt/docker/etc/nginx/vhost.conf
COPY . /usr/src/app

# Entry point
RUN chmod +x /entrypoint.d/symfony-entrypoint.sh
RUN chmod +x /usr/local/bin/wait-for-it

# Setup web server
RUN rm /opt/docker/etc/nginx/vhost.ssl.conf
RUN chown -R application:application /usr/src/app

# Switch to app user
USER application

# Regenerate secrets
RUN sed "s/{REGENERATE_SECRET}/"$(openssl rand -hex 32)"/" .env.dist

# Install stuff
RUN composer install

# Regenerate JWT keys
RUN php bin/console lexik:jwt:generate-keypair -n

# Dump .env
RUN composer dump-env prod