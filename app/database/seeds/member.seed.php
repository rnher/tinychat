<?php

use Faker\Factory;

include_once "app/utils/util.php";

$runCreateRecordMember = function ($data) {
    return $sql = "INSERT INTO table_member (
        id,
        brand_id,
        user_id,
        role,
        create_date,
        update_date
        )
    VALUES (
        NULL,
        '{$data["brand_id"]}',
        '{$data["user_id"]}',
        '{$data["role"]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )";
};


$member_sample_record = [];

$faker = Factory::create("vi_VN");
