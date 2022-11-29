<?php

include_once "app/App.php";
include_once "app/services/Auth.php";
include_once "models/User.php";
include_once "models/Brand.php";

use APP\App;
use MODELS\Brand;
use APP\SERVICES\Auth;

$view = function () {
    $user = Auth::User();
    if (isset($user)) {
        $member = Auth::Member();

        if (isset($member)) {
            $brand = Brand::Find_Where("id", $member["brand_id"]);
        }

        include_once "views/dasboard.layout.view.php";
    } else {
        include_once "views/home.layout.view.php";
    }
};

return [
    "view" => $view,
];
