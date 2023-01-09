<?php

namespace APP;

include_once "Server.php";
include_once "app/Config.php";
include_once "app/database/Database.php";

use APP\Config;
use APP\Server;
use APP\DATABASE\Database;

class App extends Server
{
    private static $app;
    private $config;

    protected function  __construct()
    {
        parent::__construct();
    }

    static function Singleton()
    {
        if (!isset(self::$app)) {
            self::$app = new App();
        }
        return self::$app;
    }

    function start()
    {
        // When installed via composer
        require_once 'vendor/autoload.php';

        Config::Init();

        Database::Singleton()->init();
        // STEP: RUN  SEED DATABASE
        Database::Singleton()->runMigrates();
        // Database::Singleton()->runSeeds(); 

        $this->config = CONF_APP;

        include_once "routers/app.router.php";
    }

    function getConfig()
    {
        return $this->config;
    }

    static function responseJson($data)
    {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}
