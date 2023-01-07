<?php

namespace APP\LIBRARIES;

include_once "app/App.php";
include_once "app/utils/util.php";
include_once "models/Session.php";

use APP\App;
use MODELS\Session;

class Security
{
    private static $security;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$security)) {
            self::$security = new Security();
        }
        return self::$security;
    }

    static function CreateCSRF($user)
    {
        $csrf = create_random_bytes($user["id"]);
        Session::Update_Where(
            ["user_id"],
            [$user["id"]],
            ["csrf" => $csrf]
        );

        return $csrf;
    }

    static function CheckCSRF($user)
    {
        $session = Session::Find_Where(
            ["user_id"],
            [$user["id"]],
        );

        $csrf = App::MethodPost("csrf");

        if (
            isset($session) && isset($csrf)
            && ($session["csrf"] == $csrf)
        ) {
            self::ClearCSRF($user);

            return true;
        }

        return false;
    }

    static function ClearCSRF($user)
    {
        Session::Update_Where(
            ["user_id"],
            [$user["id"]],
            ["csrf" => ""]
        );
    }
}
