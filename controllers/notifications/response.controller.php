<?php
include_once "models/Member.php";
include_once "models/Room.php";
include_once "models/ChatInfo.php";

use MODELS\Brand;
use MODELS\Member;
use MODELS\Room;
use MODELS\ChatInfo;

$accept_member_invite = function ($user, $brand_id) {
    $member =  Member::Find_Where(
        ["brand_id", "user_id"],
        [$brand_id, $user["id"]],
    );

    if (isset($member)) {
        // Cập nhật trạng thái member
        Member::Update_Where(
            ["brand_id", "user_id"],
            [$brand_id, $user["id"]],
            ["status" => Member::Status("active")]
        );

        // Add phòng chat tổng cho thương hiệu
        if (!Room::Is(Room::Type("brand"), $brand_id, $user["id"])) {
            Room::Save([
                "room_id" =>  $brand_id,
                "user_id" => $user["id"],
                "type" => Room::Type("brand"),
                "is_member" => 1
            ]);
        }

        // Add room chatinfo
        $chatinfo_list = ChatInfo::Find_Where("brand_id", $brand_id);
        if (isset($chatinfo_list)) {
            if (!isset($chatinfo_list[0])) {
                $chatinfo_list = [$chatinfo_list];
            }

            foreach ($chatinfo_list as $chatinfo) {
                if (!Room::Is(Room::Type("chatinfo"), $chatinfo["id"], $user["id"])) {
                    Room::Save([
                        "room_id" => $chatinfo["id"],
                        "user_id" => $user["id"],
                        "type" => Room::Type("chatinfo"),
                        "is_member" => 1
                    ]);
                }
            }
        }

        $brand = Brand::Find_Where(["id"], [$brand_id]);
        $brand = isset($brand) ? Brand::DetailInfo($brand) : [];

        return [
            "is_error" => false,
            ...$brand
        ];
    }

    return [
        "is_error" => true,
        "id" => $brand_id
    ];
};

$reject_member_invite = function ($user, $brand_id) {
    $member =  Member::Find_Where(
        ["brand_id", "user_id"],
        [$brand_id, $user["id"]],
    );

    if (isset($member)) {
        // Cập nhật trạng thái member
        Member::Update_Where(
            ["brand_id", "user_id"],
            [$brand_id, $user["id"]],
            ["status" => Member::Status("not_active")]
        );

        return [
            "is_error" => false,
            "id" => $brand_id
        ];
    }

    return [
        "is_error" => true,
        "id" => $brand_id
    ];
};

return [
    "accept_member_invite" => $accept_member_invite,
    "reject_member_invite" => $reject_member_invite,
];
