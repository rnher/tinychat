<?php

use Faker\Factory;

include_once "app/utils/util.php";

$runCreateRecordUser = function ($data) {
    return $sql = "INSERT INTO table_user (
        id,
        username,
        name,
        password,
        avatar,
        create_date,
        update_date
        )
    VALUES (
        NULL,
        '{$data["username"]}',
        '{$data["name"]}',
        '{$data["password"]}',
        '{$data["avatar"]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )";
};


$user_sample_record = [
];

$faker = Factory::create("vi_VN");
