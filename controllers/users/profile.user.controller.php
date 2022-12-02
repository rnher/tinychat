<?php

include_once "app/services/Auth.php";
include_once "models/User.php";
include_once "app/services/UploadImage.php";
include_once "app/App.php";

use APP\App;
use MODELS\User;
use APP\SERVICES\Auth;
use APP\SERVICES\UploadImage;

$view = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $user = Auth::User();
    if (isset($user)) {
        $response["data"] = User::DetailInfo($user);
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
    if (isset($user)) {
        if (!$response["isError"]) {
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

                $response["data"] = Auth::User();
            } else {
                $response["error"]["data"] = $user;
                $response["isError"] = true;
                $response["error"]["password"] = "Mật khẩu không chính xác";
                $response["error"]["is"] = "Cập nhật không thành công";
            }
        } else {
            $response["error"]["data"] = $user;
            $response["isError"] = true;
            $response["error"]["is"] = "Cập nhật không thành công";
        }
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::responseJson($response);
};

return [
    "update" => $update,
    "view" => $view
];
