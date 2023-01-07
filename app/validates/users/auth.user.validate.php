<?php
include_once "app/utils/util.php";

$signup = function () {
    $typeRequiredNames = [
        "username" => "username",
        "name" => "name",
        "mail" => "mail",
        "password" => "password",
        "repassword" => "repassword",
    ];
    $typeNames = [
        "username",
        "name",
        "mail",
        "password",
        "repassword",
    ];
    $typePatterns = [
        "username" => "/^[a-zA-Z0-9]{1,25}$/i",
        "name" => "/^(.*){1,25}$/i",
        "mail" => "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i",
        "password" => "/^(.*){1,25}$/i",
        "repassword" => "/^(.*){1,25}$/i",
    ];
    $typeError = [
        "username" => "Tên đăng nhập không hợp lệ",
        "name" => "Tên người dùng không hợp lệ",
        "mail" => "Địa chỉ mail không hợp lệ",
        "password" => "Mật khẩu không hợp lệ",
        "repassword" => "Mật khẩu xác nhận không đúng",
    ];

    $validate = validate(
        $typeNames,
        $typePatterns,
        $typeError,
        $typeRequiredNames
    );

    if (
        isset($validate["data"]["password"])
        && isset($validate["data"]["repassword"])
        && $validate["data"]["password"] != $validate["data"]["repassword"]
    ) {
        $validate["error"]["repassword"] = $typeError["repassword"];
    }

    $validate["isError"] = count($validate["error"]) !== 0;

    return $validate;
};

$signin = function () {
    $typeRequiredNames = [
        "username" => "username",
        "password" => "password",
    ];
    $typeNames = [
        "username",
        "password",
        "remember",
    ];
    $typePatterns = [
        "username" => "/^[a-zA-Z0-9]{1,25}$/i",
        "password" => "/^(.*){1,25}$/i",
    ];
    $typeError = [
        "username" => "Tên đăng nhập không đúng",
        "password" => "Mật khẩu không đúng",
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
    "signup" => $signup,
    "signin" => $signin,
];
