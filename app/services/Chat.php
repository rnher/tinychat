<?php

namespace APP\SERVICES;

include_once "app/libraries/Auth.php";
include_once "app/libraries/Logger.php";
include_once "app/utils/util.php";
include_once "app/Config.php";
include_once "models/User.php";
include_once "models/ChatInfo.php";
include_once "models/Member.php";
include_once "models/Room.php";
include_once "models/Message.php";
include_once "models/Brand.php";
include_once "models/RelativeMessage.php";
include_once "models/Notification.php";
include_once "models/Session.php";

use Ratchet\MessageComponentInterface;
use APP\LIBRARIES\Auth;
use APP\LIBRARIES\Logger;
use MODELS\Room;
use MODELS\User;
use MODELS\Brand;
use MODELS\Member;
use MODELS\Message;
use MODELS\ChatInfo;
use MODELS\Customer;
use MODELS\RelativeMessage;
use MODELS\Notification;
use MODELS\Session;

class Chat implements MessageComponentInterface
{
    private static $chat;
    private $conns;
    private $clients;
    private $validater;

    protected function  __construct()
    {
        $this->conns = new \SplObjectStorage;
        $this->clients = new \SplObjectStorage;
        $this->validater = include_once "app/validates/messages/message.validate.php";
    }

    static function Singleton()
    {
        if (!isset(self::$chat)) {
            self::$chat = new Chat();
        }
        return self::$chat;
    }

    function onOpen($conn)
    {
        $this->conns->attach($conn);
    }

    function onClose($conn)
    {
        $this->logout($conn, $this->auth($conn));
    }

    function onError($conn, $e)
    {
        Logger::AddSocketLog($e->getMessage());
        $conn->close();
    }

    function onMessage($from, $data)
    {

        $data = $this->deData($data);
        $auth = $this->auth($from);

        if (isset($auth["auth"])) {
            switch ($data["actionKey"]) {
                case CONF_SOCKET["actionKey"]["login"]: {
                        $this->login($from, $data, $auth);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["logout"]: {
                        $this->logout($from, $auth);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["checkPingChatinfos"]: {
                        $this->checkPingChatinfos($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["addMessage"]: {
                        $this->addMessage($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["updateTyping"]: {
                        $this->updateTyping($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["addChatInfo"]: {
                        $this->addChatInfo($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["removeChatInfo"]: {
                        $this->removeChatInfo($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["updateSeen"]: {
                        $this->updateSeen($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["updateSeenChatinfo"]: {
                        $this->updateSeenChatinfo($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["pushNotification"]: {
                        $this->pushNotification($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["removeBrand"]: {
                        $this->removeBrand($auth, $data);
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch ($data["actionKey"]) {
                case CONF_SOCKET["actionKey"]["login"]: {
                        $this->login($from, $data);
                    }
                    break;
                default: {
                    }
                    break;
            }
        }
    }

    function enData($data)
    {
        return json_encode($data);
    }

    function deData($data)
    {
        $data = str_replace("'", "&#39", $data);
        $data = str_replace('\n', ' ', $data);
        return json_decode($data, true);
    }

    function send($client, $data)
    {
        $data = $this->enData($data);
        $client->conn->send($data);
    }

    function checkTruthConnect($client, $type, $target_id)
    {
        $auth = null;

        switch ($type) {
            case "chatinfo": {
                    if ($client->isMember) {
                        $auth = Member::Find_Where(["user_id", "brand_id"], [$client->id, $target_id]);
                    } else {
                        $auth = Customer::Find_Where(["id", "brand_id"], [$client->id, $target_id]);
                    }
                }
                break;
            default: {
                }
                break;
        }

        return $auth;
    }

    function auth($conn)
    {
        foreach ($this->clients as $client) {
            if ($client->conn == $conn) {
                if ($client->isMember) {
                    $auth = User::Find_Where("id", $client->id);
                } else {
                    $auth = Customer::Find_Where("id", $client->id);
                }

                return [
                    "auth" => $auth,
                    "client" => $client
                ];
            }
        }

        return null;
    }

    function login($conn, $data, $re_auth = null)
    {
        if (isset($re_auth)) {
            $this->clients->detach($re_auth["client"]);
        }

        if (isset($data["ssid"])) {
            if ($data["isMember"]) {
                $_auth = Auth::User($data["ssid"]);
            } else {
                $_auth = Auth::Customer($data["ssid"]);
            }
        }

        $_client = new \stdClass();
        $_client->id = isset($_auth) ? $_auth["id"] : null;
        $_client->isMember = $data["isMember"];
        $_client->conn = $conn;

        if (isset($_auth)) {
            // Customer
            if (!$data["isMember"]) {
                $auth = [
                    "auth" => $_auth,
                    "client" => $_client,
                ];

                $this->noticationPing($auth, 1);
            } else {
                // User 
                // Cập nhật trạng thái
                $update_session = [
                    "is_login" => 1
                ];
                Session::Update_Where("user_id", $_auth["id"], $update_session);
            }
        }

        $this->clients->attach($_client);
        $this->send($_client, [
            "actionKey" => CONF_SOCKET["actionKey"]["login"]
        ]);
    }

    function logout($conn, $auth)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];
            $_auth = $auth["auth"];

            $remainClient = false;

            // Thông báo khách hàng off cho member của thương hiệu 
            if ($client->isMember) {
                // User
                // Cập nhật trạng thái
                $update_session = [
                    "is_login" => 0
                ];
                Session::Update_Where("user_id", $_auth["id"], $update_session);
            }

            foreach ($this->clients as $c) {
                if (
                    $c->id == $client->id
                    && $c->isMember == $client->isMember
                    && $c->conn != $client->conn
                ) {
                    $remainClient = true;
                    break;
                }
            }

            if (!$remainClient) {
                $this->noticationPing($auth, 0);
            }

            $this->clients->detach($client);
        }

        $this->conns->detach($conn);
    }

    function noticationPing($auth, $ping)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];
            $user = $auth["auth"];

            if (!$client->isMember) {
                $chatinfo = ChatInfo::Find_Where("customer_id", $user["id"]);

                if (isset($chatinfo)) {
                    $this->sendToBrand(
                        $chatinfo["brand_id"],
                        [
                            "actionKey" => CONF_SOCKET["actionKey"]["noticationPing"],
                            "pings" => [[
                                "ping" => $ping,
                                "chatinfo_id" => $chatinfo["id"],
                                "type" => "customer"
                            ]]
                        ]
                    );
                }
            } else {

                $list_brand = Auth::ListBrand($user["id"]);
                foreach ($list_brand as $brand) {
                    $chatinfos = ChatInfo::Find_Where("brand_id", $brand["id"]);
                    if (!isset($chatinfos[0])) {
                        $chatinfos = [$chatinfos];
                    }

                    if (isset($chatinfos)) {
                        foreach ($chatinfos as $chatinfo) {
                            if (isset($chatinfo)) {
                                $this->sendToChatinfo(
                                    $auth,
                                    $chatinfo,
                                    [
                                        "actionKey" => CONF_SOCKET["actionKey"]["noticationPing"],
                                        "pings" => [[
                                            "ping" => $ping,
                                            "chatinfo_id" => $chatinfo["id"],
                                            "type" => "brand"
                                        ]]
                                    ]
                                );
                            }
                        }
                    }
                }
            }
        }
    }

    function addMessage($auth, $data)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];
            $response = $this->validater["metadata"]($data);

            if (!$response["isError"]) {
                $chatinfo = ChatInfo::Find_Where("id", $data["chatinfo_id"]);
                if (isset($chatinfo) && $this->checkTruthConnect($client, "chatinfo", $chatinfo["brand_id"])) {

                    $relative_msg = RelativeMessage::Find_Where(
                        ["someone_id", "someone_type", "relative_type", "relative_id"],
                        [
                            $client->isMember ? $chatinfo["brand_id"] : $client->id,
                            $client->isMember ? RelativeMessage::Type("brand") : RelativeMessage::Type("customer"),
                            RelativeMessage::Type("chatinfo"),
                            $chatinfo["id"]
                        ]
                    );

                    if (isset($chatinfo) && isset($relative_msg)) {
                        // Gửi tin cho socketsendToChatinfo
                        $data["brand_id"] = $chatinfo["brand_id"];
                        $data["content"] = $response["data"]["content"];
                        $data["type"] = $response["data"]["type"];
                        $data["time"] = date("m/d/Y h:i:s a", time());

                        $this->sendToChatinfo($auth, $chatinfo, $data);

                        // Cập nhật count not seen của đối phương
                        RelativeMessage::Plus_Not_Seen(
                            ["someone_id", "someone_type", "relative_type", "relative_id"],
                            [
                                $client->isMember ? $chatinfo["customer_id"] : $chatinfo["brand_id"],
                                $client->isMember ?  RelativeMessage::Type("customer") : RelativeMessage::Type("brand"),
                                RelativeMessage::Type("chatinfo"),
                                $chatinfo["id"]
                            ]
                        );

                        // Lưu tin nhắn
                        Message::Save($chatinfo, [
                            "id" => create_random_bytes($relative_msg["id"]),
                            "sender_id" =>  $client->id,
                            "relative_id" => $chatinfo["id"],
                            "relative_message_id" => $relative_msg["id"],
                            "type" => $data["type"],
                            "content" => $data["content"],
                            "status" => Message::Status("active"),
                            "create_date" => $data["time"],
                            "update_date" => $data["time"],
                        ]);
                    }
                }
            }
        }
    }

    function updateTyping($auth, $data)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];

            $chatinfo = ChatInfo::Find_Where("id", $data["chatinfo_id"]);
            if (isset($chatinfo) && $this->checkTruthConnect($client, "chatinfo", $chatinfo["brand_id"])) {
                $this->sendToChatinfo($auth, $chatinfo, $data);
            }
        }
    }

    function addChatInfo($auth, $data)
    {
        if ($auth["auth"]) {
            $client = $auth["client"];

            if (!$client->isMember) {
                $customer = $auth["auth"];
                $chatinfo = ChatInfo::Find_Where(
                    ["brand_id", "customer_id"],
                    [$customer["brand_id"], $customer["id"]]
                );

                if (isset($chatinfo)) {
                    $re_message = RelativeMessage::Find_Where(
                        ["someone_id", "someone_type", "relative_id", "relative_type"],
                        [$chatinfo["brand_id"], RelativeMessage::Type("brand"), $chatinfo["id"], RelativeMessage::Type("chatinfo")]
                    );

                    $this->sendToBrand(
                        $customer["brand_id"],
                        [
                            "actionKey" => $data["actionKey"],
                            "item" => [
                                "chatinfo" => ChatInfo::ShortcutInfo($chatinfo),
                                "customer" => Customer::ShortcutInfo($customer),
                                "re_message" => RelativeMessage::ShortcutInfo($re_message),
                            ]
                        ]
                    );
                }
            }
        }
    }

    function removeChatInfo($auth, $data)
    {
        if ($auth["auth"]) {
            $client = $auth["client"];
            if ($client->isMember) {
                if ($this->checkTruthConnect($client, "chatinfo", $data["brand_id"])) {
                    $this->sendToBrand(
                        $data["brand_id"],
                        $data
                    );
                }
            }
        }
    }

    function updateSeen($auth, $data)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];

            $chatinfo = ChatInfo::Find_Where(
                ["id"],
                [$data["chatinfo_id"]]
            );

            if (
                isset($chatinfo)
                && $this->checkTruthConnect($client, "chatinfo", $chatinfo["brand_id"])
            ) {

                if ($client->isMember) {
                    RelativeMessage::Update_Where(
                        ["someone_type", "someone_id", "relative_type", "relative_id"],
                        [RelativeMessage::Type("brand"), $chatinfo["brand_id"], RelativeMessage::Type("chatinfo"), $chatinfo["id"]],
                        ["count_not_seen" => 0]
                    );
                } else {
                    RelativeMessage::Update_Where(
                        ["someone_type", "someone_id", "relative_type", "relative_id"],
                        [RelativeMessage::Type("customer"), $client->id, RelativeMessage::Type("chatinfo"), $chatinfo["id"]],
                        ["count_not_seen" => 0]
                    );
                }

                $data["brand_id"] = $chatinfo["brand_id"];
                $this->sendToChatinfo($auth, $chatinfo, $data);
            }
        }
    }

    function sendToBrand($brand_id, $data)
    {
        $rooms = Room::Find_Where(
            ["room_id", "type", "is_member"],
            [$brand_id, Room::Type("brand"), 1]
        );
        if (!isset($rooms[0])) {
            $rooms  = [$rooms];
        }

        foreach ($this->clients as $client) {
            foreach ($rooms as $index => $room) {
                if (
                    $client->id == $room["user_id"]
                    && $client->isMember
                ) {
                    $this->send(
                        $client,
                        $data
                    );

                    break;
                }
            }
        }
    }

    function sendToChatinfo($selfAuth, $chatinfo, $data)
    {
        $selfClient = $selfAuth["client"];
        $selfAuth = $selfAuth["auth"];

        $rooms = Room::Find_Where(
            ["room_id", "type"],
            [$chatinfo["id"], Room::Type("chatinfo")]
        );
        if (!isset($rooms[0])) {
            $rooms = [$rooms];
        }

        $brand = Brand::Find_Where(["id"], [$chatinfo["brand_id"]]);

        foreach ($rooms as $room) {
            if (isset($room)) {
                foreach ($this->clients as $client) {
                    if (
                        $client->id == $room["user_id"]
                        && ($client->isMember ? "1" : "0") == $room["is_member"]
                    ) {
                        $data["isSelf"] = ($selfClient->id == $client->id) && ($selfClient->isMember == $client->isMember);

                        if ($selfClient->isMember && $client->isMember && !$data["isSelf"]) {
                            $data["isBrandSelf"] = true;
                        }

                        $data["id"] = ($selfClient->isMember ? "user-" : "customer-") . $selfClient->id;
                        $data["userName"] = $selfAuth["name"];
                        $data["avatar"] = CONF_HOST . $selfAuth["avatar"];

                        if ($selfClient->isMember && !$client->isMember) {
                            $data["id"] = "brand-" . $selfClient->id;
                            $data["userName"] = $brand["name"];
                            $data["avatar"] = CONF_HOST . $brand["avatar"];
                        }

                        $this->send(
                            $client,
                            $data
                        );
                    }
                }
            }
        }
    }

    function updateSeenChatinfo($auth, $data)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];

            $chatinfo = ChatInfo::Find_Where(
                ["id"],
                [$data["chatinfo_id"]]
            );

            if (
                isset($chatinfo)
                && $this->checkTruthConnect($client, "chatinfo", $chatinfo["brand_id"])
            ) {

                if ($client->isMember) {
                    $data["is_seen_brand"] = 1;

                    ChatInfo::Update_Where(
                        ["id"],
                        [$data["chatinfo_id"]],
                        ["is_seen_brand" => $data["is_seen_brand"]]
                    );

                    $this->sendToBrand($chatinfo["brand_id"], $data);
                }
            }
        }
    }

    function checkPingChatinfos($auth, $data)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];

            if ($this->checkTruthConnect($client, "chatinfo", $data["brand_id"])) {
                $pings = [];

                foreach ($data["chatinfo_ids"] as $chatinfo_id) {
                    $rooms = Room::Find_Where(
                        ["room_id", "type", "is_member"],
                        [$chatinfo_id, Room::Type("chatinfo"), 0]
                    );
                    if (!isset($rooms[0])) {
                        $rooms = [$rooms];
                    }

                    if (count($rooms)) {
                        foreach ($rooms as $room) {
                            if (isset($room)) {
                                foreach ($this->clients as $c) {
                                    if (
                                        $c->isMember == $room["is_member"]
                                        && $c->id == $room["user_id"]
                                    ) {
                                        $pings[] = [
                                            "chatinfo_id" => $room["room_id"],
                                            "ping" => 1
                                        ];
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                if (count($pings)) {
                    $this->send(
                        $client,
                        [
                            "actionKey" => $data["actionKey"],
                            "pings" => $pings
                        ]
                    );
                }
            }
        }
    }

    function pushNotification($auth, $data)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];

            $notification = Notification::Find_Where(
                ["id"],
                [$data["notification_id"]]
            );

            if (isset($notification)) {
                if ($client->isMember) {
                    foreach ($this->clients as $c) {
                        if ($c->id ==  $notification["receiver_id"] && $c->isMember) {
                            $this->send(
                                $c,
                                [
                                    "actionKey" => $data["actionKey"],
                                    "notification" => Notification::DetailInfo($notification)
                                ]
                            );

                            break;
                        }
                    }
                } else {
                    $this->sendToBrand(
                        $notification["receiver_id"],
                        [
                            "actionKey" => $data["actionKey"],
                            "notification" => Notification::DetailInfo($notification)
                        ]
                    );
                }
            }
        }
    }

    function removeBrand($auth, $data)
    {
        if (isset($auth["auth"])) {

            foreach ($this->clients as $client) {
                if ($client->id ==  $data["user_id"] && $client->isMember) {
                    $this->send(
                        $client,
                        [...$data]
                    );

                    break;
                }
            }
        }
    }
}
