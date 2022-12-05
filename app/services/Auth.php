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

    static function User($tinychat_ssid = null)
    {
        if (isset($tinychat_ssid)) {
            $tinychat_ssid = base64_decode($tinychat_ssid);
        } else {
            $tinychat_ssid = Server::Cookie("tinychat_ssid");
        }

        $session = Session::Find_Where("token",  $tinychat_ssid);
        return isset($session) ? User::Find_Where("id", $session["user_id"]) : null;
    }

    static function Member($tinychat_ssid = null)
    {
        $user = Auth::User($tinychat_ssid);
        return isset($user) ? Member::Find_Where("user_id", $user["id"]) : null;
    }


    static function Customer($tinychat_client_ssid = null)
    {
        // if (isset($tinychat_client_ssid)) {
        //     $tinychat_client_ssid = base64_decode($tinychat_client_ssid);
        // } else {
        //     $tinychat_client_ssid = Server::Cookie("tinychat_client_ssid");
        // }

        // return Customer::Find_Where("token", $tinychat_client_ssid);
        return Customer::Find_Where("token", base64_decode($tinychat_client_ssid));
    }
}
