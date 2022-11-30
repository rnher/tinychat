<?php
include_once "app/services/Auth.php";
include_once "app/App.php";
include_once "models/User.php";
include_once "models/Member.php";
include_once "models/Brand.php";
include_once "models/Message.php";
include_once "models/ChatInfo.php";
include_once "app/utils/util.php";
include_once "app/services/UploadImage.php";

use APP\App;
use MODELS\User;
use MODELS\Brand;
use MODELS\Member;
use MODELS\ChatInfo;
use MODELS\message;
use APP\SERVICES\Auth;
use APP\SERVICES\UploadImage;
use MODELS\Customer;

$create = function () {
    $validater = include_once "app/validates/brands/brand.validate.php";
    $response = $validater["create"]();

    $user = Auth::User();
    if (!$response["isError"] && isset($user)) {
        $member = Member::Find_Where(["user_id", "role"], [$user["id"], "admin"]);

        if (!isset($member)) {

            $brand = Brand::Find_Where("name", $response["data"]["name"]);
            if (isset($brand)) {
                $response["isError"] = true;
                $response["error"]["name"] = "Tên thương hiệu đã tồn tại";
            } else {
                $response["data"]["token"] = create_random_bytes();
                $response["data"]["expired_date"] = Brand::Create_Date_Next("m", 1); // Mặt định 1 tháng dùng thử
                $response["data"]["avatar"] = Brand::Get_Default_Avatar();

                $brand_id = Brand::Save($response["data"]);
                $member_id = Member::Save([
                    "brand_id" => $brand_id,
                    "user_id" => $user["id"],
                    "role" => "admin"
                ]);
            }
        } else {
            $response["isError"] = true;
            $response["error"]["name"] = "Tài khoản đã là thành viên của nhãn hàng " . $brand["name"];
        }
    } else {
        $response["error"]["is"] = "Tạo thương hiệu không thành công";
    }

    App::responseJson($response);
};

$view = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $member = Auth::Member();

    $id = null;
    if (
        isset($member)
        && isset($id)
        && $id != -1
    ) {
        $id = App::MethodGet("id");
    } else if (isset($member)) {
        $id =  $member["brand_id"];
    }

    $brand = Brand::Find_Where("id", $id);

    if (isset($brand) &&  isset($member)) {
        $per_page  = CONF_PAGINATION["chatinfo"];
        $total = ChatInfo::Count_Where("id", "brand_id", $brand["id"]);
        $page_url = CONF_URL["brands"] . "?id=" . $brand["id"] . "&";

        $response["data"] = initPaginationMeta($page_url, $total, $per_page);
        $chatsinfos = ChatInfo::Get_With_Page($response["data"], "brand_id", $brand["id"]);
        $response["data"]["brandID"] = $brand["id"];

        function creatData($chatinfo)
        {
            $customer = Customer::Find_Where("id", $chatinfo["customer_id"]);
            return  [
                "chatinfo" => $chatinfo,
                "customer" => Customer::ShortcutInfo($customer),
                "count_not_seen_msg" =>
                Message::Count_Where(
                    "chatinfo_id",
                    ["chatinfo_id",   "is_seen_member"],
                    [$chatinfo["id"], "0"]
                )
            ];
        };

        if (isset($chatsinfos) && isset($chatsinfos[0])) {
            foreach ($chatsinfos as $index => $chatinfo) {
                $chatsinfos[$index] = creatData($chatinfo);
            }

            $response["data"]["items"] = $chatsinfos;
        } else if (isset($chatsinfos)) {
            $response["data"]["items"] = [creatData($chatsinfos, $member)];
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Không có cuộc trò chuyện";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thương hiệu không tồn tại";
    }

    App::responseJson($response);
};

$profile = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $member = Auth::Member();
    if (isset($member) && $member["role"] == "admin") {
        $brand =  Brand::Find_Where("id", $member["brand_id"]);
        if (isset($brand)) {
            $brand["token"] = Brand::Get_Script_Token($brand);
            $response["data"] = $brand;
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Chưa có nhãn hiệu";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    return App::responseJson($response);
};

$update =  function () {
    $validater = include_once "app/validates/brands/brand.validate.php";
    $response = $validater["update"]();
    $data = $response["data"];

    $member = Auth::Member();
    if (isset($member) && $member["role"] == "admin") {
        if (!$response["isError"]) {
            if (isset($data["token"])) {
                $new_token =  create_random_bytes();
                Brand::Update_Where(
                    "id",
                    $member["brand_id"],
                    ["token" => $new_token]
                );

                $response["data"] = [];
                $response["data"]["token"] = $new_token;
            } else if (User::Login([
                "username" => Auth::User()["username"],
                "password" =>  $data["password"]
            ])) {
                if (isset($data["avatar"])) {
                    $image = new UploadImage(
                        [
                            "name" => "avatar",
                            "data" => $data["avatar"]
                        ],
                        "brands/" . $member["brand_id"]
                    );
                    $data["avatar"] =  $image->save();
                } else {
                    unset($data["avatar"]);
                }

                unset($data["password"]);
                unset($data["token"]);

                Brand::Update_Where("id", $member["brand_id"], $data);

                $brand = Brand::Find_Where("id", $member["brand_id"]);
                $brand["token"] = Brand::Get_Script_Token($brand);
                $response["data"] = $brand;
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Cập nhật không thành công";
                $response["error"]["password"] = "Mật khẩu không đúng";

                $brand = Brand::Find_Where("id", $member["brand_id"]);
                $brand["token"] = Brand::Get_Script_Token($brand);
                $response["error"]["data"] = $brand;
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Cập nhật không thành công";

            $brand = Brand::Find_Where("id", $member["brand_id"]);
            $brand["token"] = Brand::Get_Script_Token($brand);
            $response["error"]["data"] = $brand;
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::responseJson($response);
};


return [
    "create" => $create,
    "view" => $view,
    "profile" => $profile,
    "update" => $update
];
