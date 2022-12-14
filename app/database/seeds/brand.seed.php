<?php

use Faker\Factory;

include_once "app/utils/util.php";

$runCreateRecordBrand = function ($data) {
    return "INSERT INTO table_brand (
        id,
        name,
        name_alias,
        avatar,
        domain,
        token,
        description,
        expire,
        create_date,
        update_date
        )
    VALUES (
        NULL,
        '{$data["name"]}',
        '{$data["name_alias"]}',
        '{$data["avatar"]}',
        '{$data["domain"]}',
        '{$data["token"]}',
        '{$data["description"]}',
        '{$data["expire"]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )";
};


$brand_sample_record = [];

$faker = Factory::create("vi_VN");

for ($i = 1; $i <= CONF_SEED["count_brand"]; $i++) {
    $name = $faker->streetAddress . $i;
    $name_alias = to_alias($name);

    $brand_sample_record[] = [
        "name" =>  $name,
        "name_alias" =>  $name_alias,
        "avatar" =>  "public/images/temp/" . $faker->numberBetween(1, 15) . ".jpg",
        "description" => $faker->paragraph,
        "expire" => time() + 1000 * 60 * 60 * 24, // 24h
    ];
}
