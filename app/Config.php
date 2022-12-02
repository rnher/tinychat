<?php

namespace APP;

class Config
{
    private static $config;

    protected function  __construct()
    {
        define("user", "user");
        define("router", "router");
        define("action", "action");
        define("id", "id");
        define("token", "token");

        define("CONF_DOMAIN", "localhost");
        // define("CONF_DOMAIN", "159.223.46.242");
        define("CONF_PROTOCOl", "http");
        define("CONF_HOST", CONF_PROTOCOl . "://" . CONF_DOMAIN);

        define("CONF_DB", [
            "dbname" => "tinychat",
            "hostname" => "localhost",
            "username" => "root",
            "password" => "",
            // "password" => "`1Tinychat",
        ]);

        define("CONF_APP", [
            "name" => "Tiny Chat",
            "description" => "Tiny Chat - Ứng dụng chat đa nền tảng",
            "host" => CONF_HOST,
            "domain" => CONF_DOMAIN,
            "defaults" => [
                "customer_avatar" => CONF_HOST . "/public/images/defaults/customer-avatar.jpg",
                "brand_avatar" => CONF_HOST . "/public/images/defaults/brand-avatar.jpg",
                "user_avatar" => CONF_HOST . "/public/images/defaults/user-avatar.jpg",
                "chat-bubble-avatar" => CONF_HOST . "/public/images/defaults/chat-bubble-avatar.jpg",
            ]
        ]);

        define("CONF_UPLOAD", [
            "image" => [
                "target_dir" => "public/images/uploads",
                "root_dir" =>  CONF_HOST . "/"
            ]
        ]);

        define("CONF_ROUTERS", [
            "auth" => "auth",
            "chats" => "chats",
            "home" => "home",
            "user" => "user",
            "brands" => "brands",
            "signout" => "signout",
            "signup" => "signup",
            "signin" => "signin",
            "profile" => "profile",
            "check" => "check",
            "clients" => "clients",
        ]);

        define("CONF_URL", [
            "signup" => "/auth/signup",
            "signin" => "/auth/signin",
            "signout" => "/auth/signout",
            "home" => "/",
            "chats" => "/chats",
            "brands" => "/brands",
            "clients" => "/clients",

        ]);

        define("CONF_PAGINATION", [
            "chatinfo" => 20,
            "message" => 30
        ]);

        define("CONF_SEED", [
            "count_customer" => 10,
            "count_brand" => 3,
            "count_message" => 30,
            "count_chatinfo" => 10,
        ]);

        define("CONF_SESSION", [
            "expire" => 30 * 24 * 60 * 60
        ]);

        define("CONF_COOKIE", [
            "expire" => 30 * 24 * 60 * 60
        ]);

        define("CONF_SOCKET", [
            "port" => 8080,
            "max_connect" => 1024,
            "actionKey" => [
                "addMessage" => "addMessage",
                "noticationPing" => "noticationPing",
                "logout" => "logout",
                "login" => "login",
                "checkPingUsers" => "checkPingUsers",
                "addChatInfo" => "addChatInfo",
                "updateSeen" => "updateSeen"
            ]
        ]);
    }

    static function Init()
    {
        if (!isset(self::$config)) {
            self::$config = new Config();
        }
        return self::$config;
    }
}
