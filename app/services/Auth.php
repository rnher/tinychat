<?php

namespace APP\SERVICES;

include_once "models/Session.php";
include_once "models/User.php";
include_once "models/Member.php";
include_once "models/Customer.php";

use APP\Server;
use MODELS\User;
use MODELS\Member;
use MODELS\Session;
use MODELS\Customer;

class Auth
{
    private static $auth;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$auth)) {
            self::$auth = new Auth();
        }
        return self::$auth;
    }

    static function User($ssid = null)
    {
        if (isset($ssid)) {
            $ssid = $ssid;
        } else {
            $ssid = Server::Cookie("ssid");
        }

        $session = Session::Find_Where("token",  $ssid);
        return isset($session) ?  User::Find_Where("id", $session["user_id"]) : null;
    }

    static function Member($ssid = null)
    {

        $user = Auth::User($ssid);
        return isset($user) ? Member::Find_Where("user_id", $user["id"]) : null;
    }


    static function Customer($ssid = null)
    {
        if (isset($ssid)) {
            $ssid = $ssid;
        } else {
            $ssid = Server::Cookie("_ssid");
        }

        return Customer::Find_Where("token", $ssid);
    }
}
