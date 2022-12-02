<?php
include_once "app/services/Auth.php";
include_once "app/App.php";
include_once "models/Customer.php";
include_once "models/Brand.php";
include_once "models/ChatInfo.php";
include_once "models/User.php";
include_once "models/Message.php";
include_once "app/utils/util.php";

use APP\App;
use MODELS\Brand;
use MODELS\ChatInfo;
use MODELS\Customer;
use MODELS\Message;
use APP\SERVICES\Auth;

$view = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $customer = Auth::Customer();

    $uri = App::GetURI();

    $brand = Brand::Find_Not_Expired("token", $uri[token]);

    // Xác thực người dùng và tồn tại nhãn hàng
    if (isset($customer) && isset($brand)) {
        // Xác thực người dùng và tồn tại nhãn hàng
        $chatinfo = ChatInfo::Find_Where(
            ["customer_id",   "brand_id"],
            [$customer["id"],   $customer["brand_id"]]
        );

        $per_page  = CONF_PAGINATION["message"];
        $total = Message::Count_Where("id", "chatinfo_id", $chatinfo["id"]);
        $page_url = CONF_URL["clients"] . "?" .  token . "=" . $uri[token] . "&";

        $response["data"] = initPaginationMeta($page_url, $total, $per_page);
        $messages = Message::Get_With_Page($response["data"], "chatinfo_id", $chatinfo["id"]);

        function creatData($message, $customer, $brand)
        {
            $isSelf = false;

            // Tin nhắn của nhãn hàng
            if ($message["is_brand"]) {
                // Người lấy là khách
                $name = $brand["name"];
                $avatar = $brand["avatar"];
            } else {
                // Tin nhắn của khách
                $name = $customer["name"];
                $avatar = $customer["avatar"];

                $isSelf = true;
            }

            // Nội dung tin nhắn
            return  [
                "isSelf" =>  $isSelf,
                "userName" => $name,
                "avatar" => $avatar,
                "content" => $message["content"],
                "time" => $message["create_date"],
                "type" => $message["type"],
            ];
        };

        if (isset($messages)) {
            // Một tin nhắn
            if (!isset($messages[0])) {
                $messages = [$messages];
            }

            foreach ($messages as $index => $message) {
                $messages[$index] = creatData($message, $customer, $brand);
            }

            $response["data"]["items"] =  $messages;
        } else {
            // Trả về rỗng khi hêt tin nhắn. Client check rỗng để không request lại nữa
            $response["data"]["items"] = [];
        }

        $response["data"]["ssid"] = App::getEndcodeCookie("tinychat_client_ssid");
        $response["data"]["chatinfo_id"] = $chatinfo["id"];
        $response["data"]["is_seen"] = $chatinfo["is_seen_member"];
        $response["data"]["users"]["brand"] = Brand::ShortcutInfo($brand);
        $response["data"]["users"]["customer"] = Customer::ShortcutInfo($customer);
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::responseJson($response);
};

$create = function () {
    $validater = include_once "app/validates/chatinfos/chatinfo.validate.php";
    $response = $validater["create"]();
    $data = $response["data"];

    $uri = App::GetURI();

    if (!$response["isError"]) {
        $brand = Brand::Find_Not_Expired("token", $uri[token]);

        // Nhãn hàng đã tồn tại
        if (isset($brand)) {
            $customer = Auth::Customer();

            // Khách hàng đã tồn tại
            if (isset($customer)) {
                $chatinfo = ChatInfo::Find_Where(
                    ["customer_id", "brand_id"],
                    [$customer["id"], $brand["id"]]
                );

                // Cuộc trò chuyện chưa tạo
                if (!isset($chatinfo)) {
                    $chatinfo_id = ChatInfo::Save([
                        "brand_id" => $brand["id"],
                        "customer_id" => $customer["id"],
                        "is_seen_member" => 0,
                        "is_seen_customer" => 0,
                    ]);

                    // Có customer nhưng không có trò chuyện
                    $response["data"] = [
                        "customer_id" =>  $customer["id"],
                        "chatinfo_id" => $chatinfo_id
                    ];
                } else {
                    // Có customer và có trò chuyện
                    $response["data"] = [
                        "customer_id" => $chatinfo["customer_id"],
                        "chatinfo_id" => $chatinfo["id"],
                    ];
                }
            } else {
                // Khách hàng chưa tồn tại
                // Không có customer và không có trò chuyện
                $token = Customer::Create_Token($data);

                $customer_id = Customer::Save([
                    "token" => $token,
                    "brand_id" => $brand["id"],
                    "name" =>  $data["name"],
                    "phone" => $data["phone"],
                    "is_active" => 0,
                    "avatar" => Customer::Get_Default_Avatar()
                ]);

                $chatinfo_id = ChatInfo::Save([
                    "brand_id" => $brand["id"],
                    "customer_id" =>  $customer_id,
                    "is_seen_member" => 0,
                    "is_seen_customer" => 0,
                ]);

                App::Cookie("tinychat_client_ssid", $token, time() + CONF_COOKIE["expire"], '/');

                $response["data"] = [
                    "customer_id" => $customer_id,
                    "chatinfo_id" => $chatinfo_id,
                    "ssid" => App::getEndcodeCookie($token, true)
                ];
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Kênh trò chuyện của nhãn hàng không có";
            $response["error"]["not"] = "brand";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Tạo cuộc trò chuyện không thành công";
    }

    App::responseJson($response);
};

return [
    "view" => $view,
    "create" => $create,
];
