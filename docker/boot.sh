#!/bin/bash

# Frontend
cd /opt/expensave/public/ui || exit 1

if [ "$REGISTRATION_DISABLED" = "yes" ]; then REGISTRATION_DISABLED=true; else REGISTRATION_DISABLED=false; fi

jq -n \
  --arg locale "$LOCALE" \
  --arg apiUrl "$API_URL" \
  --argjson registrationDisabled $REGISTRATION_DISABLED \
  '{
  apiUrl: $apiUrl,
  locale: $locale,
  registrationDisabled: $registrationDisabled
  }' > config.json

# Backend
cd /opt/expensave || exit 1

printenv > /etc/environment
cron

php bin/console app:secrets:regenerate .env

composer dump-env prod

# Wait for database
echo "Waiting for database..."
for i in {1..30}; do
  if php bin/console doctrine:database:create --if-not-exists -n; then
    break
  fi
  echo "Database not ready yet, waiting..."
  sleep 2
done

php bin/console doctrine:migrations:migrate --allow-no-migration -n

php bin/console lexik:jwt:generate-keypair -n --skip-if-exists

chown -R www-data:www-data var/

# Run apache
/usr/bin/supervisord -c /etc/supervisor/supervisord.conf
