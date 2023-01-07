<?php
include_once "app/utils/util.php";

$create = function () {
    $typeRequiredNames = [
        "name" => "name"
    ];
    $typeNames = [
        "name",
        "phone",
        "mail"
    ];
    $typePatterns = [
        "name" => "/^(.*){1,100}$/i",
        "phone" => "/(84|0[3|5|7|8|9])+([0-9]{8})\b/i",
        "mail" => "/^[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i",
    ];
    $typeError = [
        "name" => "Tên không hợp lệ",
        "phone" => "Số điện thoại không hợp lệ",
        "mail" => "Địa chỉ mail không hợp lệ",
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
];
