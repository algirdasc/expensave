#!/bin/bash

php bin/console app:secrets:regenerate --no-ansi .env

composer dump-env prod

php bin/console doctrine:database:create -n || true
php bin/console doctrine:migrations:migrate --no-ansi --allow-no-migration -n

php bin/console lexik:jwt:generate-keypair --no-ansi -n --skip-if-exists

/usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisor.conf
