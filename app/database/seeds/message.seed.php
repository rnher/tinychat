<?php

use Faker\Factory;

include_once "app/utils/util.php";

$runCreateRecordMessage = function ($data) {
    return $sql = "INSERT INTO table_message (
        id,
        chatinfo_id,
        sender_id,
        is_brand,
        type,
        content,
        is_seen_member,
        is_seen_customer,
        create_date,
        update_date
        )
    VALUES (
        NULL,
        '{$data["chatinfo_id"]}',
        '{$data["sender_id"]}',
        '{$data["is_brand"]}',
        '{$data["type"]}',
        '{$data["content"]}',
        '{$data["is_seen_member"]}',
        '{$data["is_seen_customer"]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )";
};


$message_sample_record = [];

$faker = Factory::create("vi_VN");

for ($i = 1; $i <= CONF_SEED["count_chatinfo"]; $i++) {
    for ($z = 1; $z <= CONF_SEED["count_message"]; $z++) {
        $is_brand = $faker->numberBetween(0, 1);
        $message_sample_record[] = [
            "chatinfo_id" => $i,
            "sender_id" => $is_brand ? 1 : $i,
            "is_brand" => $is_brand,
            "type" => "text",
            "content" => $faker->paragraph,
            "is_seen_member" => $faker->numberBetween(0, 1),
            "is_seen_customer" => $faker->numberBetween(0, 1),
        ];
    }
}