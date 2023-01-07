<?php
include_once "app/utils/util.php";

$update = function () {
    $typeRequiredNames = [
        "password" => "password",
    ];
    $typeNames = [
        "name",
        "mail",
        "password",
        "avatar",
        "newpassword",
        "repassword",
    ];
    $typePatterns = [
        "name" =>  "/^(.*){1,25}/i",
        "mail" => "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i",
        "newpassword" =>  "/^[.*]{1,25}$/i",
    ];
    $typeError = [
        "name" => "Tên người dùng không hợp lệ",
        "mail" => "Địa chỉ mail không hợp lệ",
        "password" => "Mật khẩu hiện tại không đúng",
        "newpassword" => "Mật khẩu mới không hợp lệ",
        "repassword" => "Mật khẩu xác nhận không không trùng khớp",
    ];

    $validate = validate(
        $typeNames,
        $typePatterns,
        $typeError,
        $typeRequiredNames
    );

    // Nếu có newpass mà không có repass hoặc repass != newpass
    if (
        (isset($validate["data"]["newpassword"])
            && !isset($validate["data"]["repassword"]))
        || (isset($validate["data"]["newpassword"])
            && isset($validate["data"]["repassword"])
            && ($validate["data"]["newpassword"]
                != $validate["data"]["repassword"]))
    ) {
        $validate["error"]["repassword"] =  $typeError["repassword"];
    }

    if (
        !isset($validate["data"]["newpassword"])
        && isset($validate["data"]["repassword"])

    ) {
        $validate["error"]["newpassword"] =  $typeError["newpassword"];
    }

    $validate["isError"] = count($validate["error"]) !== 0;

    return $validate;
};

return [
    "update" => $update,
];
