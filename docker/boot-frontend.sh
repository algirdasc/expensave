#!/bin/bash

cd /opt/expensave/public/ui || exit 1

jq -n \
  --arg locale "$LOCALE" \
  --arg apiUrl "$API_URL" \
  '{apiUrl: $apiUrl, locale: $locale}' > config.json
