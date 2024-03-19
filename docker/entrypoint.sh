#!/bin/bash

php bin/console app:secrets:regenerate .env

composer dump-env prod

php bin/console doctrine:database:create --if-not-exists -n || true
php bin/console doctrine:migrations:migrate --allow-no-migration -n

php bin/console lexik:jwt:generate-keypair -n --skip-if-exists

/usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisor.conf
