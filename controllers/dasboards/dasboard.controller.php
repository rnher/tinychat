<?php

include_once "app/libraries/Auth.php";

use APP\LIBRARIES\Auth;

$view = function () {
    $user = Auth::User();
    $head_html = [
        "title" => CONF_APP["name"],
        "description" => CONF_APP["description"],
        "keywords" => CONF_APP["keywords"],
        "icon" => CONF_APP["icon"],
        "manifest" => CONF_APP["manifest"],
    ];

    if (isset($user)) {
        include_once "views/dasboard.layout.view.php";
    } else {
        include_once "views/home.layout.view.php";
    }
};

return [
    "view" => $view,
];
