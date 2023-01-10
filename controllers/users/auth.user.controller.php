<?php

include_once "app/App.php";
include_once "app/libraries/Auth.php";
include_once "models/User.php";
include_once "models/Session.php";

use APP\App;
use APP\LIBRARIES\Auth;
use MODELS\User;
use MODELS\Session;

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
                $response["data"]["role"] = User::Role("user");
                $user_id = User::Save($response["data"]);

                if (isset($user_id)) {
                    $token = User::Create_Token($response["data"]);

                    $session_data = [
                        "user_id" => $user_id,
                        "expire" => time() + CONF_SESSION["expire"],
                        "token" =>  $token,
                        "is_login" => 0
                    ];
                    $session_id = Session::Save($session_data);

                    // Chuyển tiếp qua đăng nhập
                    // App::Cookie("tinychat_ssid",  $token, time() + CONF_COOKIE["expire"], '/');
                    $response["data"] = ["is" => "Đăng ký thành công"];
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

    if ($response["isError"]) {
        $response["error"]["is"] = "Đăng ký thất bại";
        $response["error"]["data"] = $data;
        $response["data"] = null;
    }

    App::responseJson($response);
};

$signin = function () {
    $validater = include_once "app/validates/users/auth.user.validate.php";
    $response = $validater["signin"]();
    $data = $response["data"];

    if (!$response["isError"]) {
        if (!Auth::User()) {

            $user = User::Find_Where(["username"], [$data["username"]]);
            if ($user) {
                $user = User::Login($data);
                if ($user) {
                    $session = Session::Find_Where("user_id", $user["id"]);

                    if ($session["is_login"] == 0) {
                        $token = User::Create_Token($user);
                        $update_session = [
                            "expire" => time() + CONF_SESSION["expire"],
                            "token" => $token
                        ];
                        Session::Update_Where("user_id", $user["id"], $update_session);

                        App::Cookie("tinychat_ssid", $token, time() + CONF_COOKIE["expire"], '/');

                        if ($data["remember"]) {
                            App::Cookie("username", $data["username"], time() + CONF_COOKIE["expire"], '/');
                            App::Cookie("password", $data["password"], time() +  CONF_COOKIE["expire"], '/');
                            App::Cookie("remember", 1, time() +  CONF_COOKIE["expire"], '/');
                        } else {
                            App::Cookie("username", "", -1, '/');
                            App::Cookie("password", "", -1, '/');
                            App::Cookie("remember", "", -1, '/');
                        }
                    } else {
                        $response["isError"] = true;
                        $response["error"]["is"] = "Người dùng đang trực tuyến";
                    }
                } else {
                    $response["isError"] = true;
                    $response["error"]["is"] = "Đăng nhập thất bại";
                    $response["error"]["password"] = "Mật khẩu không đúng";
                }
            } else {
                $response["isError"] = true;
                $response["error"]["is"] = "Đăng nhập thất bại";
                $response["error"]["password"] = "Tên đăng nhập không đúng";
            }
        } else {
            $response["isError"] = true;
            $response["error"]["is"] = "Thao tác bị từ chối";
        }
    } else {
        $response["error"]["is"] = "Đăng nhập thất bại";
    }

    if ($response["isError"]) {
        App::Cookie("password", "", -1, '/');
        $response["error"]["data"] = $data;
        $response["data"] = null;
    }

    App::responseJson($response);
};

$signout = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $user = Auth::User();
    if ($user) {
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
