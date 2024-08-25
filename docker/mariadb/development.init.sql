CREATE DATABASE IF NOT EXISTS dev_expensave;
CREATE DATABASE IF NOT EXISTS dev_expensave_test;

GRANT ALL PRIVILEGES ON dev_expensave_test.* TO 'dev_expensave'@'%';
FLUSH PRIVILEGES;