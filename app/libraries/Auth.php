<?php

namespace APP\LIBRARIES;

include_once "models/Session.php";
include_once "models/User.php";
include_once "models/Member.php";
include_once "models/Customer.php";
include_once "models/Brand.php";

use APP\Server;
use MODELS\User;
use MODELS\Brand;
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

    static function Admin($tinychat_ssid = null)
    {
        $user = Auth::User($tinychat_ssid);

        if (isset($user) && $user["role"] == User::Role("admin")) {
            return $user;
        }

        return null;
    }

    static function Members($tinychat_ssid = null)
    {
        $user = Auth::User($tinychat_ssid);
        $members = isset($user) ? Member::Find_Where("user_id", $user["id"]) : [];
        if (isset($members) && !isset($members[0])) {
            $members = [$members];
        }

        return $members;
    }

    static function ListBrand($user_id = null)
    {
        $brands = [];
        $members =  Member::Find_Where("user_id", $user_id);
        if (isset($members)) {
            if (!isset($members[0])) {
                $members = [$members];
            }

            foreach ($members as $member) {
                if ($member) {
                    $brand = Brand::Find_Where("id", $member["brand_id"]);
                    if (isset($brand)) {
                        $brands[] = Brand::DetailInfo($brand);
                    }
                }
            }
        }


        return  $brands;
    }

    static function Customer($tinychat_client_ssid = null)
    {
        return Customer::Find_Where("token", base64_decode($tinychat_client_ssid));
    }
}
