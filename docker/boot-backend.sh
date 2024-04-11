#!/bin/bash

cd /opt/expensave || exit 1

if [[ -z "${DATABASE_URL}" ]]; then
  while ! mysqladmin ping --silent; do
      sleep 1
  done

  if ! test -f /mysql.initialized; then
    mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql
    mysql -uroot -e "GRANT ALL PRIVILEGES ON expensave.* TO 'expensave'@'localhost' IDENTIFIED BY 'expensave'; FLUSH PRIVILEGES;"
    touch /mysql.initialized
  fi
fi

cron

php bin/console app:secrets:regenerate .env

composer dump-env prod

php bin/console doctrine:database:create --if-not-exists -n
php bin/console doctrine:migrations:migrate --allow-no-migration -n

php bin/console lexik:jwt:generate-keypair -n --skip-if-exists
