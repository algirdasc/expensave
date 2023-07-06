#!/bin/bash

wait-for-it database:3306 -t 30

php bin/console doctrine:database:create --if-not-exists -n
php bin/console doctrine:migrations:migrate --allow-no-migration -n

echo 'DONE!'