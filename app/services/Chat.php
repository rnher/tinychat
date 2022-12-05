<?php

namespace APP\SERVICES;

include_once "Auth.php";
include_once "models/User.php";
include_once "models/ChatInfo.php";
include_once "models/Member.php";
include_once "models/Message.php";
include_once "models/Brand.php";
include_once "app/Config.php";
include_once "app/utils/util.php";

use MODELS\User;
use MODELS\Brand;
use MODELS\Member;
use MODELS\ChatInfo;
use MODELS\Customer;
use MODELS\Message;
use APP\SERVICES\Auth;
use Ratchet\MessageComponentInterface;

class Chat implements MessageComponentInterface
{
    private static $chat;
    private $conns;
    private $clients;

    protected function  __construct()
    {
        $this->conns = new \SplObjectStorage;
        $this->clients = new \SplObjectStorage;
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
        $this->logout($this->auth($conn));
        $this->conns->detach($conn);
    }

    function onError($conn, $e)
    {
        $conn->close();
    }

    function onMessage($from, $data)
    {
        $data = $this->deData($data);
        $auth = $this->auth($from);

        if (isset($auth["auth"])) {
            switch ($data["actionKey"]) {
                    // case CONF_SOCKET["actionKey"]["logout"]: {
                    //         $this->logout($auth);
                    //     }
                    //     break;
                case CONF_SOCKET["actionKey"]["checkPingUsers"]: {
                        $this->checkPingUsers($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["addMessage"]: {
                        $this->addMessage($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["addChatInfo"]: {
                        $this->addChatInfo($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["updateSeen"]: {
                        $this->updateSeen($auth, $data);
                    }
                    break;
                case CONF_SOCKET["actionKey"]["login"]: {
                        $this->login($from, $data, $auth);
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

    function authClient($client, $is_user = false)
    {
        if ($client->isMember) {
            if ($is_user) {
                $auth = User::Find_Where("id", $client->id);
            } else {
                $auth = Member::Find_Where("user_id", $client->id);
            }
        } else {
            $auth = Customer::Find_Where("id", $client->id);
        }

        return [
            "auth" => $auth,
            "client" => $client
        ];;
    }

    function auth($conn, $is_user = false)
    {
        foreach ($this->clients as $client) {
            if ($client->conn == $conn) {
                return $this->authClient($client, $is_user);
            }
        }

        return null;
    }

    function login($conn, $data, $re_auth = null)
    {
        if (isset($data["ssid"])) {
            if ($data["isMember"]) {
                $_auth = Auth::User($data["ssid"]);
            } else {
                $_auth = Auth::Customer($data["ssid"]);
            }
        }

        if (isset($re_auth)) {
            $this->clients->detach($re_auth["client"]);
        }

        $client = new \stdClass();
        $client->id = isset($_auth) ? $_auth["id"] : null;
        $client->isMember = $data["isMember"];
        $client->conn = $conn;

        $this->clients->attach($client);

        if (isset($_auth) && !$data["isMember"]) {
            $auth = [
                "auth" => $_auth,
                "client" => $client,
            ];

            $this->noticationPing($auth, 1);
        }

        $this->send($client, [
            "actionKey" => CONF_SOCKET["actionKey"]["login"]
        ]);
    }

    function logout($auth)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];

            // Thông báo khách hàng off cho member của thương hiệu 
            if (!$client->isMember) {
                $remainClient = false;
                foreach ($this->clients as $c) {
                    if (
                        $c->id == $client->id
                        && !$c->isMember
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
        }
    }

    function noticationPing($auth, $ping)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];
            $customer = $auth["auth"];

            if (!$client->isMember) {
                $chatinfo = ChatInfo::Find_Where("customer_id", $customer["id"]);
                if (isset($chatinfo)) {
                    $this->sendToChatinfo(
                        $auth,
                        $chatinfo,
                        [
                            "actionKey" => CONF_SOCKET["actionKey"]["noticationPing"],
                            "ping" => $ping,
                            "chatinfo_id" => $chatinfo["id"],
                        ]
                    );
                }
            }
        }
    }

    function enData($data)
    {
        return json_encode($data);
    }

    function deData($data)
    {
        return json_decode($data, true);
    }

    function send($client, $data)
    {
        $data = $this->enData($data);
        $client->conn->send($data);
    }

    function sendToMembers($clientSelf, $brand_id, $params, $callback, $isSelf = false)
    {
        $auth = $this->authClient($clientSelf, $isSelf);
        $_auth =  $auth["auth"];

        $params["data"]["isSelf"] = $isSelf;
        $params["data"]["userName"] = $_auth["name"];
        $params["data"]["avatar"] = $_auth["avatar"];

        $members = Member::Find_Where("brand_id", $brand_id);
        if (isset($members)) {
            if (!isset($members[0])) {
                $members = [$members];
            }

            foreach ($members as $m)
                foreach ($this->clients as $c) {
                    if (
                        $c->isMember
                        && $m["brand_id"] == $brand_id
                        && $m["user_id"] == $c->id
                    ) {
                        $params["client"] = $c;
                        $callback($params);
                    }
                }
        }
    }

    function sendToCustomers($brand_id, $customer_id, $data, $isSelf = false)
    {
        $brand = Brand::Find_Where("id", $brand_id);
        if (isset($brand)) {
            $data["isSelf"] = $isSelf;

            foreach ($this->clients as $c) {
                if (
                    !$c->isMember
                    && $c->id == $customer_id
                ) {
                    $auth = $this->authClient($c);
                    $customer = $auth["auth"];
                    if ($customer["brand_id"] == $brand_id) {
                        $data["userName"] = $isSelf ? $customer["name"] : $brand["name"];
                        $data["avatar"] = $isSelf ? $customer["avatar"] : $brand["avatar"];

                        $this->send($c, $data);
                    }
                };
            }
        }
    }

    function sendToChatinfo($auth, $chatinfo, $data)
    {
        $client = $auth["client"];
        $_auth = $auth["auth"];

        // Kiểm tra phải là quản trị viên của thương hiệu
        if ($client->isMember && ($_auth["brand_id"] == $chatinfo["brand_id"])) {
            $this->sendToCustomers(
                $chatinfo["brand_id"],
                $chatinfo["customer_id"],
                $data
            );

            $this->sendToMembers(
                $client,
                $chatinfo["brand_id"],
                [
                    "data" => $data
                ],
                function ($params) {
                    $this->send(
                        $params["client"],
                        $params["data"]
                    );
                },
                true
            );

            // Kiểm tra phải là khách hàng của thương hiệu
        } else if (
            !$client->isMember
            && ($_auth["id"] == $chatinfo["customer_id"])
        ) {
            $this->sendToMembers(
                $client,
                $chatinfo["brand_id"],
                [
                    "data" => $data
                ],
                function ($params) {
                    $this->send(
                        $params["client"],
                        $params["data"]
                    );
                }
            );

            $this->sendToCustomers(
                $chatinfo["brand_id"],
                $chatinfo["customer_id"],
                $data,
                true
            );
        }
    }

    function checkPingUsers($auth, $data)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];
            $member = $auth["auth"];

            // Chỉ có của hàng mới check ping được các khách hàng
            if ($client->isMember) {
                $customers = Customer::Find_With_Rerelative_ChatInfo($member["brand_id"]);
                if (isset($customers)) {
                    if (!isset($customers[0])) {
                        $customers = [$customers];
                    }

                    $pings = [];
                    foreach ($customers as $customer) {
                        foreach ($this->clients as $c) {
                            if (!($c->isMember) && $c->id == $customer["id"]) {
                                $chatinfo = ChatInfo::Find_Where(
                                    ["brand_id", "customer_id"],
                                    [$customer["brand_id"], $customer["id"]]
                                );
                                $pings[] = [
                                    "chatinfo_id" =>   $chatinfo["id"],
                                    "ping" => 1
                                ];
                            }
                        }
                    }

                    $this->send(
                        $client,
                        [
                            "pings" => $pings,
                            "actionKey" => $data["actionKey"]
                        ]
                    );
                }
            }
        }
    }

    function addMessage($auth, $data)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];

            $chatinfo = ChatInfo::Find_Where("id", $data["chatinfo_id"]);
            if (isset($chatinfo)) {
                $this->sendToChatinfo($auth, $chatinfo, $data);

                $msgSend = [
                    "chatinfo_id" => $chatinfo["id"],
                    "sender_id" => $client->id,
                    "is_brand" =>  (int)($client->isMember),
                    "type" => "text",
                    "content" => $data["content"],
                    "is_seen_member" => (int)($client->isMember),
                    "is_seen_customer" => (int)(!$client->isMember)
                ];

                if ($client->isMember) {
                    $msgSend["is_seen_member"] = 1;
                    $msgSend["is_seen_customer"] = 0;
                } else {
                    $msgSend["is_seen_member"] = 0;
                    $msgSend["is_seen_customer"] = 1;
                }

                Message::Save($msgSend);
                ChatInfo::Update_Where(
                    ["id"],
                    [$chatinfo["id"]],
                    [
                        "is_seen_member" => $msgSend["is_seen_member"],
                        "is_seen_customer" => $msgSend["is_seen_customer"],
                    ]
                );
            }
        }
    }

    function addChatInfo($auth, $data)
    {
        if ($auth["auth"]) {
            $client = $auth["client"];

            if (!$client->isMember) {
                $customer = Customer::Find_Where("id", $data["customer_id"]);
                $chatinfo = ChatInfo::Find_Where(
                    ["brand_id", "customer_id"],
                    [$customer["brand_id"], $customer["id"]]
                );

                if (isset($customer) && isset($chatinfo)) {
                    $this->sendToMembers(
                        $client,
                        $customer["brand_id"],
                        [
                            "self" => $client,
                            "chatinfo" => ChatInfo::ShortcutInfo($chatinfo),
                            "customer" => Customer::ShortcutInfo($customer),
                            "data" => $data
                        ],
                        function ($params) {
                            $this->send(
                                $params["client"],
                                [
                                    "item" => [
                                        "chatinfo" => $params["chatinfo"],
                                        "customer" => $params["customer"],
                                        "count_not_seen_msg" => ["count" => 0]
                                    ],
                                    "actionKey" => $params["data"]["actionKey"]
                                ]
                            );
                        }
                    );
                }
            }
        }
    }

    function updateSeen($auth, $data)
    {
        if (isset($auth["auth"])) {
            $client = $auth["client"];
            $_auth = $auth["auth"];

            $checkUpdate = false;

            $chatInfo = ChatInfo::Find_Where(
                ["id", "brand_id"],
                [$data["chatinfo_id"],  $_auth["brand_id"]]
            );

            if (isset($chatInfo)) {
                if (
                    $client->isMember
                    && $chatInfo["is_seen_member"] == 0
                ) {
                    $dataUpdate["is_seen_member"] = 1;
                    $checkUpdate = true;
                } else if (
                    !$client->isMember
                    && $chatInfo["is_seen_customer"] == 0
                    && $chatInfo["customer_id"] == $_auth["id"]
                ) {
                    $dataUpdate["is_seen_customer"] = 1;
                    $checkUpdate = true;
                }

                if ($checkUpdate) {
                    $this->sendToChatinfo($auth, $chatInfo, $data);

                    ChatInfo::Update_Where(
                        ["id", "brand_id"],
                        [$chatInfo["id"], $chatInfo["brand_id"]],
                        $dataUpdate
                    );

                    Message::Update_Where(
                        ["chatinfo_id"],
                        [$chatInfo["id"]],
                        $dataUpdate
                    );
                }
            }
        }
    }
}
