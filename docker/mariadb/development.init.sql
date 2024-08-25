CREATE DATABASE IF NOT EXISTS 'dev-expensave';
CREATE DATABASE IF NOT EXISTS 'dev-expensave-test';

GRANT ALL PRIVILEGES ON 'dev-expensave-test'.* TO 'dev-expensave'@'%';
FLUSH PRIVILEGES;