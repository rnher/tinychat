<?php
include_once "app/App.php";
include_once "app/libraries/Auth.php";
include_once "models/Customer.php";
include_once "models/Brand.php";
include_once "models/ChatInfo.php";
include_once "models/User.php";
include_once "models/Message.php";
include_once "models/Member.php";
include_once "models/RelativeMessage.php";
include_once "models/Room.php";
include_once "app/utils/util.php";

use APP\App;
use APP\LIBRARIES\Auth;
use MODELS\User;
use MODELS\Brand;
use MODELS\Member;
use MODELS\Message;
use MODELS\ChatInfo;
use MODELS\Customer;
use MODELS\Room;
use MODELS\RelativeMessage;

$view = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $uri = App::GetURI();
    $user = Auth::User();

    // Xác thực người dùng và tồn tại thương hiệu
    if (isset($user)) {
        $chatinfo = ChatInfo::Find_Where(
            ["id"],
            [$uri["id"]]
        );

        if (isset($chatinfo)) {
            $member = Member::Find_Where(
                ["user_id", "brand_id", "status"],
                [$user["id"], $chatinfo["brand_id"], Member::Status("active")]
            );
            $brand = Brand::Find_Where("id", $chatinfo["brand_id"]);

            if (isset($member) && isset($brand)) {
                $customer = Customer::Find_Where("id", $chatinfo["customer_id"]);

                // RelativeMessage 
                $customer_relative_message = RelativeMessage::Find_Where(
                    ["relative_id", "relative_type", "someone_id", "someone_type"],
                    [$chatinfo["id"], RelativeMessage::Type("chatinfo"), $customer["id"], RelativeMessage::Type("customer")]
                );

                $brand_relative_message = RelativeMessage::Find_Where(
                    ["relative_id", "relative_type", "someone_id", "someone_type"],
                    [$chatinfo["id"], RelativeMessage::Type("chatinfo"), $brand["id"], RelativeMessage::Type("brand")]
                );

                $relative_messages = [
                    $customer_relative_message,
                    $brand_relative_message
                ];

                $per_page  = CONF_PAGINATION["message"];
                $total = Message::Count($chatinfo);
                $page_url = CONF_URL["chats"] . "?";
                $response["data"] = initPaginationMeta($page_url, $total, $per_page);
                $messages = Message::Get_With_Page($response["data"], $chatinfo);

                function creatMessagesData($messages = [], $relative_messages = [], $customer = null)
                {
                    $data = [];
                    $users = [];

                    foreach ($messages as  $message) {
                        foreach ($relative_messages as $relative_message) {
                            if ($relative_message["id"] == $message["relative_message_id"]) {
                                // Tin nhắn của nhãn hàng
                                $isSelf = false;

                                // Tin nhắn của thương hiệu
                                if ($relative_message["someone_type"] == RelativeMessage::Type("brand")) {
                                    $user = null;

                                    // Tìm user trước đó
                                    foreach ($users as $u) {
                                        if ($u["id"] == $message["sender_id"]) {
                                            $user = $u;
                                            break;
                                        }
                                    }
                                    // Lấy user mới
                                    if (!$user) {
                                        $user = User::Find_Where("id", $message["sender_id"]);
                                    }

                                    $id = "user-" . $user["id"];
                                    $name = $user["name"];
                                    $avatar = $user["avatar"];

                                    $isSelf = true;
                                } else {
                                    // Người lấy là nhãn hàng

                                    // Tin nhắn của khách
                                    $id = "customer-" . $customer["id"];
                                    $name = $customer["name"];
                                    $avatar = $customer["avatar"];
                                }

                                // Nội dung tin nhắn
                                $data[] =  [
                                    "id" =>  $id,
                                    "isSelf" =>  $isSelf,
                                    "userName" => $name,
                                    "avatar" => $avatar,
                                    "content" => $message["content"],
                                    "time" => $message["create_date"],
                                    "type" => $message["type"],
                                    "chatinfo_id" => $message["relative_id"],
                                ];

                                break;
                            };
                        };
                    };

                    return $data;
                };

                // Một tin nhắn
                if (isset($messages)) {
                    // Một tin nhắn
                    if (!isset($messages[0])) {
                        $messages = [$messages];
                    }
                } else {
                    $messages = [];
                }

                $response["data"]["items"] = creatMessagesData(
                    $messages,
                    $relative_messages,
                    $customer
                );
                $response["data"]["chatinfo_id"] = $chatinfo["id"];
                $response["data"]["users"]["brand"] = Brand::ShortcutInfo($brand);
                $response["data"]["users"]["user"] = User::ShortcutInfo($user);
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Không có cuộc trò chuyện";
            }
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

$delete = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $uri = App::GetURI();
    $user = Auth::User();

    $brand = Brand::Find_Where("id", App::MethodGet("brand_id"));

    // Xác thực người dùng và tồn tại thương hiệu
    if (isset($user) && isset($brand)) {
        $member = Member::Find_Where(
            ["user_id", "brand_id", "role", "status"],
            [$user["id"], $brand["id"], Member::Role("admin"), Member::Status("active")]
        );

        if (isset($member)) {
            ChatInfo::Update_Where(
                ["id", "brand_id", "is_deleted_brand"],
                [$uri["id"], $member["brand_id"], 0],
                ["is_deleted_brand" => 1]
            );

            Room::Delete_Where(
                ["type", "room_id", "is_member"],
                [Room::Type("chatinfo"), $uri["id"], 1]
            );

            $response["data"] = [
                "chatinfo_id" => $uri["id"],
                "brand_id" => $member["brand_id"]
            ];
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Chỉ có quản trị viên mới có quyền";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::responseJson($response);
};

return [
    "view" => $view,
    "delete" => $delete
];
