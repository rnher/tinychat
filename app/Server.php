<?php

namespace APP;

class Server
{
    private static $server;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$server)) {
            self::$server = new Server();
        }
        return self::$server;
    }

    static function MethodGet($parameter)
    {
        return (isset($_GET[$parameter])
            && !empty($_GET[$parameter]))  ? $_GET[$parameter] : null;
    }

    static function MethodPost($parameter)
    {
        return (isset($_POST[$parameter])
            && !empty($_POST[$parameter])) ? $_POST[$parameter] : null;
    }

    static function Cookie(
        $key,
        $value = null,
        $time = 0,
        $part = "/",
        $domain = "",
        $secure = false,
        $httponly = false,
        $samesite = "Lax"
    ) {
        if (isset($key)) {
            if (isset($value)) {
                $value = base64_encode($value);

                switch ($key) {
                    case "tinychat_client_ssid": {
                            setrawcookie($key, $value, [
                                "expires" => $time,
                                "path" => $part,
                                "domain" => $domain,
                                "secure" => true,
                                "httponly" => $httponly,
                                "samesite" => "none",
                            ]);
                        }
                        break;
                    case "tinychat_ssid":
                    default: {
                            setrawcookie($key, $value, [
                                "expires" => $time,
                                "path" => $part,
                                "domain" => $domain,
                                "secure" => $secure,
                                "httponly" => $httponly,
                                "samesite" => $samesite,
                            ]);
                        }
                        break;
                }

                return $value;
            } else {
                $cookie =  isset($_COOKIE[$key]) ? $_COOKIE[$key] : null;
                if (isset($cookie)) {
                    $cookie = base64_decode($cookie);
                }

                return  $cookie;
            }
        }

        return false;
    }

    static function getEndcodeCookie($key, $is_raw_value = false)
    {
        if ($is_raw_value) {
            return base64_encode($key);
        }

        return isset($_COOKIE[$key]) ? $_COOKIE[$key] : null;
    }

    static function GetURI()
    {
        return [
            "router" => CONF_ROUTERS[Server::MethodGet(router)],
            "id" => Server::MethodGet(id),
            "action" => Server::MethodGet(action),
            "token" => Server::MethodGet(token),
            "ssid" => Server::MethodGet(ssid),
        ];
    }

    static function getRequestMethod()
    {
        return $_SERVER["REQUEST_METHOD"];
    }

    static function Controller($controller)
    {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "POST": {
                    $controller["post"] ?  $controller["post"]() : null;
                }
                break;
            case "GET": {
                    $controller["get"] ?  $controller["get"]() : null;
                }
                break;
            default: {
                }
                break;
        }
    }

    // Kiểm tra format url
    static function GetRequestReferer($domain)
    {
        if (isset($domain)) {

            if ("/" == substr($domain, -1)) {
                $domain = substr($domain, 0, -1);
            }
            $domain = str_replace("https://", "", $domain);
            $domain = str_replace("http://", "", $domain);
            $domain = str_replace("/", "\/", $domain);

            $refererDomain = $_SERVER["HTTP_REFERER"];
            $refererDomain = str_replace("https://", "", $refererDomain);
            $refererDomain = str_replace("http://", "", $refererDomain);
            $refererDomain = str_replace("/", "\/", $refererDomain);

            return preg_match(CONF_REG["url"], $domain)
                && preg_match(CONF_REG["url"], $refererDomain)
                && preg_match("/^(" . $domain . ").*/i", $refererDomain);
        }

        return false;
    }

    static function AddAccessControlAllowOrigin($domain = "")
    {
        if (preg_match(CONF_REG["url"], $domain)) {
            $htaccess = file_get_contents(CONF_ACCESS["dir"]);
            if ($htaccess) {
                $headerEnd = 'Header add Access-Control-Allow-Origin "' . $domain . '"
</IfModule>';

                $htaccess = str_replace("</IfModule>", $headerEnd, $htaccess);

                return file_put_contents(CONF_ACCESS["dir"], $htaccess);
            }
        }

        return false;
    }

    static function RemoveAccessControlAllowOrigin($domain = "")
    {
        if (preg_match(CONF_REG["url"], $domain)) {
            $htaccess = file_get_contents(CONF_ACCESS["dir"]);
            if ($htaccess) {
                $htaccess = str_replace('Header add Access-Control-Allow-Origin "' . $domain . '"', "", $htaccess);
                return file_put_contents(CONF_ACCESS["dir"], $htaccess);
            }
        }

        return false;
    }

    static function UpdateAccessControlAllowOrigin($old_domain, $new_domain)
    {
        if (preg_match(CONF_REG["url"], $new_domain)) {
            if (preg_match(CONF_REG["url"], $old_domain)) {
                Server::RemoveAccessControlAllowOrigin($old_domain);
            }

            return Server::AddAccessControlAllowOrigin($new_domain);
        }

        return false;
    }
}
