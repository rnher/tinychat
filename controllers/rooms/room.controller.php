<?php
include_once "app/App.php";
include_once "app/libraries/Auth.php";
include_once "models/User.php";
include_once "models/Group.php";
include_once "models/Room.php";
include_once "models/Notification.php";

use APP\App;
use APP\LIBRARIES\Auth;
use MODELS\Room;
use MODELS\User;
use MODELS\Group;
use MODELS\Notification;

$create = function () {
    $validater = include_once "app/validates/rooms/room.validate.php";
    $response = $validater["create"]();
    $data = $response["data"];

    if (!$response["isError"]) {
        $uri = App::GetURI();
        $user = Auth::User();

        if (isset($user)) {
            $user_ids = $data["users"];

            $group_id = Group::Save(["name" => $data["name"]]);
            $room_id = Room::Save(
                ["room_id", "user_id", "type", "is_member"],
                [$group_id, $user["id"], Room::Type("group"), 1]
            );

            foreach ($user_ids as $user_id) {
                $u = User::Find_Where(["id"], [$user_id]);

                if (isset($u)) {
                    // Tạo room cho các thành viên
                    $room_id = Room::Save(
                        ["room_id", "user_id", "type", "is_member"],
                        [$group_id, $u["id"], Room::Type("group"), 1]
                    );

                    // Tạo thông
                    $notification = Notification::Find_Where(
                        [
                            "type",
                            "action",
                            "content_code",
                            "target_id",
                            "target_name",
                            "target_avatar",
                            "sender_id",
                            "sender_name",
                            "sender_avatar",
                            "receiver_id",
                        ],
                        [
                            Notification::Type("room_group"),
                            Notification::Type("view"),
                            Notification::ContentCode("invite"),
                            $group_id,
                            $user["id"],
                            $u["id"],
                        ]
                    );

                    $invite_user_id_list[] = User::ShortcutInfo($u);
                }
            }

            if (count($invite_user_id_list)) {
                $response["data"] = [
                    "group_id" => $group_id,
                    "users" => $invite_user_id_list
                ];
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Tạo cuộc trò chuyện không thành công";
            }
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Tạo cuộc trò chuyện không thành công";
    }

    App::responseJson($response);
};

$leave = function () {
    $uri = App::GetURI();
    $user = Auth::User();

    if (isset($user)) {
        $group = Group::Find_Where(
            ["id"],
            [$uri["id"]]
        );

        if (isset($group)) {
            $room = Room::Find_Where(
                ["type", "room_id", "user_id", "is_member"],
                [Room::Type("group"), $group["id"], $user["id"], 1]
            );

            if (isset($room)) {
                Room::Delete_Where(
                    ["type", "room_id", "user_id", "is_member"],
                    [Room::Type("group"), $group["id"], $user["id"], 1]
                );

                $response["data"] = [
                    "room" =>  Room::ShortcutInfo($room)
                ];
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Bạn đã không còn là thành viên của nhóm";
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Nhóm không tồn tại";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::responseJson($response);
};

return [
    "create" => $create,
    "leave" => $leave
];
// TODO: