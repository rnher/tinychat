<?php

namespace MODELS;

include_once "app/utils/util.php";

use APP\DATABASE\Database;

class Room
{
    private static $room;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$room)) {
            self::$room = new Member();
        }
        return self::$room;
    }

    static function Save($data)
    {
        return Database::Singleton()->query(self::Create($data), "INSERT");
    }

    static function Create($data)
    {
        return $sql = "INSERT INTO table_room (
            id,
            user_id,
            is_member,
            room_id,
            status,
            type,
            create_date,
            update_date
        )
        VALUES (
            NULL,
            '{$data["user_id"]}',
            '{$data["is_member"]}',
            '{$data["room_id"]}',
            1,
            '{$data["type"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";
    }

    static function Type($type)
    {
        switch ($type) {
            case "brand": // Chat tổng
                return 1;
                break;
            case "group": // Chat nhóm
                return 2;
                break;
            case "chatinfo": // Chat với khách hàng
                return 2;
                break;
            default:
                return 0;
                break;
        }
    }

    static function Delete_Where($column, $value)
    {
        return Database::Singleton()->Delete_From_Where("table_room", $column, $value);
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_room", $column, $value);
    }

    static function Is($type, $room_id, $user_id, $is_member = 1)
    {
        $room = Database::Singleton()->Find_From_Where(
            "table_room",
            ["room_id", "user_id", "type", "is_member"],
            [$room_id, $user_id, $type, $is_member]
        );

        if (isset($room)) {
            return $room;
        } else {
            return false;
        }
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "user_id" => $data["user_id"],
            "is_member" => $data["is_member"],
            "room_id" => $data["room_id"],
            "type" => $data["type"],
        ] : null;
    }

    static function Get_Default_Avatar()
    {
        return CONF_APP["defaults"]["room_avatar"];
    }
}
