FROM webdevops/php-nginx:8.1-alpine

ENV WEB_DOCUMENT_ROOT '/usr/src/app'
ENV LOG_STDOUT 'stdout'
ENV LOG_STDERR 'stderr'

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

# Install stuff
RUN composer install

# Set user/group
RUN chown -R $APPLICATION_UID:$APPLICATION_GID /usr/src/app