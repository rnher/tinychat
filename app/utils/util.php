<?php

use APP\App;

function to_latin($str)
{
    $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", 'a', $str);
    $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", 'e', $str);
    $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", 'i', $str);
    $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", 'o', $str);
    $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", 'u', $str);
    $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", 'y', $str);
    $str = preg_replace("/(đ)/", 'd', $str);
    $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", 'A', $str);
    $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", 'E', $str);
    $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", 'I', $str);
    $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", 'O', $str);
    $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", 'U', $str);
    $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", 'Y', $str);
    $str = preg_replace("/(Đ)/", 'D', $str);

    return $str;
}

function to_alias($str)
{
    return str_replace(" ", "-",  strtolower(to_latin(($str))));
}

function create_random_bytes($byte = 20)
{
    return bin2hex(random_bytes($byte)) . uniqid();
}

function to_format_monney($str)
{
    $regex = "/\B(?=(\d{3})+(?!\d))/i";
    return preg_replace($regex, ",", $str);
}

function initPaginationMeta($page_url, $total, $per_page, $default_order_by = "create_date", $default_sort = "DESC")
{
    $order_by = App::MethodGet("order_by") ? App::MethodGet("order_by") : $default_order_by;
    $sort =  App::MethodGet("sort") ? App::MethodGet("sort") : $default_sort;
    $current_page = App::MethodGet("page") ? intval(App::MethodGet("page")) : 1;
    $total = intval($total["count"]);
    $last_page = ceil($total / $per_page);
    $page_url = $page_url
        . (App::MethodGet("id") ?  ("id=" . App::MethodGet("id") . "&") : "")
        . "order_by=$order_by&sort=$sort&page=";

    return [
        "per_page" => $per_page,
        "total" => $total,
        "current_page" =>  $current_page,
        "last_page" => $last_page,
        "page_url" => CONF_HOST . $page_url,
        "first_page_url" => CONF_HOST . $page_url . 1,
        "last_page_url" => CONF_HOST .  $page_url . $last_page,
        "next_page_url" => $current_page == $last_page ? null : (CONF_HOST . $page_url . $current_page + 1),
        "prev_page_url" =>   $current_page == 1 ? null : (CONF_HOST . $page_url . $current_page - 1),
        "from" => $per_page * $current_page - $per_page,
        "to" => $per_page * $current_page,
        "sort" => $sort,
        "order_by" => $order_by,
        "items" => []
    ];
}

function get_time()
{
    return intval(strtotime('now')) * 1000;
}

function validate($typeNames, $typePatterns, $typeError, $typeRequiredNames = [])
{
    $data = [];
    $error = [];

    foreach ($typeNames as $name) {
        $data[$name] = App::MethodPost($name);

        if (
            isset($typeRequiredNames[$name])
            && is_null($data[$name])
        ) {
            $error[$name] = $typeError[$name];
        }

        if (isset($data[$name])) {
            if (
                isset($typePatterns[$name])
                ? !preg_match($typePatterns[$name], $data[$name])
                : false
            ) {
                $error[$name] = $typeError[$name];
            }
        }
    }

    return [
        "data" => $data,
        "error" => $error,
        "isError" => count($error) !== 0
    ];
}