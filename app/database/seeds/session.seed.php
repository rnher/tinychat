<?php

use Faker\Factory;

include_once "app/utils/util.php";

$runCreateRecordSession = function ($data) {
    return $sql = "INSERT INTO table_session (
        id,
        token,
        user_id,
        is_login,
        expire,
        create_date,
        update_date
        )
    VALUES (
        NULL,
        '{$data["token"]}',
        '{$data["user_id"]}',
        '{$data["is_login"]}',
        '{$data["expire"]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )";
};

$session_sample_record = [];

$faker = Factory::create("vi_VN");
