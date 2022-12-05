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

$loop = Loop::get();

$server = new SocketServer(CONF_SOCKET["host"], array(), $loop);

// https
// $secureServer = new SecureServer($server, $loop, [
//     "local_cert"  => "app/ssl/certificate.crt",
//     "local_pk" => "app/ssl/private.key",
//     "verify_peer" => false,
//     "allow_self_signed" => false
// ]);

// https
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
