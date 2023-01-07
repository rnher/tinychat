<?php

use APP\App;

$uri = App::GetURI();

switch ($uri[router]) {
    case CONF_ROUTERS["home"]: {
            $dasboard_controller = include_once "controllers/dasboards/dasboard.controller.php";

            App::Controller([
                "get" => $dasboard_controller["view"]
            ]);
        }
        break;
    case CONF_ROUTERS["user"]: {
            $profile_controller = include_once "controllers/users/profile.user.controller.php";

            switch ($uri["id"]) {
                case CONF_ROUTERS["profile"]: {
                        App::Controller([
                            "post" => $profile_controller["update"],
                            "get" => $profile_controller["view"]
                        ]);
                    }
                    break;

                default:
                    App::Go();
                    break;
            }
        }
        break;
    case CONF_ROUTERS["auth"]: {
            $aut_controller = include_once "controllers/users/auth.user.controller.php";

            switch ($uri["id"]) {
                case CONF_ROUTERS["signup"]: {
                        App::Controller([
                            "post" => $aut_controller["signup"],
                        ]);
                    }
                    break;
                case CONF_ROUTERS["signin"]: {
                        App::Controller([
                            "post" => $aut_controller["signin"],
                        ]);
                    }
                    break;
                case CONF_ROUTERS["signout"]: {
                        App::Controller([
                            "get" => $aut_controller["signout"]
                        ]);
                    }
                    break;
                default:
                    App::Go();
                    break;
            }
        }
        break;
    case CONF_ROUTERS["chats"]: {
            $member_chatinfo_controller = include_once "controllers/chatinfos/member.chatinfo.controller.php";

            if ($uri["id"]) {
                App::Controller([
                    "get" => $member_chatinfo_controller["view"],
                    "delete" => $member_chatinfo_controller["delete"],
                ]);
            } else {
                App::Go();
            }
        }
        break;
    case CONF_ROUTERS["clients"]: {
            $auth_client_middleware = include_once "app/middlewares/auth.client.middleware.php";
            $client_chatinfo_controller = include_once "controllers/chatinfos/client.chatinfo.controller.php";
            $brand_auth_middleware = $auth_client_middleware["brand_auth"];

            if ($uri[token]) {
                $brand_auth_middleware();

                App::Controller([
                    "get" => $client_chatinfo_controller["view"],
                    "post" => $client_chatinfo_controller["create"],
                ]);
            } else {
                App::Go();
            }
        }
        break;
    case CONF_ROUTERS["brands"]: {
            $brand_controller = include_once "controllers/brands/brand.controller.php";
            $profile_brand_controller = include_once "controllers/brands/profile.brand.controller.php";

            if ($uri["id"]) {
                switch ($uri[part]) {
                    case "settings": {
                            App::Controller([
                                "get" => $profile_brand_controller["get_settings"],
                            ]);
                        }
                        break;
                    default: {
                            App::Controller([
                                "get" => $brand_controller["view"],
                                "post" => $profile_brand_controller["update"],
                                "delete" => $profile_brand_controller["delete"],
                            ]);
                        }
                        break;
                }
            } else {
                App::Controller([
                    "post" => $profile_brand_controller["create"],
                    "get" => $brand_controller["views"],
                ]);
            }
        }
        break;
    case CONF_ROUTERS["members"]: {
            $member_controller = include_once "controllers/members/member.controller.php";

            if ($uri["id"]) {
                switch ($uri[part]) {
                    case "brand": {
                            App::Controller([
                                "get" => $member_controller["views"],
                                "post" => $member_controller["create"],
                                "delete" => $member_controller["delete"],
                            ]);
                        }
                        break;
                    default: {
                        }
                        break;
                }
            } else {
            }
        }
        break;
    case CONF_ROUTERS["notifications"]: {
            $notification_controller = include_once "controllers/notifications/notification.controller.php";

            if ($uri["id"]) {
                App::Controller([
                    "get" => $notification_controller["view"],
                    "post" => $notification_controller["response"],
                ]);
            } else {
                App::Controller([
                    "get" => $notification_controller["views"],
                ]);
            }
        }
        break;
    case CONF_ROUTERS["usermembers"]: {
            $admin_controller = include_once "controllers/admin/admin.controller.php";

            App::Controller([
                "get" => $admin_controller["views"],
            ]);
        }
        break;
    default:
        App::Go("signin");
        break;
}
