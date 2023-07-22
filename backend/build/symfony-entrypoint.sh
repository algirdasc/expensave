#!/bin/bash

php bin/console lexik:jwt:generate-keypair -n --skip-if-exists

sed "s/{REGENERATE_SECRET}/"$(openssl rand -hex 32)"/" .env.dist

php bin/console doctrine:database:create --if-not-exists -n
php bin/console doctrine:migrations:migrate --allow-no-migration -n

php bin/console lexik:jwt:generate-keypair -n --skip-if-exists
sed "s/{REGENERATE_SECRET}/"$(openssl rand -hex 32)"/" .env.dist

if [[ "$APP_ENV" == "prod" ]] then; composer dump-env prod; fi
