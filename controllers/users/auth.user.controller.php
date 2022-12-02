<?php

include_once "app/services/Auth.php";
include_once "models/User.php";
include_once "app/App.php";

use APP\App;
use MODELS\User;
use MODELS\Session;
use APP\SERVICES\Auth;

$signup = function () {
    $validater = include_once "app/validates/users/auth.user.validate.php";
    $response = $validater["signup"]();
    $data = $response["data"];

    if (!$response["isError"]) {
        if (!Auth::User()) {
            if (User::Find_Where("username", $data["username"])) {
                $response["isError"] = true;
                $response["error"]["username"] = "Tên đăng nhập đã tồn tại";
            } else {
                $response["data"]["avatar"] = User::Get_Default_Avatar();
                $user_id = User::Save($response["data"]);

                if (isset($user_id)) {
                    $token = create_random_bytes();

                    $session_data = [
                        "user_id" => $user_id,
                        "expire" => time() + CONF_SESSION["expire"],
                        "is_login" => 1,
                        "token" =>  $token
                    ];
                    $session_id = Session::Save($session_data);
                    App::Cookie("tinychat_ssid",  $token, time() + CONF_COOKIE["expire"], '/');
                } else {
                    $response["isError"] = true;
                    $response["error"]["is"] = "Đăng ký thất bại";
                }
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Thao tác bị từ chối";
        }
    }

    App::responseJson($response);
};

$signin = function () {
    $validater = include_once "app/validates/users/auth.user.validate.php";
    $response = $validater["signin"]();
    $data = $response["data"];

    if (!$response["isError"]) {
        if (!Auth::User()) {

            $user = User::Login($data);
            if ($user) {
                $update_session = [
                    "expire" => time() + CONF_SESSION["expire"],
                    "is_login" => 1
                ];
                Session::Update_Where("user_id", $user["id"], $update_session);

                $session = Session::Find_Where("user_id", $user["id"]);
                App::Cookie("tinychat_ssid", $session["token"], time() + CONF_COOKIE["expire"], '/');

                if ($data["remember"]) {
                    App::Cookie("username", $data["username"],  time() + CONF_COOKIE["expire"], '/');
                    App::Cookie("password", $data["password"], time() +  CONF_COOKIE["expire"], '/');
                    App::Cookie("remember", 1, time() +  CONF_COOKIE["expire"], '/');
                } else {
                    App::Cookie("username", "",  -1, '/');
                    App::Cookie("password", "", -1, '/');
                    App::Cookie("remember", "", -1, '/');
                }
            } else {
                App::Cookie("password", "", -1, '/');
                $response["isError"] = true;
                $response["error"]["is"] = "Đăng nhập thất bại";
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Thao tác bị từ chối";
        }
    }

    App::responseJson($response);
};

$signout = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    if (Auth::User()) {
        $update_session = [
            "expire" => -1,
            "is_login" => 0
        ];
        Session::Update_Where("token", App::Cookie("tinychat_ssid"), $update_session);

        App::Cookie("tinychat_ssid", "", -1, '/');
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    App::Go("home");
};

return [
    "signup" => $signup,
    "signin" => $signin,
    "signout" => $signout,
];
