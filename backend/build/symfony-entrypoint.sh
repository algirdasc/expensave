#!/bin/bash

php bin/console lexik:jwt:generate-keypair -n --skip-if-exists

composer dump-env prod

sed "s/{REGENERATE_SECRET}/"$(openssl rand -hex 32)"/" .env.local.php

# wait-for-it database:3306 -t 30

php bin/console doctrine:database:create --if-not-exists -n
php bin/console doctrine:migrations:migrate --allow-no-migration -n
