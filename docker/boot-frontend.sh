#!/bin/bash

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
