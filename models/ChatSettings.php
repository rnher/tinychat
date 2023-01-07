<?php

namespace MODELS;

include_once "app/utils/util.php";

use APP\DATABASE\Database;

class ChatSettings
{
    private static $chat_settins;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$chat_settins)) {
            self::$chat_settins = new ChatSettings();
        }
        return self::$chat_settins;
    }

    static function Save($data)
    {

        return Database::Singleton()->query(self::Create($data), "INSERT");
    }

    static function Create($data)
    {
        return "INSERT INTO table_chat_settings (
            id,
            status,
            brand_id,
            brand_name_color,
            brand_text_color,
            brand_chat_color,
            brand_chat_bg,
            client_chat_color,
            client_chat_bg,
            main_bg,
            main_color,
            main_text,
            main_icon,
            chat_bg,
            is_require_mail,
            is_require_phone,
            create_date,
            update_date
            )
        VALUES (
            NULL,
            1,
            '{$data["brand_id"]}',
            '{$data["brand_name_color"]}',
            '{$data["brand_text_color"]}',
            '{$data["brand_chat_color"]}',
            '{$data["brand_chat_bg"]}',
            '{$data["client_chat_color"]}',
            '{$data["client_chat_bg"]}',
            '{$data["main_bg"]}',
            '{$data["main_color"]}',
            '{$data["main_text"]}',
            '{$data["main_icon"]}',
            '{$data["chat_bg"]}',
            '{$data["is_require_mail"]}',
            '{$data["is_require_phone"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_chat_settings", $column, $value);
    }

    static function Update_Where($column, $value, $data)
    {
        return Database::Singleton()->Update_Form_Where("table_chat_settings", $column, $value, $data);
    }

    static function Delete_Where($column, $value)
    {
        return Database::Singleton()->Delete_From_Where("table_chat_settings", $column, $value);
    }

    // static function ShortcutInfo($data)
    // {
    //     return isset($data) ? [] : null;
    // }

    static function DetailInfo($data = null)
    {
        if (isset($data)) {
        }

        return $data;
    }

    static function Get_Default($brand_id = "")
    {
        return [
            "brand_id" => $brand_id,
            "brand_name_color" => "#ffffff",
            "brand_text_color" => "#ffffff",
            "brand_chat_color" => "#000000",
            "brand_chat_bg" => "#f6faff",
            "client_chat_color" => "#ffffff",
            "client_chat_bg" => "#4b88d8",
            "main_bg" => "#1877f2",
            "main_color" => "#ffffff",
            "main_text" => "Chat",
            "main_icon" => "<i class=\"fa-solid fa-message\"></i>",
            "chat_bg" => "#f5f8fd",
            "is_require_mail" => 1,
            "is_require_phone" => 1,
        ];
    }

    static function Get_Data($raw_data)
    {
        $check_exist_data =  function ($raw_data, $raw_col) {
            $is_check = false;
            switch ($raw_col) {
                case "is_require_mail":
                case "is_require_phone":
                case "brand_name_color":
                case "brand_text_color":
                case "brand_chat_color":
                case "brand_chat_bg":
                case "client_chat_color":
                case "client_chat_bg":
                case "main_color":
                case "main_bg":
                    // TODO
                    // case "main_text": {
                    // }
                    // break;
                    // case "main_icon": {
                    // }
                    // break;
                case "chat_bg": {
                        $is_check = true;
                    }
                    break;
                default: {
                    }
                    break;
            }

            return $is_check;
        };

        $data = [];
        foreach ($raw_data as $raw_col => $raw_value) {
            if (self::check_exist_data($raw_col)) {
                $data[$raw_col] = $raw_value;
            }
        };

        return count($data) ? $data : null;
    }


    static function check_exist_data($raw_col)
    {
        $is_check = false;
        switch ($raw_col) {
            case "is_require_mail":
            case "is_require_phone":
            case "brand_name_color":
            case "brand_text_color":
            case "brand_chat_color":
            case "brand_chat_bg":
            case "client_chat_color":
            case "client_chat_bg":
            case "main_color":
            case "main_bg":
                // TODO
                // case "main_text": {
                // }
                // break;
                // case "main_icon": {
                // }
                // break;
            case "chat_bg": {
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
