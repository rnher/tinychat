<?php

use Faker\Factory;

include_once "app/utils/util.php";

$runCreateRecordChatInfo = function ($data) {
    return "INSERT INTO table_chat_info (
        id,
        brand_id,
        customer_id,
        is_seen_brand,
        is_seen_customer,
        create_date,
        update_date
        )
    VALUES (
        NULL,
        '{$data["brand_id"]}',
        '{$data["customer_id"]}',
        '{$data["is_seen_brand"]}',
        '{$data["is_seen_customer"]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )";
};


$chatinfo_sample_record = [];

$faker = Factory::create("vi_VN");

for ($i = 1; $i <= CONF_SEED["count_customer"]; $i++) {
    $chatinfo_sample_record[] = [
        "brand_id" => 1,
        "customer_id" => $i,
        "is_seen_brand" => 1,
        "is_seen_customer" => 0,
    ];
}
