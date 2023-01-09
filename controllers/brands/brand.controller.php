<?php
include_once "app/App.php";
include_once "app/libraries/Auth.php";
include_once "app/libraries/Security.php";
include_once "app/utils/util.php";
include_once "models/Brand.php";
include_once "models/Member.php";
include_once "models/ChatInfo.php";
include_once "models/Customer.php";
include_once "models/RelativeMessage.php";

use APP\App;
use APP\LIBRARIES\Auth;
use APP\LIBRARIES\Security;
use MODELS\Brand;
use MODELS\Member;
use MODELS\ChatInfo;
use MODELS\Customer;
use MODELS\RelativeMessage;

$view = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $user = Auth::User();
    $brand = Brand::Find_Where("id", App::MethodGet("id"));
    if (isset($user) && isset($brand)) {
        $member = Member::Find_Where(
            ["user_id", "brand_id", "status"],
            [$user["id"], $brand["id"], Member::Status("active")]

        );

        if (isset($member)) {
            $per_page  = CONF_PAGINATION["chatinfo"];
            $total = ChatInfo::Count_Where("id", "brand_id", $brand["id"]);
            $page_url = CONF_URL["brands"] . "?id=" . $brand["id"] . "&";

            $response["data"] = initPaginationMeta($page_url, $total, $per_page);
            $chatinfos = ChatInfo::Get_With_Page(
                $response["data"],
                ["brand_id", "is_deleted_brand"],
                [$brand["id"], 0]
            );
            $response["data"]["brandID"] = $brand["id"];

            function creatData($chatinfo, $brand)
            {
                $brand_relative_message = RelativeMessage::Find_Where(
                    ["someone_id", "someone_type", "relative_id", "relative_type"],
                    [$brand["id"], RelativeMessage::Type("brand"), $chatinfo["id"], RelativeMessage::Type("chatinfo")]
                );

                $customer = Customer::Find_Where("id", $chatinfo["customer_id"]);
                $customer_relative_message = RelativeMessage::Find_Where(
                    ["someone_id", "someone_type", "relative_id", "relative_type"],
                    [$customer["id"], RelativeMessage::Type("customer"), $chatinfo["id"], RelativeMessage::Type("chatinfo")]
                );

                return  [
                    "chatinfo" => ChatInfo::ShortcutInfo($chatinfo),
                    "customer" => Customer::ShortcutInfo($customer),
                    "re_message" => RelativeMessage::ShortcutInfo($brand_relative_message)
                ];
            };

            if (isset($chatinfos) && isset($chatinfos[0])) {
                foreach ($chatinfos as $index => $chatinfo) {
                    $chatinfos[$index] = creatData($chatinfo, $brand);
                }

                $response["data"]["brand_id"] = $brand["id"];
                $response["data"]["items"] = $chatinfos;
            } else if (isset($chatinfos)) {
                $response["data"]["brand_id"] = $brand["id"];
                $response["data"]["items"] = [creatData($chatinfos, $brand)];
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Không có cuộc trò chuyện";
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Thao tác bị từ chối";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thương hiệu không tồn tại";
    }

    if ($response["isError"]) {
        $response["error"]["brand_id"] = App::MethodGet("id");
    }

    App::responseJson($response);
};

$views = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $members = Auth::Members();
    if (isset($members) && count($members)) {
        $brands = [];

        foreach ($members as $member) {
            if ($member["status"] != Member::Status("not_active")) {
                $brand = Brand::Find_Where("id", $member["brand_id"]);
                if (isset($brand)) {
                    $chatinfos = ChatInfo::Find_Where(
                        ["brand_id", "is_deleted_brand"],
                        [$brand["id"], 0]
                    );

                    $brand = Brand::ShortcutInfo($brand);
                    if (isset($chatinfos) && isset($chatinfos[0])) {
                        $brand["count_chatinfo"] = count($chatinfos);
                    } else {
                        $brand["count_chatinfo"] = 0;
                    }

                    $brands[] = $brand;
                }
            }
        }

        if (!count($brands)) {
            $response["isError"] = true;
            $response["error"]["is"] = "Chưa có thương hiệu";
        } else {
            $response["data"] = $brands;
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    return App::responseJson($response);
};

return [
    "view" => $view,
    "views" => $views,
];
