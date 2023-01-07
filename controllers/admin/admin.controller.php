<?php
include_once "app/App.php";
include_once "app/libraries/Auth.php";
include_once "models/User.php";
include_once "models/Brand.php";

use APP\App;
use APP\LIBRARIES\Auth;
use MODELS\Member;
use MODELS\User;
use MODELS\Brand;

$views = function () {
    $response = [
        "data" => null,
        "error" => [],
        "isError" => false
    ];

    $admin = Auth::Admin();
    if (isset($admin)) {
        $per_page  = CONF_PAGINATION["usermembers"];
        $total = Member::Count_Where("id", "role", Member::Role("admin"));
        $page_url = CONF_URL["usermembers"] . "?";
        $response["data"] = initPaginationMeta($page_url, $total, $per_page);
        $members = Member::Get_With_Page($response["data"], "role", Member::Role("admin"));

        if (isset($members)) {
            if (!isset($members[0])) {
                $members = [$members];
            }
        } else {
            $members = [];
        }

        $itmes = [];
        foreach ($members as $member) {
            $data = Member::Find_With_Rerelative_Brand_User($member["brand_id"]);
            $itmes[] =  $data;
        }

        $response["data"]["items"] =  $itmes;
        $response["data"]["admin_member_count"] = $total["count"];
        $response["data"]["brand_count"] = Brand::Count_All()["COUNT(*)"];
    } else {
        $response["isError"] = true;
        $response["error"]["is"] = "Thao tác bị từ chối";
    }

    return App::responseJson($response);
};

return [
    "views" => $views,
];
