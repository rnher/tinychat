<?php

namespace MODELS;

include_once "app/utils/util.php";

use APP\DATABASE\Database;

class Brand
{
    private static $brand;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$brand)) {
            self::$brand = new Brand();
        }
        return self::$brand;
    }

    static function Save($data)
    {

        return Database::Singleton()->query(self::Create($data), "INSERT");
    }

    static function Create($data)
    {
        $data["name_alias"] = to_alias($data["name"]);

        $domain = isset($data["domain"]) ? "'{$data["domain"]}'" : 'NULL';
        $token = isset($data["token"]) ? "'{$data["token"]}'" : 'NULL';
        $greeting = isset($data["greeting"]) ? "'{$data["greeting"]}'" : 'NULL';

        return "INSERT INTO table_brand (
            id,
            status,
            name,
            name_alias,
            description,
            greeting,
            create_date,
            update_date,
            avatar,
            banner,
            domain,
            token,
            expire
            )
        VALUES (
            NULL,
            1,
            '{$data["name"]}',
            '{$data["name_alias"]}',
            '{$data["description"]}',
            $greeting,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            '{$data["avatar"]}',
            '{$data["banner"]}',
            $domain,
            $token,
            '{$data["expire"]}'
        )";
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_brand", $column, $value);
    }

    static function Find_Not_Expired($column, $value)
    {
        $where = Database::Singleton()->String_Where($column, $value);
        $now_date = time();

        $sql = "SELECT * FROM `table_brand` WHERE " . $where . " AND `expire` > '$now_date';";

        return Database::Singleton()->query($sql);;
    }

    static function Count_Where($col, $column, $value)
    {
        return Database::Singleton()->Count_From_Where("table_brand", $col, $column, $value);
    }

    static function Count_All()
    {
        $sql = "SELECT COUNT(*) FROM table_brand;";
        return Database::Singleton()->query($sql);;
    }

    static function Get_With_Page($pagination, $column, $value)
    {
        $brands = Database::Singleton()->Get_Page_From_Where(
            "table_brand",
            $pagination,
            $column,
            $value
        );

        return $brands;
    }

    static function Update_Where($column, $value, $data)
    {
        return Database::Singleton()->Update_Form_Where("table_brand", $column, $value, $data);
    }

    static function Create_Date_Next($type, $time = 0)
    {
        $timestamp  = 0;
        $time_zone = 6; // FIXME:

        switch ($type) {
            case 's': {
                    $timestamp = mktime(date("h") + $time_zone, date("i"), date("s") + $time, date("m"), date("d"),   date("Y"));
                }
                break;
            case 'i': {
                    $timestamp = mktime(date("h") + $time_zone, date("i") + $time, date("s"), date("m"), date("d"),   date("Y"));
                }
                break;
            case 'h': {
                    $timestamp = mktime(date("h") + $time_zone + $time,  date("i"), date("s"), date("m"), date("d"),   date("Y"));
                }
                break;
            case 'm': {
                    $timestamp = mktime(date("h") + $time_zone, date("i"), date("s"), date("m") + $time, date("d"),   date("Y"));
                }
                break;
            case 'd': {
                    $timestamp = mktime(date("h") + $time_zone, date("i"), date("s"), date("m"), date("d") + $time,   date("Y"));
                }
                break;
            case 'y': {
                    $timestamp = mktime(date("h") + $time_zone, date("i"), date("s"), date("m"), date("d"),   date("Y") + $time);
                }
                break;
            default: {
                    $timestamp = mktime(date("h"), date("i"), date("s"), date("m"), date("d"),   date("Y"));
                }
                break;
        }

        return date('Y-m-d H:i:s', $timestamp);
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "id" => $data["id"],
            "name" => $data["name"],
            "avatar" => CONF_HOST .  $data["avatar"],
            "banner" => CONF_HOST .  $data["banner"],
            "description" => $data["description"],
            "greeting" => $data["greeting"],
            "status" => $data["status"],
        ] : null;
    }

    static function DetailInfo($data = null)
    {
        if (isset($data)) {
            if (isset($data["domain"])) {
                $data["token"] = Brand::Get_Script_Token($data["token"]);
            }
            $data["avatar"] = CONF_HOST .  $data["avatar"];
            $data["banner"] = CONF_HOST .  $data["banner"];
        }

        return $data;
    }

    static function Get_Default_Avatar()
    {
        return CONF_APP["defaults"]["brand_avatar"];
    }

    static function Get_Default_Banner()
    {
        return CONF_APP["defaults"]["brand_banner"];
    }

    static function Get_Script_Token($token)
    {
        return '<script id="client-tiny-chat-script" type="module" src="' . CONF_HOST . '/client/public/js/main.js" data-id="' . $token . '"></script>';
    }

    static function Create_Token($prefix)
    {
        return create_random_bytes(to_alias($prefix));
    }

    static function Delete_Where($column, $value)
    {
        return Database::Singleton()->Delete_From_Where("table_brand", $column, $value);
    }

    static function Get_Data($raw_data)
    {
        $data = [];
        foreach ($raw_data as $raw_col => $raw_value) {
            if (self::check_exist_data($raw_col)) {
                if ($raw_col == "name") {
                    $data["name_alias"] = to_alias($raw_value);
                }

                $data[$raw_col] = $raw_value;
            }
        };

        return count($data) ? $data : null;
    }

    static function check_exist_data($raw_col)
    {
        $is_check = false;
        switch ($raw_col) {
            case "name":
            case "description":
            case "greeting":
            case "avatar":
            case "banner":
            case "domain":
            case "token": {
                    $is_check = true;
                }
                break;
            default: {
                }
                break;
        }

        return $is_check;
    }
}
