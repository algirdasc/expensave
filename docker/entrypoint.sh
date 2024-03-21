#!/bin/bash

supervisord -s -e error -t -c /etc/supervisor/conf.d/supervisor.conf

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

php bin/console app:secrets:regenerate --no-ansi .env

composer dump-env prod

php bin/console doctrine:database:create --no-ansi --if-not-exists -n
php bin/console doctrine:migrations:migrate --no-ansi --allow-no-migration -n

php bin/console lexik:jwt:generate-keypair --no-ansi -n --skip-if-exists

# Do not exist
trap : TERM INT; sleep infinity & wait