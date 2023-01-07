<?php

namespace APP\LIBRARIES;

class RSA
{
    private static $rsa;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$rsa)) {
            self::$rsa = new rsa();
        }
        return self::$rsa;
    }

    static function Create_Key()
    {
        $private_key = openssl_pkey_new(CONF_APP["openssl"]);

        openssl_pkey_export($private_key, $private_key_pem);
        $public_key_pem = openssl_pkey_get_details($private_key)["key"];

        return [
            "private_key" => $private_key_pem,
            "public_key" => $public_key_pem
        ];
    }
}
