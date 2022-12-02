<?php

// include_once "vendor/autoload.php";
// include_once "app/services/Chat.php";
// include_once "app/Config.php";

// use APP\Config;
// use APP\SERVICES\Chat;

// Config::Init();

// use Ratchet\Http\HttpServer;
// use Ratchet\Server\IoServer;
// use Ratchet\WebSocket\WsServer;
// use React\Socket\LimitingServer;
// use React\Socket\SocketServer;
// use React\EventLoop\Loop;
// use React\Socket\SecureServer;

// $loop = Loop::get();

// $server = new SocketServer("0.0.0.0:" . CONF_SOCKET["port"], array(), $loop);

// $secureServer = new SecureServer($server, $loop, [
//     "local_cert"  =>  "/app/ssl/certificate.crt",
//     "local_pk" => "/app/ssl/private.key",
//     "verify_peer" => false,
// ]);

// $secureServer
// $limitingServer = new LimitingServer($server, CONF_SOCKET["max_connect"]);

// $httpServer = new HttpServer(
//     new WsServer(
//         Chat::Singleton()
//     )
// );

// $ioServer = new IoServer($httpServer, $limitingServer, $loop);

// $ioServer->run();


// CRON
// /usr/bin/wget -O /dev/null https://designweb.vn/socket.php

include_once "vendor/autoload.php";
include_once "app/services/Chat.php";
include_once "app/Config.php";

use APP\Config;
use APP\SERVICES\Chat;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

Config::Init();

$server =  new HttpServer(
    new WsServer(
        Chat::Singleton()
    )
);

$io = IoServer::factory(
    $server,
    CONF_SOCKET["port"]
);

$io->run();


// require "vendor/autoload.php";
// require "app/services/Chat.php";
// include_once "app/Config.php";


// use APP\Config;
// use APP\SERVICES\Chat;

// Config::Init();

// use Ratchet\Http\HttpServer;
// use Ratchet\Server\IoServer;
// use Ratchet\WebSocket\WsServer;
// use React\Socket\LimitingServer;
// use React\Socket\SocketServer;
// use React\EventLoop\Loop;
// use React\Socket\SecureServer;

// $loop = Loop::get();

// $server = new SocketServer("0.0.0.0:8080");

// // $secureServer = new SecureServer($server, $loop, [
// //     "local_cert"  =>  "/app/ssl/certificate.crt",
// //     "local_pk" => "/app/ssl/private.key",
// //     "verify_peer" => false,
// // ]);

// // $secureServer
// $limitingServer = new LimitingServer($server, CONF_SOCKET["max_connect"]);

// $httpServer = new HttpServer(
//     new WsServer(
//         Chat::Singleton()
//     )
// );

// $ioServer = new IoServer($httpServer, $limitingServer, $loop);


// $ioServer->run();


// // CRON
// // /usr/bin/wget -O /dev/null https://designweb.vn/socket.php