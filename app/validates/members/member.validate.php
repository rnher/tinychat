<?php
include_once "app/utils/util.php";

$create = function () {
    $typeRequiredNames = [
        "mail" => "mail"
    ];
    $typeNames = [
        "mail",
    ];
    $typePatterns = [
        "mail" => "/^[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i",
    ];
    $typeError = [
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
