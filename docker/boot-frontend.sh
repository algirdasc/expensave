#!/bin/bash

cd /opt/expensave/frontend || exit 1

jq -n \
  --arg apiUrl "$API_URL" \
  --arg locale "$LOCALE" \
  '{apiUrl: $apiUrl, locale: $locale}' > assets/config.prod.json
