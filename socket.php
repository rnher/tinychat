<?php

// When installed via composer
include_once "vendor/autoload.php";
include_once "app/services/Chat.php";
include_once "app/Config.php";

use APP\Config;
use APP\SERVICES\Chat;

Config::Init();

use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use React\Socket\LimitingServer;
use React\Socket\SocketServer;
use React\EventLoop\Loop;
use React\Socket\SecureServer;

session_start();

$loop = Loop::get();

$server = new SocketServer(CONF_SOCKET["host"], array(), $loop);

// https
// $secureServer = new SecureServer($server, $loop, CONF_APP["ssl"]);

// https
// http://socketo.me/docs/deploy
// $limitingServer = new LimitingServer($secureServer, CONF_SOCKET["max_connect"]);
// http
$limitingServer = new LimitingServer($server, CONF_SOCKET["max_connect"]);

$httpServer = new HttpServer(
    new WsServer(
        Chat::Singleton()
    )
);

$ioServer = new IoServer($httpServer, $limitingServer, $loop);

$ioServer->run();
