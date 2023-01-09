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
        define("ssid", "ssid");
        define("part", "part");

        // define("CONF_DOMAIN", "designweb.vn");
        // define("CONF_PROTOCOl", "https");
        define("CONF_DOMAIN", "localhost");
        define("CONF_PROTOCOl", "http");
        define("CONF_HOST", CONF_PROTOCOl . "://" . CONF_DOMAIN);

        define("CONF_DB", [
            "dbname" => "tinychat",
            "hostname" => "localhost",
            "username" => "root",
            // "password" => "`1Tinychat",
            "password" => "",
        ]);

        define("CONF_SOCKET", [
            "host" => "0.0.0.0:8043",
            "max_connect" => 1024,
            "actionKey" => [
                "addMessage" => "addMessage",
                "noticationPing" => "noticationPing",
                "logout" => "logout",
                "login" => "login",
                "checkPingChatinfos" => "checkPingChatinfos",
                "addChatInfo" => "addChatInfo",
                "updateSeen" => "updateSeen",
                "updateTyping" => "updateTyping",
                "updateSeenChatinfo" => "updateSeenChatinfo",
                "removeChatInfo" => "removeChatInfo",
                "pushNotification" => "pushNotification",
                "removeBrand" => "removeBrand",
            ]
        ]);

        define("CONF_APP", [
            "name" => "I-WEB Chat",
            "description" => "I-WEB Chat - Ứng dụng chat bảo mật giúp kết nối nhanh chóng vơi khách hàng tiềm năng của bạn",
            "keywords" => "iweb, iweb chat, I-WEB Chat, Ứng dụng chat",
            "icon" => "/public/images/app/icon.png",
            "main_host" => "https://i-web.vn",
            "manifest" => "/public/manifest.json",
            "host" => CONF_HOST,
            "domain" => CONF_DOMAIN,
            "logo" => "/public/images/app/logo.png",
            "introduce_images" => [
                [
                    "dir" => "/public/images/app/banners/introduce/quick-connect.png",
                    "content" => "Kết nối khách hàng nhanh chống",
                    "name" => "Kết nối khách hàng nhanh chống"
                ],
                [
                    "dir" => "/public/images/app/banners/introduce/quick-message.png",
                    "content" => "Tin nhắn tức thời",
                    "name" => "Tin nhắn tức thời"
                ],
                [
                    "dir" => "/public/images/app/banners/introduce/rsa-encrypt.png",
                    "content" => "Được mã hóa 2 chiều với RSA",
                    "name" => "Được mã hóa 2 chiều với RSA"
                ],
                [
                    "dir" => "/public/images/app/banners/introduce/file-variety.png",
                    "content" => "Gửi đa dạng tập tin",
                    "name" => "Gửi đa dạng tập tin"
                ],
            ],
            "defaults" => [
                "max_customer_avatar" => 9,
                "max_user_avatar" => 9,
                "customer_avatar_1" => "/public/images/defaults/customers/customer-avatar-1.jpg",
                "customer_avatar" => "/public/images/defaults/customers/customer-avatar-[index].jpg",
                "user_avatar" => "/public/images/defaults/users/user-avatar-[index].jpg",
                "brand_avatar" => "/public/images/defaults/brands/brand-avatar.png",
                "brand_banner" => "/public/images/defaults/brands/brand-banner.png",
                "data_empty" => "/public/images/defaults/empty/data-empty.jpg",
                "chatinfo_empty" => "/public/images/defaults/empty/chatinfo.empty.png",
            ],
            "ssl" => [
                "local_cert"  => "app/ssl/certificate.crt",
                "local_pk" => "app/ssl/private.key",
                "verify_peer" => false,
                "allow_self_signed" => false
            ],
            "openssl" => [
                "private_key_bits" => 2048,
                "private_key_type" => OPENSSL_KEYTYPE_RSA,
            ]
        ]);

        define("CONF_LOG", [
            "socket" => [
                "dir" => "app/logs/",
                "file_name" => "socket.log"
            ]
        ]);

        define("CONF_UPLOAD", [
            "image" => [
                "target_dir" => "public/images/uploads",
                "root_dir" =>  "/",
                "formats" => ["jpeg", "jpg", "png", "gif", "svg", "webp"],
                "size" => 2
            ],
            "file" => [
                "message" => [
                    "dir" => "app/database/data/",
                    "extension" => "txt"
                ]
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
            "members" => "members",
            "clients" => "clients",
            "rooms" => "rooms",
            "notifications" => "notifications",
            "usermembers" => "usermembers",
        ]);

        define("CONF_URL", [
            "signup" => "/auth/signup",
            "signin" => "/auth/signin",
            "signout" => "/auth/signout",
            "home" => "/",
            "chats" => "/chats",
            "brands" => "/brands",
            "clients" => "/clients",
            "notifications" => "/notifications",
            "usermembers" => "/usermembers",
        ]);

        define("CONF_PAGINATION", [
            "chatinfo" => 20,
            "message" => 30,
            "notification" => 10,
            "usermembers" => 30
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

        define("CONF_REG", [
            "url" => "/^(https?:\/\/)?(([\w\-])+\.{1}([a-zA-Z]{2,63})|(localhost))([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)$/i"
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
