<?php
include_once "app/App.php";
include_once "models/Brand.php";
include_once "models/ChatSettings.php";

use APP\App;
use MODELS\Brand;
use MODELS\ChatSettings;

$brand_auth = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => true
    ];

    $uri = App::GetURI();

    if (isset($uri[token])) {
        // Kiểm tra hết hạng token
        $brand = Brand::Find_Not_Expired("token", $uri[token]);

        // Kiểm tra client từ domain thương hiệu cho phép nhúng
        if (isset($brand)) {
            $is_referer = App::GetRequestReferer($brand["domain"]);

            if ($is_referer) {
                return true;
            }
        }

        $response["error"]["is"] = "Kênh trò chuyện của thương hiệu không có";
        $response["error"]["not"] = "brand";
        $response["error"]["brand"] = [
            "name" => CONF_APP["name"],
            "description" => CONF_APP["description"],
            "settings" => ChatSettings::Get_Default("")
        ];
    } else {
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::responseJson($response);
};

return [
    "brand_auth" => $brand_auth,
];
