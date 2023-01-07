<?php
include_once "app/utils/util.php";
include_once "app/services/UploadImage.php";

use APP\SERVICES\UploadImage;

$create = function () {
    $typeRequiredNames = [
        "name" => "name",
        "description" => "description"
    ];
    $typeNames = [
        "name",
        "description",
        "greeting"
    ];
    $typePatterns = [
        "name" => "/^(.*){1,100}$/i",
        "description" => "/^(.*){1,2000}$/i",
        "greeting" => "/^(.*){1,500}$/i",
    ];
    $typeError = [
        "name" => "Tên thương hiệu không hợp lệ",
        "description" => "Mô tả thương hiệu không hợp lệ",
        "greeting" => "Lời chào thương hiệu không hợp lệ",
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
        "greeting",
        "password",
        "avatar",
        "banner",
        "domain",
        "is_require_phone",
        "is_require_mail",
        "brand_name_color",
        "brand_text_color",
        "brand_chat_color",
        "brand_chat_bg",
        "client_chat_color",
        "client_chat_bg",
        "main_color",
        "main_bg",
        // TODO
        // "main_text",
        // "main_icon",
        "chat_bg",
    ];
    $typePatterns = [
        "name" => "/^(.*){1,100}$/i",
        "description" => "/^(.*){1,2000}$/i",
        "greeting" => "/^(.*){1,500}$/i",
        "domain" => "/^((http)|(https))(:\/\/)([a-zA-Z0-9-.\/]*)$/i",
        "is_require_phone" => "/^([0-1]){1}$/i",
        "is_require_mail" => "/^([0-1]){1}$/i",
        "brand_name_color" => "/^([a-zA-Z0-9#]*){1,7}$/i",
        "brand_text_color" => "/^([a-zA-Z0-9#]*){1,7}$/i",
        "brand_chat_color" => "/^([a-zA-Z0-9#]*){1,7}$/i",
        "brand_chat_bg" => "/^([a-zA-Z0-9#]*){1,7}$/i",
        "client_chat_color" => "/^([a-zA-Z0-9#]*){1,7}$/i",
        "client_chat_bg" => "/^([a-zA-Z0-9#]*){1,7}$/i",
        "main_color" => "/^([a-zA-Z0-9#]*){1,7}$/i",
        "main_bg" => "/^([a-zA-Z0-9#]*){1,7}$/i",
        // TODO
        // "main_text" => "/^(.*){1,100}$/i",
        // "main_icon" => "/^(.*){1,100}$/i",
        "chat_bg" => "/^([a-zA-Z0-9#]*){1,7}$/i",
    ];
    $typeError = [
        "name" => "Tên thương hiệu không hợp lệ",
        "description" => "Mô tả thương hiệu không hợp lệ",
        "greeting" => "Lời chào thương hiệu không hợp lệ",
        "password" => "Mật khẩu hiện tại không đúng",
        "domain" => "Tên miền không hợp lệ",
        "is_require_mail" => "Yêu cầu cung cấp mail không hợp lệ",
        "is_require_phone" => "Yêu cầu cung cấp số điện thoại không hợp lệ",
        "brand_name_color" => "Mã màu không hợp lệ",
        "brand_text_color" => "Mã màu không hợp lệ",
        "brand_chat_color" => "Mã màu không hợp lệ",
        "brand_chat_bg" => "Mã màu không hợp lệ",
        "client_chat_color" => "Mã màu không hợp lệ",
        "client_chat_bg" => "Mã màu không hợp lệ",
        "main_color" => "Mã màu không hợp lệ",
        "main_bg" => "Mã màu không hợp lệ",
        // TODO
        // "main_text"=> "Mã màu không hợp lệ",
        // "main_icon"=> "Mã màu không hợp lệ",
        "chat_bg" => "Mã màu không hợp lệ",
        "avatar" => "Ảnh đại hiện không hợp lệ. Định dạng cho phép "
            . implode(", ", CONF_UPLOAD["image"]["formats"]) . ". Kích thước đối đa " . CONF_UPLOAD["image"]["size"] . "MB",
        "banner" => "Ảnh bìa không hợp lệ. Định dạng cho phép "
            . implode(", ", CONF_UPLOAD["image"]["formats"]) . ". Kích thước đối đa " . CONF_UPLOAD["image"]["size"] . "MB",
    ];

    $validate = validate(
        $typeNames,
        $typePatterns,
        $typeError,
        $typeRequiredNames
    );

    $data = $validate["data"];
    if (isset($data["avatar"])) {
        $image = new UploadImage();
        $data["avatar"] =  $image->validate([
            "name" => "avatar",
            "data" => $data["avatar"]
        ]);

        if (!$data["avatar"]) {
            unset($data["avatar"]);
            $validate["isError"] = true;
            $validate["error"]["avatar"] = $typeError["avatar"];
        }
    }

    if (isset($data["banner"])) {
        $image = new UploadImage();
        $data["banner"] =  $image->validate([
            "name" => "banner",
            "data" => $data["banner"]
        ]);

        if (!$data["banner"]) {
            unset($data["banner"]);
            $validate["isError"] = true;
            $validate["error"]["banner"] = $typeError["banner"];
        }
    }

    return $validate;
};

$delete = function () {
    $typeRequiredNames = [
        "password" => "password",
    ];
    $typeNames = [
        "password",
    ];
    $typePatterns = [];
    $typeError = [
        "password" => "Mật khẩu hiện tại không đúng",
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
    "update" => $update,
    "delete" => $delete,
];
