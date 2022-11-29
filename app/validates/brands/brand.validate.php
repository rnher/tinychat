<?php
include_once "app/utils/util.php";

$create = function () {
    $typeRequiredNames = [
        "name" => "name",
        "description" => "description",
    ];
    $typeNames = [
        "name",
        "description",
        // "avatar"
    ];
    $typePatterns = [
        "name" => "/^(.*){1,100}$/i",
        "description" => "/^(.*){1,2000}$/i",
    ];
    $typeError = [
        "name" => "Tên thương hiệu không hợp lệ",
        "description" => "Mô tả thương hiệu không hợp lệ",
    ];

    $validate = validate(
        $typeNames,
        $typePatterns,
        $typeError,
        $typeRequiredNames
    );

    return $validate;
};

$update = function () {
    $typeRequiredNames = [
        "password" => "password",
    ];
    $typeNames = [
        "name",
        "description",
        "password",
        "avatar",
        "domain",
    ];
    $typePatterns = [
        "name" => "/^(.*){1,100}$/i",
        "description" => "/^(.*){1,2000}$/i",
        "domain" => "/^((http)|(https))(:\/\/)([a-zA-Z0-9-.\/]*)$/i"
    ];
    $typeError = [
        "name" => "Tên thương hiệu không hợp lệ",
        "description" => "Mô tả thương hiệu không hợp lệ",
        "password" => "Mật khẩu hiện tại không đúng",
        "domain" => "Tên miền không hợp lệ",
    ];

    $validate = validate(
        $typeNames,
        $typePatterns,
        $typeError,
        $typeRequiredNames
    );

    return $validate;
};


return [
    "create" => $create,
    "update" => $update
];
