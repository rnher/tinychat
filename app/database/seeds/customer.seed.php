<?php

use Faker\Factory;

include_once "app/utils/util.php";

$runCreateRecordCustomer = function ($data) {
    return $sql = "INSERT INTO table_customer (
        id,
        token,
        brand_id,
        name,
        phone,
        is_active,
        avatar,
        create_date,
        update_date
        )
    VALUES (
        NULL,
        '{$data["token"]}',
        '{$data["brand_id"]}',
        '{$data["name"]}',
        '{$data["phone"]}',
        '{$data["is_active"]}',
        '{$data["avatar"]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )";
};


$customer_sample_record = [];

$faker = Factory::create("vi_VN");

for ($i = 1; $i <= CONF_SEED["count_brand"]; $i++) {
    for ($j = 1; $j <= CONF_SEED["count_customer"]; $j++) {
        $customer_sample_record[] = [
            "token" => create_random_bytes(),
            "brand_id" => $i,
            "name" => $faker->streetAddress . $j,
            "phone" => $faker->postcode,
            "is_active" => $faker->numberBetween(0, 1),
            "avatar" =>  "public/images/temp/" . $faker->numberBetween(1, 15) . ".jpg",
        ];
    }
}
