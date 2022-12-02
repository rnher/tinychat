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


    static function Cookie($parameter, $value = null, $time = 0, $part = "")
    {
        if (isset($value)) {
            if ($parameter == "tinychat_ssid" || $parameter == "tinychat_client_ssid") {
                $value = base64_encode($value);
            }

            setrawcookie($parameter, $value, $time, $part);
            return $value;
        } else {
            $cookie =  isset($_COOKIE[$parameter]) ? $_COOKIE[$parameter] : null;
            if ($cookie && ($parameter == "tinychat_ssid" || $parameter == "tinychat_client_ssid")) {
                $cookie = base64_decode($cookie);
            }

            return  $cookie;
        }
    }

    static function GetURI()
    {
        return [
            "router" => CONF_ROUTERS[Server::MethodGet(router)],
            "id" => Server::MethodGet(id),
            "action" => Server::MethodGet(action),
            "token" => Server::MethodGet(token),
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

            $preg = "/^((https)|(http))(:\/\/)($domain)(.)*(\/)*([a-zA_Z0-9-]*)([\/a-zA_Z0-9-?_&=]*)$/i";

            return  !!preg_match($preg, $_SERVER["HTTP_REFERER"]);
        }


        return false;
    }
}
