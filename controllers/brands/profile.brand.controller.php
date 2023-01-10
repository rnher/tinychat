<?php
include_once "app/App.php";
include_once "app/libraries/Auth.php";
include_once "app/services/UploadImage.php";
include_once "app/libraries/Security.php";
include_once "models/User.php";
include_once "models/Brand.php";
include_once "models/Member.php";
include_once "models/Message.php";
include_once "models/Customer.php";
include_once "models/ChatInfo.php";
include_once "models/RelativeMessage.php";
include_once "models/Room.php";
include_once "models/Notification.php";
include_once "models/ChatSettings.php";

use APP\App;
use APP\LIBRARIES\Auth;
use APP\SERVICES\UploadImage;
use APP\LIBRARIES\Security;
use MODELS\Room;
use MODELS\User;
use MODELS\Brand;
use MODELS\Member;
use MODELS\Message;
use MODELS\ChatInfo;
use MODELS\Customer;
use MODELS\Notification;
use MODELS\RelativeMessage;
use MODELS\ChatSettings;

$create = function () {
    $validater = include_once "app/validates/brands/brand.validate.php";
    $response = $validater["create"]();
    $data = $response["data"];

    $user = Auth::User();
    if (!$response["isError"] && isset($user)) {
        $brand = Brand::Find_Where("name", $data["name"]);

        if (isset($brand)) {
            $response["isError"] = true;
            $response["error"]["name"] = "Tên thương hiệu đã tồn tại";
            $response["error"]["is"] = "Tạo thương hiệu không thành công";
        } else {
            $data["expire"] = Brand::Create_Date_Next("m", 1); //TODO: Mặt định 1 tháng dùng thử. Cho dùng thử khi kích hoạt thẻ tín dụng hay gì đó.
            $data["avatar"] = Brand::Get_Default_Avatar();
            $data["banner"] = Brand::Get_Default_Banner();

            // Tạo thương hiệu
            $brand_id = Brand::Save($data);

            // Tạo cấu hình chat
            $chat_settings_id = ChatSettings::Save(
                ChatSettings::Get_Default($brand_id)
            );

            // Tạo thành viên chính là mình
            $member_id = Member::Save([
                "user_id" => $user["id"],
                "token" => Member::Create_Token($user["username"]),
                "brand_id" => $brand_id,
                "role" => Member::Role("admin"),
                "status" => Member::Status("active")
            ]);

            // Tạo phòng chat tổng cho thương hiệu
            if (!Room::Is(Room::Type("brand"), $brand_id, $user["id"])) {
                Room::Save([
                    "room_id" => $brand_id,
                    "user_id" => $user["id"],
                    "type" => Room::Type("brand"),
                    "is_member" => 1
                ]);
            }

            $brand = Brand::Find_Where("id", $brand_id);
            $brand = Brand::DetailInfo($brand);
            $brand["count_chatinfo"] = 0;
            
            $response["data"] = $brand;
        }
    } else {
        $response["error"]["is"] = "Tạo thương hiệu không thành công";
        $response["error"]["data"] = $data;
    }

    App::responseJson($response);
};

$update =  function () {
    $validater = include_once "app/validates/brands/brand.validate.php";
    $response = $validater["update"]();
    $data = $response["data"];

    $uri = App::GetURI();

    $user = Auth::User();
    $brand = Brand::Find_Where(["id"], [$uri["id"]]);
    if (isset($brand) && isset($user) && Security::CheckCSRF($user)) {
        $member = Member::Find_Where(
            ["user_id", "brand_id", "role", "status"],
            [$user["id"], $brand["id"], Member::Role("admin"), Member::Status("active")]
        );

        if (isset($member) && !$response["isError"]) {
            $exitBrand = Brand::Find_Where(["name"], [$data["name"]]);
            if ($brand["name"] == $data["name"] || !isset($exitBrand)) {
                if (User::Login([
                    "username" => Auth::User()["username"],
                    "password" => $data["password"]
                ])) {
                    if (isset($data["avatar"])) {
                        $image = new UploadImage(
                            [
                                "name" => "avatar",
                                "data" => $data["avatar"]
                            ],
                            "brands/" . $brand["id"]
                        );
                        $data["avatar"] =  $image->save();
                    } else {
                        unset($data["avatar"]);
                    }

                    if (isset($data["banner"])) {
                        $image = new UploadImage(
                            [
                                "name" => "banner",
                                "data" => $data["banner"]
                            ],
                            "brands/" . $brand["id"]
                        );
                        $data["banner"] = $image->save();
                    } else {
                        unset($data["banner"]);
                    }

                    unset($data["password"]);

                    $is_edit_token = false;
                    if (isset($data["domain"])) {
                        if ($data["domain"] != $brand["domain"]) {
                            $data["token"] = Brand::Create_Token($data["name"]);
                            $is_edit_token = true;
                        } else {
                            unset($data["domain"]);
                            unset($data["token"]);
                        }
                    } else {
                        $data["domain"] = "";
                        $data["token"] = "";
                    }

                    unset($data["exprire"]);

                    // Lấy dữ liệu cài đặt và cập nhật
                    $chat_settings_data = ChatSettings::Get_Data($data);
                    if ($chat_settings_data) {
                        ChatSettings::Update_Where("brand_id", $brand["id"], $chat_settings_data);
                    }

                    // Lấy dữ liệu thương hiệu và cập nhật
                    $brand_data = Brand::Get_Data($data);
                    if ($brand_data) {
                        Brand::Update_Where("id", $brand["id"], $brand_data);
                    }

                    $brand = Brand::Find_Where("id", $brand["id"]);
                    $chat_settings = ChatSettings::Find_Where("brand_id", $brand["id"]);
                    $response["data"] = [
                        ...Brand::DetailInfo($brand),
                        ...ChatSettings::DetailInfo($chat_settings),
                    ];
                    $response["data"]["csrf"] = Security::CreateCSRF($user);
                    $response["data"]["is_edit_token"] = $is_edit_token;
                } else {
                    $response["isError"] = true;
                    $response["error"]["is"] = "Mật khẩu không đúng";
                }
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Tên thương hiệu đã được sử dụng";
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Cập nhật không thành công";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    if ($response["isError"]) {
        $response["data"] = null;

        $brand = Brand::Find_Where("id", $uri["id"]);
        $chat_settings = ChatSettings::Find_Where("brand_id", $brand["id"]);
        $response["error"]["data"] = [
            ...Brand::DetailInfo($brand),
            ...ChatSettings::DetailInfo($chat_settings),
        ];
        $response["error"]["data"]["csrf"] = isset($user) ?  Security::CreateCSRF($user) : "";
    }

    App::responseJson($response);
};

$delete =  function () {
    // $validater = include_once "app/validates/brands/brand.validate.php";
    // $response = $validater["delete"]();
    // $data = $response["data"];

    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $uri = App::GetURI();

    $user = Auth::User();
    $brand = Brand::Find_Where(["id"], [$uri["id"]]);
    if (isset($brand)) {
        if (!$response["isError"]) {
            $member = Member::Find_Where(
                ["user_id", "brand_id", "role", "status"],
                [$user["id"], $brand["id"], Member::Role("admin"), Member::Status("active")]
            );

            if ($member) {
                // if (User::Login([
                //     "username" => Auth::User()["username"],
                //     "password" => $data["password"]
                // ])) {

                // Xóa brand
                Brand::Delete_Where("id", $brand["id"]);

                // Xóa cài đặt
                ChatSettings::Delete_Where("brand_id", $brand["id"]);

                // Xóa room brand
                Room::Delete_Where(["type", "room_id"], [Room::Type("brand"), $brand["id"]]);
                // Xóa room chatinfo
                $chatinfo_list = ChatInfo::Find_Where("brand_id", $brand["id"]);
                if (isset($chatinfo_list)) {
                    if (!isset($chatinfo_list[0])) {
                        $chatinfo_list = [$chatinfo_list];
                    }

                    foreach ($chatinfo_list as $chatinfo) {
                        Room::Delete_Where(
                            ["type", "room_id"],
                            [
                                Room::Type("chatinfo"),
                                $chatinfo["id"]
                            ]
                        );

                        //TODO: xóa tin nhắn. Hiện tại sẽ để lưu trữ
                        // Message::DeleteFile($chatinfo);
                    }
                }

                // Xóa chatinfo
                ChatInfo::Delete_Where("brand_id", $brand["id"]);

                // Xóa customer
                Customer::Delete_Where("brand_id", $brand["id"]);

                // Xóa message
                RelativeMessage::Delete_Where(
                    ["someone_type", "someone_id"],
                    [RelativeMessage::Type("brand"), $brand["id"]]
                );

                $notification_ids = [];
                $user_ids = [];

                $members = Member::Find_Where(
                    ["brand_id", "status", "role"],
                    [$brand["id"], Member::Status("active"), Member::Role("member")]
                );

                if (isset($members)) {
                    if (!isset($members[0])) {
                        $members = [$members];
                    }

                    foreach ($members as $m) {
                        // Thông báo xóa thành viên ra khỏi
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
                            "receiver_id" => $m["user_id"],
                        ]);

                        $notification_ids[] = $notification_id;
                        $user_ids[] = $m["user_id"];
                    }
                }

                // Xóa all member
                Member::Delete_Where(
                    ["brand_id"],
                    [$brand["id"]]
                );

                // TODO: xóa  analyse

                $response["data"]["brand_id"] = $brand["id"];
                $response["data"]["notification_ids"] = $notification_ids;
                $response["data"]["user_ids"] = $user_ids;
                // } else {
                //     $response["isError"] = true;
                //     $response["error"]["is"] = "Mật khẩu không đúng";
                // }
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Thao tác bị từ chối";
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Xóa không thành công";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thương hiệu không tồn tại";
    }

    App::responseJson($response);
};

$get_settings = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $uri = App::GetURI();

    $user = Auth::User();
    $brand = Brand::Find_Where("id", $uri["id"]);
    if (isset($brand)) {

        $chat_settings = ChatSettings::Find_Where("brand_id", $brand["id"]);

        if (isset($user)) {
            $member = Member::Find_Where(
                ["user_id", "brand_id"],
                [$user["id"], $brand["id"]]
            );

            if (isset($member) && $member["status"] != Member::Status("not_active")) {
                $response["data"] = [
                    ...Brand::DetailInfo($brand),
                    ...ChatSettings::DetailInfo($chat_settings),
                ];
                $response["data"]["is_admin"] = $member["role"] == Member::Role("admin");
                $response["data"]["csrf"] = Security::CreateCSRF($user);
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Thao tác bị từ chối";
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Chưa đăng nhập";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thương hiệu không tồn tại";
    }

    return App::responseJson($response);
};

return [
    "create" => $create,
    "update" => $update,
    "delete" => $delete,
    "get_settings" => $get_settings,
];
