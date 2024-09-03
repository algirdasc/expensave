<?php

$filename = $argv[1];

$sem_key = ftok($filename, 'S');
$sem_id = sem_get($sem_key, 1);

if (sem_acquire($sem_id)) {
    echo 'ok';
    sleep(30);
    echo 'done';
}

sem_release($sem_id);