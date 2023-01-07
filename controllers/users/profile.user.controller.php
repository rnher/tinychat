<?php

include_once "app/App.php";
include_once "app/services/UploadImage.php";
include_once "app/libraries/Security.php";
include_once "app/libraries/Auth.php";
include_once "models/User.php";

use APP\App;
use APP\LIBRARIES\Auth;
use APP\SERVICES\UploadImage;
use APP\LIBRARIES\Security; 
use MODELS\User;

$view = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $user = Auth::User();
    if (isset($user)) {
        $response["data"] = User::DetailInfo($user);
        $response["data"]["csrf"] = Security::CreateCSRF($user);
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Không có thông tin";
    }

    App::responseJson($response);
};

$update =  function () {
    $validater = include_once "app/validates/users/profile.user.validate.php";

    $response = $validater["update"]();
    $data = $response["data"];

    $user = Auth::User();
    if ($user) {
        if (
            !$response["isError"]
            && Security::CheckCSRF($user)
        ) {
            if (User::Login([
                "username" => $user["username"],
                "password" =>  $data["password"]
            ])) {

                if (isset($data["avatar"])) {
                    $image = new UploadImage(
                        ["name" => "avatar", "data" => $data["avatar"]],
                        "users/" . $user["id"]
                    );

                    $data["avatar"] = $image->save();
                } else {
                    unset($data["avatar"]);
                }

                if (isset($data["newpassword"])) {
                    $data["password"] =  $data["newpassword"];
                } else {
                    unset($data["password"]);
                }
                unset($data["newpassword"]);
                unset($data["repassword"]);

                User::Update_Where("id", $user["id"], $data);

                // TODO: kiểm tra tính duy nhất của mail
                $user = Auth::User();
                $response["data"] = User::DetailInfo($user);
                $response["data"]["csrf"] = Security::CreateCSRF($user);
            } else {
                $response["error"]["data"] = $user;
                $response["error"]["data"]["csrf"] = Security::CreateCSRF($user);
                $response["isError"] = true;
                $response["error"]["password"] = "Mật khẩu không chính xác";
                $response["error"]["is"] = "Cập nhật không thành công";
            }
        } else {
            $response["error"]["data"] = $user;
            $response["error"]["data"]["csrf"] = Security::CreateCSRF($user);
            $response["isError"] = true;
            $response["error"]["is"] = "Cập nhật không thành công";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    if ($response["isError"]) {
        $response["data"] = null;
    }

    App::responseJson($response);
};

return [
    "update" => $update,
    "view" => $view
];
