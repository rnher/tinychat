<?php
include_once "app/App.php";
include_once "app/libraries/Auth.php";
include_once "app/utils/util.php";
include_once "models/Room.php";
include_once "models/User.php";
include_once "models/Brand.php";
include_once "models/Member.php";
include_once "models/ChatInfo.php";
include_once "models/Notification.php";

use APP\App;
use APP\LIBRARIES\Auth;
use MODELS\Room;
use MODELS\User;
use MODELS\Brand;
use MODELS\Member;
use MODELS\ChatInfo;
use MODELS\Notification;

$create = function () {
    $validater = include_once "app/validates/members/member.validate.php";
    $response = $validater["create"]();
    $data = $response["data"];

    $uri = App::GetURI();

    $user = Auth::User();
    $brand = Brand::Find_Where("id", $uri["id"]);
    if (!$response["isError"] && isset($user) && isset($brand)) {
        $member = Member::Find_Where(
            ["user_id", "brand_id", "role", "status"],
            [$user["id"], $brand["id"],  Member::Role("admin"), Member::Status("active")]
        );

        if (isset($member)) {
            $memberUser = User::Find_Where(
                ["mail"],
                [$data["mail"]]
            );

            if (isset($memberUser)) {
                if ($user["id"] !=  $memberUser["id"]) {
                    // Tạo notification mới
                    $notification_id = Notification::Save([
                        "type" => Notification::Type("brand_member"),
                        "action" => Notification::Action("question"),
                        "content_code" => Notification::ContentCode("invite"),
                        "target_id" =>  $brand["id"],
                        "target_name" =>  $brand["name"],
                        "target_avatar" =>  $brand["avatar"],
                        "sender_id" => $user["id"],
                        "sender_name" => $user["name"],
                        "sender_avatar" => $user["avatar"],
                        "receiver_id" => $memberUser["id"],
                    ]);

                    $userMember = Member::Find_Where(
                        ["brand_id", "user_id"],
                        [$brand["id"], $memberUser["id"]]
                    );

                    if (isset($userMember) || (isset($userMember) && $userMember["status"] == Member::Status("active"))) {
                        $response["isError"] = true;
                        $response["error"]["is"] = "Người dùng đã có trong danh sách thành viên của thương hiệu";
                    } else if (isset($userMember) && $userMember["status"] == Member::Status("pendding")) {
                        $response["isError"] = true;
                        $response["error"]["is"] = "Lời mời làm thành viên đang chờ người dùng phản hồi";
                    } else {
                        // Tạo member
                        $dataMember = [
                            "brand_id" => $brand["id"],
                            "user_id" => $memberUser["id"],
                            "role" => Member::Role("member"),
                            "token" => Member::Create_Token($memberUser["username"]),
                            "status" => Member::Status("pendding")
                        ];
                        $member_id = Member::Save($dataMember);

                        $response["data"] = [
                            ...User::ShortcutInfo($memberUser),
                            ...$dataMember,
                            "id" => $member_id,
                            "send_notification_id" => $notification_id,
                            "is_admin" => true
                        ];
                    }
                } else {
                    $response["isError"] = true;
                    $response["error"]["is"] = "Bạn đã là quản trị viên của thương hiệu này";
                }
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Không tìm thấy người dùng";
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Thao tác bị từ chối";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thêm thành viên thất bại";
    }

    if ($response["isError"]) {
        $response["error"]["brand"] = $brand;
        $response["error"]["data"] = $data;
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
    $brand = Brand::Find_Where("id", $uri["id"]);
    if (isset($user) && isset($brand)) {
        $member = Member::Find_Where(
            ["user_id", "brand_id", "role", "status"],
            [$user["id"], $brand["id"],  Member::Role("admin"), Member::Status("active")]
        );

        if (isset($member)) {
            $member_id = App::MethodGet("member_id");

            $otherMember = Member::Find_Where(["id"], [$member_id]);
            if (isset($otherMember)) {
                Member::Delete_Where(
                    ["brand_id", "role", "id"],
                    [$brand["id"], Member::Role("member"),  $member_id]
                );

                // Xóa room brand
                Room::Delete_Where(
                    ["type", "room_id", "user_id"],
                    [Room::Type("brand"), $brand["id"], $member_id]
                );
                // Xóa room chatinfo
                $chatinfo_list = ChatInfo::Find_Where("brand_id", $brand["id"]);
                if (isset($chatinfo_list)) {
                    if (!isset($chatinfo_list[0])) {
                        $chatinfo_list = [$chatinfo_list];
                    }

                    foreach ($chatinfo_list as $chatinfo) {
                        Room::Delete_Where(
                            ["type", "room_id", "user_id"],
                            [Room::Type("chatinfo"), $chatinfo["id"], $otherMember["user_id"]]
                        );
                    }
                }

                // Thông báo khi thành viên chính thức ở trong thương hiệu
                if ($otherMember["status"] == Member::Status("active")) {
                    // Tạo notification mới
                    $notification_id = Notification::Save([
                        "type" => Notification::Type("brand_member"),
                        "action" => Notification::Action("view"),
                        "content_code" => Notification::ContentCode("delete"),
                        "target_id" =>  $brand["id"],
                        "target_name" =>  $brand["name"],
                        "target_avatar" =>  $brand["avatar"],
                        "sender_id" => $user["id"],
                        "sender_name" => $user["name"],
                        "sender_avatar" => $user["avatar"],
                        "receiver_id" => $otherMember["user_id"],
                    ]);

                    $response["data"]["send_notification_id"] = $notification_id;
                }

                $response["data"]["brand_id"] = $brand["id"];
                $response["data"]["member_id"] = $otherMember["id"];
                $response["data"]["user_id"] = $otherMember["user_id"];
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Thành viên không tồn tại";
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Thao tác bị từ chối";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Xóa thành viên thất bại";
    }

    App::responseJson($response);
};

$views = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $uri = App::GetURI();

    $user = Auth::User();
    $brand = Brand::Find_Where("id", $uri["id"]);
    if (isset($user) && isset($brand)) {
        $member = Member::Find_Where(
            ["user_id", "brand_id"],
            [$user["id"], $brand["id"]]
        );

        if (isset($member)) {
            $members = Member::Find_With_Rerelative_Brand($brand["id"]);

            if (!isset($members[0])) {
                $members = [$members];
            }

            $response["data"]["is_admin"] = $member["role"] == Member::Role("admin");
            $response["data"]["items"] = $members;
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Thao tác bị từ chối";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::responseJson($response);
};

return [
    "create" => $create,
    "delete" => $delete,
    "views" => $views,
];
