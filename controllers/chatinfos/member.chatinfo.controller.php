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
use MODELS\User;
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

    $user = Auth::User();
    $member = Auth::Member();
    $uri = App::GetURI();

    // Kiểm tra hết hạng token
    $brand = Brand::Find_Not_Expired("id", $member["brand_id"]);

    // Xác thực người dùng và tồn tại nhãn hàng
    if (isset($user) && isset($member) && isset($brand)) {
        // Kiểm tra tồn tại của chatinfo
        $chatinfo = ChatInfo::Find_Where(
            ["id",   "brand_id"],
            [$uri[id],   $member["brand_id"]]
        );

        if (isset($chatinfo)) {
            $per_page  = CONF_PAGINATION["message"];
            $total = Message::Count_Where("id", "chatinfo_id", $chatinfo["id"]);
            $page_url = CONF_URL["chats"] . "?";

            $response["data"] = initPaginationMeta($page_url, $total, $per_page);
            $messages = Message::Get_With_Page($response["data"], "chatinfo_id", $chatinfo["id"]);
            $response["data"]["chatinfo_id"] =  $chatinfo["id"];

            function creatData($message)
            {
                $isSelf = false;

                // Tin nhắn của nhãn hàng
                if ($message["is_brand"]) {
                    // Người lấy là cửa hàng
                    $u = User::Find_Where("id", $message["sender_id"]);

                    $name = $u["name"];
                    $avatar = $u["avatar"];

                    $isSelf = true;
                } else {
                    // Tin nhắn của khách
                    // Người lấy là cửa hàng
                    $c = Customer::Find_Where("id", $message["sender_id"]);

                    $name = $c["name"];
                    $avatar = $c["avatar"];
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
                    $messages[$index] =  creatData($message);
                }

                $response["data"]["items"] =  $messages;
            } else {
                // Trả về rỗng khi hêt tin nhắn. Client check rỗng để không request lại nữa
                $response["data"]["items"] = [];
            }

            $response["data"]["is_seen"] =  "is_seen_customer";
            $response["data"]["users"] = ["brand" => Brand::ShortcutInfo($brand)];
            $response["data"]["users"]["user"] = User::ShortcutInfo($user);
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Không có cuộc trò chuyện";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::responseJson($response);
};

return [
    "view" => $view
];
