<?php
include_once "app/services/Auth.php";
include_once "app/App.php";
include_once "models/Customer.php";
include_once "models/Brand.php";
include_once "models/ChatInfo.php";
include_once "models/User.php";
include_once "models/message.php";
include_once "app/utils/util.php";

use APP\App;
use MODELS\User;
use MODELS\Brand;
use MODELS\ChatInfo;
use MODELS\Customer;
use MODELS\message;
use APP\SERVICES\Auth;

$view = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $user = Auth::User();
    $member = Auth::Member();
    $customer = Auth::Customer();

    if (isset($user)) {
        $is_member =  true;
        $someone = $user;
        $someone["brand_id"] = $member["brand_id"];
    } else {
        $is_member =  false;
        $someone =  $customer;
    }

    $uri = App::GetURI();
    $column = isset($uri[token]) ? token : id;
    $value = isset($uri[token]) ? $uri[token] : $someone["brand_id"];

    // Kiểm tra hết hạng token
    $brand = Brand::Find_Not_Expired([$column], [$value]);
    $is_referer = true;

    // Kiểm tra client từ domain nhãn hàng cho phép nhúng
    if (isset($uri[token])) {
        $is_referer = App::GetRequestReferer($brand["domain"]);
    }

    // Xác thực người dùng và tồn tại nhãn hàng
    if ($is_referer && isset($someone) && isset($brand)) {
        if ($is_member) {
            $chatinfo = ChatInfo::Find_Where(
                ["id",   "brand_id"],
                [$uri[id],   $brand["id"]]
            );
        } else {
            $chatinfo = ChatInfo::Find_Where(
                ["customer_id",   "brand_id"],
                [$someone["id"],   $brand["id"]]
            );
        }

        $per_page  = CONF_PAGINATION["message"];
        $total = Message::Count_Where("id", "chatinfo_id", $chatinfo["id"]);
        $page_url = CONF_URL["chats"] . "?" . (isset($uri[token]) ? token . "=" . $uri[token] . "&" : "");

        $response["data"] = initPaginationMeta($page_url, $total, $per_page);
        $messages = Message::Get_With_Page($response["data"], "chatinfo_id", $chatinfo["id"]);
        $response["data"]["chatinfo_id"] =  $chatinfo["id"];

        function creatData($message, $someone, $brand, $is_member)
        {
            $isSelf = false;

            // Tin nhắn của nhãn hàng
            if ($message["is_brand"]) {
                // Người lấy là cửa hàng
                if ($is_member) {
                    $u = User::Find_Where("id", $message["sender_id"]);

                    $name = $u["name"];
                    $avatar = $u["avatar"];

                    $isSelf = true;
                } else {
                    // Người lấy là khách
                    $name = $brand["name"];
                    $avatar = $brand["avatar"];
                }
            } else {
                // Tin nhắn của khách

                // Người lấy là cửa hàng
                if ($is_member) {
                    $c = Customer::Find_Where("id", $message["sender_id"]);

                    $name = $c["name"];
                    $avatar = $c["avatar"];
                } else {
                    // Người lấy là khách

                    $name = $someone["name"];
                    $avatar = $someone["avatar"];

                    $isSelf = true;
                }
            }

            // Nội dung tin nhắn
            return  [
                "isSelf" =>  $isSelf,
                "name" => $name,
                "avatar" => $avatar,
                "msg" => $message["content"],
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
                $messages[$index] =  creatData($message, $someone, $brand, $is_member);
            }

            $response["data"]["items"] =  $messages;
        } else {
            // Trả về rỗng khi hêt tin nhắn. Client check rỗng để không request lại nữa
            $response["data"]["items"] = [];
        }

        $response["data"]["is_seen"] =  $chatinfo[$is_member ? "is_seen_customer" :  "is_seen_member"];
        $response["data"]["users"] = ["brand" => Brand::ShortcutInfo($brand)];
        $response["data"]["users"][$is_member ? "user" : "customer"] = $is_member ? User::ShortcutInfo($someone) : Customer::ShortcutInfo($someone);
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

    $brand = Brand::Find_Not_Expired("token", $uri["token"]);

    if (!$response["isError"]) {
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
                        "is_seen_member" => false,
                        "is_seen_customer" => false,
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
                $token = create_random_bytes();

                $customer_id = Customer::Save([
                    "token" => $token,
                    "brand_id" => $brand["id"],
                    "name" =>  $data["name"],
                    "phone" => $data["phone"],
                    "is_active" => false,
                    "avatar" => Customer::Get_Default_Avatar()
                ]);

                $chatinfo_id = ChatInfo::Save([
                    "brand_id" => $brand["id"],
                    "customer_id" =>  $customer_id,
                    "is_seen_member" => false,
                    "is_seen_customer" => false,
                ]);

                App::Cookie("_ssid", $token, time() + CONF_COOKIE["expire"], '/');
                $response["data"] = [
                    "customer_id" => $customer_id,
                    "chatinfo_id" => $chatinfo_id
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