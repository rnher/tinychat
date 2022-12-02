<?php
include_once "app/App.php";
include_once "models/Brand.php";

use APP\App;
use MODELS\Brand;

$brand_auth = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $uri = App::GetURI();

    if (isset($uri[token])) {
        // Kiểm tra hết hạng token
        $brand = Brand::Find_Not_Expired("token", $uri[token]);

        // Kiểm tra client từ domain nhãn hàng cho phép nhúng
        if (isset($brand)) {
            $is_referer = App::GetRequestReferer($brand["domain"]);

            if ($is_referer) {
                return true;
            }
        }

        $response["isError"] = true;
        $response["error"]["is"] = "Kênh trò chuyện của nhãn hàng không có";
        $response["error"]["not"] = "brand";
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::responseJson($response);
};

return [
    "brand_auth" => $brand_auth,
];
