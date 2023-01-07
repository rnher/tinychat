<?php
include_once "app/App.php";
include_once "app/libraries/Auth.php";
include_once "models/Notification.php";

use APP\App;
use APP\LIBRARIES\Auth;
use MODELS\Notification;

$views = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];
    // TODO: xóa dữ liệu sau 30 day

    $user = Auth::User();

    // Xác thực người dùng
    if (isset($user)) {
        $per_page  = CONF_PAGINATION["notification"];
        $total = Notification::Count_Where("id", "receiver_id", $user["id"]);
        $page_url = CONF_URL["notifications"] . "?";

        $response["data"] = initPaginationMeta($page_url, $total, $per_page);
        $notifications = Notification::Get_With_Page($response["data"], "receiver_id", $user["id"]);

        function creatData($notification)
        {
            return [
                "notification" => Notification::ShortcutInfo($notification),
            ];
        };

        if (isset($notifications)) {
            // Một thông báo
            if (!isset($notifications[0])) {
                $notifications = [$notifications];
            }

            foreach ($notifications as $index => $notification) {
                $notifications[$index] = creatData($notification);
            }

            $response["data"]["count_not_seen"] = (Notification::Count_Where(
                "id",
                ["receiver_id", "is_seen"],
                [$user["id"], 0]
            ))["count"];
            $response["data"]["items"] = $notifications;
        } else {
            // Trả về rỗng khi hêt . Client check rỗng để không request lại nữa
            $response["data"]["items"] = [];
            $response["data"]["count_not_seen"] = 0;
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::responseJson($response);
};

$view = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $user = Auth::User();
    $uri = App::GetURI();

    // Xác thực người dùng
    if (isset($user)) {
        Notification::Update_Where(
            ["id", "receiver_id"],
            [$uri["id"], $user["id"]],
            ["is_seen" => App::MethodGet("is_seen")]
        );

        $response["data"] =  [
            "notification_id" => $uri["id"]
        ];
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    if ($response["isError"]) {
        $response["error"]["notification_id"] = $uri["id"];
    }

    App::responseJson($response);
};

$response = function () {
    $response_controller = include_once "controllers/notifications/response.controller.php";

    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $user = Auth::User();
    $uri = App::GetURI();

    // Xác thực người dùng
    if (isset($user)) {
        // Phải là action question và chưa phản hồi thì mới được thực hiện
        $notification = Notification::Find_Where(
            ["id", "receiver_id", "is_response", "action"],
            [$uri["id"], $user["id"],  0, Notification::Action("question")]
        );

        if (isset($notification)) {
            Notification::Update_Where(
                ["id", "receiver_id", "action", "is_response"],
                [$notification["id"], $user["id"], Notification::Action("question"), 0],
                [
                    "is_seen" => 1,
                    "is_response" => 1,
                ]
            );

            $notification = Notification::Find_Where(
                ["id", "receiver_id", "action"],
                [$uri["id"], $user["id"], Notification::Action("question")]
            );

            $check_success = false;

            switch ($notification["type"]) {
                case Notification::Type("brand_member"): {
                        switch ($notification["content_code"]) {
                                // Mời vào
                            case Notification::ContentCode("invite"): {
                                    if (App::MethodGet("accept") == "1") {
                                        // Đồng ý
                                        $response["data"]["result"] = $response_controller["accept_member_invite"]($user, $notification["target_id"]);
                                    } else {
                                        // Từ chối
                                        $response["data"]["result"] = $response_controller["reject_member_invite"]($user, $notification["target_id"]);
                                    }

                                    $check_success = true;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    break;
            }

            if ($check_success && $response["data"]["result"] && !$response["data"]["result"]["is_error"]) {
                $notification_id = Notification::Save([
                    "type" => Notification::Type("brand_member"),
                    "action" => Notification::Action("view"),
                    "content_code" => Notification::ContentCode("invite"),
                    "target_id" =>  $notification["target_id"],
                    "target_name" =>  $notification["target_name"],
                    "target_avatar" =>  $notification["target_avatar"],
                    "sender_id" => $user["id"],
                    "sender_name" => $user["name"],
                    "sender_avatar" => $user["avatar"],
                    "receiver_id" => $notification["sender_id"],
                    "is_result" => App::MethodGet("accept"),
                    "is_response" => 1
                ]);

                $response["data"]["notification"] = Notification::DetailInfo($notification);
                $response["data"]["notification"]["is_result"] = App::MethodGet("accept");
                $response["data"]["send_notification_id"] = $notification_id;
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Phản hồi thông báo thất bại";

                $response["error"]["notification"] = Notification::DetailInfo($notification);
                $response["error"]["notification"]["is_result"] = "0";
                $response["error"]["result"] = $response["data"]["result"];
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Thông báo không tồn tại";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    if ($response["isError"]) {
        $response["error"]["notification_id"] = $uri["id"];
    }

    App::responseJson($response);
};

return [
    "views" => $views,
    "view" => $view,
    "response" => $response,
];
