<?php

namespace MODELS;

include_once "app/utils/util.php";

use APP\DATABASE\Database;

class RelativeMessage
{
    private static $relative_message;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$relative_message)) {
            self::$relative_message = new RelativeMessage();
        }
        return self::$relative_message;
    }

    static function Save($data)
    {
        return Database::Singleton()->query(self::Create($data), "INSERT");
    }

    static function Create($data)
    {
        $leave_date = isset($data["leave_date"]) ? "'{$data["leave_date"]}'" : 'NULL';

        return $sql = "INSERT INTO table_relative_message (
            id,
            status,
            someone_id,
            someone_type,
            relative_id,
            relative_type,
            count_not_seen,
            is_deleted,
            create_date,
            update_date,
            join_date,
            leave_date
        )
        VALUES (
            NULL,
            1,
            '{$data["someone_id"]}',
            '{$data["someone_type"]}',
            '{$data["relative_id"]}',
            '{$data["relative_type"]}',
            0,
            0,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            '{$data["join_date"]}',
            $leave_date
        )";
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_relative_message", $column, $value);
    }

    static function Type($type)
    {
        switch ($type) {
            case "member":
                return 0;
                break;
            case "chatinfo":
                return 1;
                break;
            case "customer":
                return 2;
                break;
            case "room":
                return 3;
                break;
            case "brand":
                return 4;
                break;
            default:
                break;
        }
    }

    static function Delete_Where($column, $value)
    {
        return Database::Singleton()->Delete_From_Where("table_relative_message", $column, $value);
    }

    static function Plus_Not_Seen($column, $value, $count = 1)
    {
        $table = "table_relative_message";
        $data = ["count_not_seen" => $count];

        $where = Database::Singleton()->String_Where($column, $value);
        $sql = "UPDATE `$table` SET ";
        $str_set = "";
        foreach ($data as $key => $v) {
            $str_set .= "`$key`= `$key` + $v,";
        }

        $sql .= substr($str_set, 0, -1) . " WHERE " . $where . ";";

        return Database::Singleton()->query($sql);
    }

    static function Update_Where($column, $value, $data)
    {
        return Database::Singleton()->Update_Form_Where("table_relative_message", $column, $value, $data);
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "count_not_seen" => $data["count_not_seen"]
        ] : null;
    }
}
