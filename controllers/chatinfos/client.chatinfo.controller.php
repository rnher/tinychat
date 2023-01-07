<?php
include_once "app/App.php";
include_once "app/libraries/Auth.php";
include_once "app/libraries/RSA.php";
include_once "app/utils/util.php";
include_once "models/Customer.php";
include_once "models/Brand.php";
include_once "models/ChatInfo.php";
include_once "models/User.php";
include_once "models/Message.php";
include_once "models/RelativeMessage.php";
include_once "models/Room.php";
include_once "models/ChatSettings.php";

use APP\App;
use APP\LIBRARIES\Auth;
use APP\LIBRARIES\RSA;
use MODELS\Room;
use MODELS\Brand;
use MODELS\Message;
use MODELS\ChatInfo;
use MODELS\Customer;
use MODELS\Member;
use MODELS\RelativeMessage;
use MODELS\ChatSettings;

$view = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $uri = App::GetURI();

    $customer = Auth::Customer($uri[ssid]);
    $brand = Brand::Find_Not_Expired("token", $uri[token]);
    $chat_settings = ChatSettings::Find_Where("brand_id", $brand ? $brand["id"] : "");
    $chatinfo = null;

    // Xác thực người dùng và tồn tại thương hiệu
    if (isset($customer) && isset($brand)) {
        // Xác thực người dùng và tồn tại thương hiệu
        $chatinfo = ChatInfo::Find_Where(
            ["customer_id", "brand_id"],
            [$customer["id"], $customer["brand_id"]]
        );
    }

    // Xác thực đã có cuộc trò chuyện trước đó
    if (isset($chatinfo)) {
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

        $per_page = CONF_PAGINATION["message"];
        $total = Message::Count($chatinfo);
        $page_url = CONF_URL["clients"] . "?" . "ssid" . "=" . $uri[ssid] . "&" .  token . "=" . $uri[token] . "&";
        $response["data"] = initPaginationMeta($page_url, $total, $per_page);
        $messages = Message::Get_With_Page($response["data"], $chatinfo);

        function creatMessagesData(
            $messages = [],
            $relative_messages = [],
            $customer = null,
            $brand = null,
            $is_greeting = false
        ) {
            $data = [];

            if ($is_greeting) {
                if (strlen($brand["greeting"])) {
                    // Nội dung tin nhắn
                    $data[] = [
                        "id" => "brand-" . $brand["id"],
                        "chatinfo_id" => "",
                        "isSelf" => false,
                        "userName" => $brand["name"],
                        "avatar" => CONF_HOST . $brand["avatar"],
                        "content" => $brand["greeting"],
                        "time" => date('m/d/Y h:i:s a', time()),
                        "type" =>  Message::Type("text"),
                        "is_decrypt" => true
                    ];
                }
            } else {
                foreach ($messages as $message) {
                    foreach ($relative_messages as $relative_message) {
                        if ($relative_message["id"] == $message["relative_message_id"]) {
                            $isSelf = false;

                            // Tin nhắn của thương hiệu
                            if ($relative_message["someone_type"] == RelativeMessage::Type("brand")) {
                                // Người lấy là khách
                                $id = "brand-" . $brand["id"];
                                $name = $brand["name"];
                                $avatar = $brand["avatar"];
                            } else {
                                // Tin nhắn của khách
                                $id = "customer-" . $customer["id"];
                                $name = $customer["name"];
                                $avatar = $customer["avatar"];

                                $isSelf = true;
                            }

                            // Nội dung tin nhắn
                            $data[] =  [
                                "id" => $id,
                                "isSelf" => $isSelf,
                                "userName" => $name,
                                "avatar" => CONF_HOST . $avatar,
                                "content" => $message["content"],
                                "time" => $message["create_date"],
                                "type" => $message["type"],
                                "chatinfo_id" => $message["relative_id"],
                            ];

                            break;
                        }
                    }
                }
            }

            return $data;
        };

        if (isset($messages)) {
            // Một tin nhắn
            if (!isset($messages[0])) {
                $messages = [$messages];
            }

            $response["data"]["items"] = creatMessagesData($messages, $relative_messages,  $customer, $brand);
        } else {
            // Trả về rỗng khi hêt tin nhắn. Client check rỗng để không request lại nữa
            // Hiển thị lời chào của thương hiệu
            $response["data"]["items"] = creatMessagesData(null, null, null, $brand, true);
        }

        $response["data"]["count_not_seen"] = $customer_relative_message["count_not_seen"];
        $response["data"]["ssid"] = $uri[ssid];
        $response["data"]["chatinfo"] = ChatInfo::ShortcutInfo($chatinfo);
        $response["data"]["customer"] = Customer::ShortcutInfo($customer);
        $response["data"]["brand"] = Brand::ShortcutInfo($brand);
        $response["data"]["brand"]["settings"] = ChatSettings::DetailInfo($chat_settings);
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Người dùng chưa kết nốt chat";

        $response["error"]["brand"] = Brand::ShortcutInfo($brand);
        $response["error"]["brand"]["settings"] = ChatSettings::DetailInfo($chat_settings);
    }

    App::responseJson($response);
};

$create = function () {
    $validater = include_once "app/validates/chatinfos/chatinfo.validate.php";
    $response = $validater["create"]();
    $data = $response["data"];

    $uri = App::GetURI();

    $brand = Brand::Find_Not_Expired("token", $uri[token]);
    $chat_settings = ChatSettings::Find_Where("brand_id", $brand ? $brand["id"] : "");

    // Thương hiệu đã tồn tại
    if (isset($brand) && isset($chat_settings)) {
        $customer = Auth::Customer($uri[ssid]);

        if ($chat_settings["is_require_mail"] == "1" && !isset($data["mail"])) {
            $response["isError"] = true;
            $response["error"]["mail"] = "Địa chỉ mail không hợp lệ";
        }

        if ($chat_settings["is_require_phone"] == "1" && !isset($data["phone"])) {
            $response["isError"] = true;
            $response["error"]["phone"] = "Số điện thoại không hợp lệ";
        }

        if (!$response["isError"]) {
            // Khách hàng đã tồn tại
            if (isset($customer)) {
                $chatinfo = ChatInfo::Find_Where(
                    ["customer_id", "brand_id"],
                    [$customer["id"], $brand["id"]]
                );

                // Có customer và có trò chuyện
                $response["data"] = [
                    "customer_id" => $chatinfo["customer_id"],
                    "chatinfo_id" => $chatinfo["id"],
                ];
            } else {

                // Khách hàng chưa tồn tại
                // Không có customer và không có trò chuyện
                $token = Customer::Create_Token($data["name"], time());

                // Customer
                $customer_id = Customer::Save([
                    "brand_id" => $brand["id"],
                    "status" => 1,
                    "token" => $token,
                    "name" =>  $data["name"],
                    "avatar" => Customer::Get_Default_Avatar(),
                    "is_active" => 0,
                    "phone" => isset($data["phone"]) ? $data["phone"] : NULL,
                    "mail" => isset($data["mail"]) ? $data["mail"] : NULL,
                ]);

                // Chatinfo
                $rsa_key = RSA::Create_Key();
                $chatinfo_id = ChatInfo::Save([
                    "brand_id" => $brand["id"],
                    "customer_id" =>  $customer_id,
                    "public_key" => $rsa_key["public_key"],
                    "private_key" => $rsa_key["private_key"],
                ]);

                $join_date = date("Y-m-d H:i:s");

                // Customer
                RelativeMessage::Save([
                    "someone_type" => RelativeMessage::Type("customer"),
                    "someone_id" => $customer_id,
                    "relative_type" => RelativeMessage::Type("chatinfo"),
                    "relative_id" => $chatinfo_id,
                    "join_date" => $join_date,
                ]);

                // Brand
                RelativeMessage::Save([
                    "someone_type" => RelativeMessage::Type("brand"),
                    "someone_id" => $brand["id"],
                    "relative_type" => RelativeMessage::Type("chatinfo"),
                    "relative_id" =>  $chatinfo_id,
                    "join_date" => $join_date,
                ]);

                // Add room customer
                Room::Save([
                    "room_id" => $chatinfo_id,
                    "user_id" => $customer_id,
                    "type" => Room::Type("chatinfo"),
                    "is_member" => 0
                ]);

                // Add room brand member
                $members =  Member::Find_Where(
                    ["brand_id", "status"],
                    [$brand["id"], Member::Status("active")]
                );
                if (!isset($members[0])) {
                    $members = [$members];
                }
                foreach ($members as $member) {
                    Room::Save([
                        "room_id" => $chatinfo_id,
                        "user_id" => $member["user_id"],
                        "type" => Room::Type("chatinfo"),
                        "is_member" => 1
                    ]);
                }

                App::Cookie("tinychat_client_ssid", $token, time() + CONF_COOKIE["expire"], '/');

                $response["data"] = [
                    "customer_id" => $customer_id,
                    "chatinfo_id" => $chatinfo_id,
                    "ssid" => App::getEndcodeCookie($token, true)
                ];
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Tạo cuộc trò chuyện không thành công";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Kênh trò chuyện của thương hiệu không có";
        $response["error"]["not"] = "brand";
    }

    if ($response["isError"]) {
        $response["error"]["data"] = $data;
    }

    App::responseJson($response);
};

return [
    "view" => $view,
    "create" => $create,
];
