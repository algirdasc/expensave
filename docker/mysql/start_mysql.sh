#!/bin/bash

if [[ -z "${DATABASE_URL}" ]]; then
  /usr/sbin/mysqld
else
  sleep infinity
fi
