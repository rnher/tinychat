<?php

namespace APP\LIBRARIES;

class Logger
{
    private static $logger;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$logger)) {
            self::$logger = new Logger();
        }
        return self::$logger;
    }

    static function dir($type)
    {
        $CONF_LOG = CONF_LOG;

        $dir = $CONF_LOG[$type]["dir"] . $CONF_LOG[$type]["file_name"];

        return $dir;
    }

    static function AddSocketLog($msg)
    {
        $log = date("m/d/Y h:i:s a") . PHP_EOL
            . $msg . PHP_EOL
            . "=================================================" . PHP_EOL;

        $file_dir = self::dir("socket");
        $file = fopen($file_dir, "a");
        fwrite($file, $log);
        fclose($file);
    }
}
