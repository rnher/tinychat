<?php
include_once "app/utils/util.php";

$create = function () {
    $typeRequiredNames = [
        "name" => "name",
        "phone" => "phone"
    ];
    $typeNames = [
        "name",
        "phone"
    ];
    $typePatterns = [
        "name" => "/^(.*){1,100}$/i",
        "phone" => "/^([0-9]+){1,100}$/i"
    ];
    $typeError = [
        "name" => "Tên không hợp lệ",
        "phone" => "Số điện thoại không hợp lệ"
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
