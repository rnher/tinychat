<?php

namespace MODELS;

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
        $name_alias = to_alias($data["name"]);
        $domain = isset($data["domain"]) ? '{$data["domain"]}' : 'NULL';
        $token = isset($data["token"]) ? '{$data["token"]}' : 'NULL';

        return "INSERT INTO table_brand (
            id,
            name,
            name_alias,
            avatar,
            domain,
            token,
            description,
            expired,
            create_date,
            update_date
            )
        VALUES (
            NULL,
            '{$data["name"]}',
            '$name_alias',
            '{$data["avatar"]}',
            $domain,
            $token,
            '{$data["description"]}',
            '{$data["expired"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
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

        $sql = "SELECT * FROM `table_brand` WHERE " . $where . " AND `expired` > '$now_date';";

        return Database::Singleton()->query($sql);;
    }

    static function Count_Where($col, $column, $value)
    {
        return Database::Singleton()->Count_From_Where("table_brand", $col, $column, $value);
    }

    static function Get_With_Page($pagination, $column, $value)
    {
        $chatinfos = Database::Singleton()->Get_Page_From_Where(
            "table_brand",
            $pagination,
            $column,
            $value
        );

        return $chatinfos;
    }

    static function Update_Where($column, $value, $data)
    {
        return Database::Singleton()->Update_Form_Where("table_brand", $column, $value, $data);
    }

    static function Create_Date_Next($type, $date = 0)
    {
        $timestamp  = 0;
        switch ($type) {
            case 'i': {
                    $timestamp = mktime(0 + $date, 0, 0, date("m"), date("d"),   date("Y"));
                }
                break;
            case 'h': {
                    $timestamp = mktime(0 + $date, 0, 0, date("m"), date("d"),   date("Y"));
                }
                break;
            case 'm': {
                    $timestamp = mktime(0, 0, 0, date("m") + $date, date("d"),   date("Y"));
                }
                break;
            case 'd': {
                    $timestamp = mktime(0, 0, 0, date("m"), date("d") + $date,   date("Y"));
                }
                break;
            case 'y': {
                    $timestamp = mktime(0, 0, 0, date("m"), date("d"),   date("Y") + $date);
                }
                break;
            default: {
                    $timestamp = mktime(0, 0, 0, date("m"), date("d"),   date("Y"));
                }
                break;
        }

        return date('Y-m-d H:i:s', $timestamp);
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "name" => $data["name"],
            "avatar" => $data["avatar"],
            "description" => $data["description"],
        ] : null;
    }

    static function DetailInfo($data)
    {
        return isset($data) ? [
            "name" => $data["name"],
            "avatar" => $data["avatar"],
            "name_alias" => $data["name_alias"],
            "description" => $data["description"],
            "domain" => $data["domain"],
            "expired" => $data["expired"],
            "token" => Brand::Get_Script_Token($data["token"]),
        ] : null;
    }

    static function Get_Default_Avatar()
    {
        return CONF_APP["defaults"]["brand_avatar"];
    }

    static function Get_Script_Token($token)
    {
        return '<script id="client-tiny-chat-script" type="module" src="' . CONF_HOST . '/client/public/js/main.js" data-id="' . $token . '"></script>';
    }

    static function Create_Token($prefix)
    {
        return create_random_bytes(to_alias($prefix));
    }
}
