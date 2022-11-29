<?php

namespace MODELS;

include_once "app/database/Database.php";

use APP\DATABASE\Database;

class Session
{
    private static $sesion;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$sesion)) {
            self::$sesion = new Session();
        }
        return self::$sesion;
    }

    static function Save($data)
    {
        $sql = "INSERT INTO table_session (
            id,
            token,
            user_id,
            is_login,
            expire,
            create_date,
            update_date
        )
        VALUES (
            NULL,
            '{$data["token"]}',
            '{$data["user_id"]}',
            '{$data["is_login"]}',
            '{$data["expire"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";

        return Database::Singleton()->query($sql, "INSERT");
    }

    static function Update_Where($column, $value, $data)
    {
        return Database::Singleton()->Update_Form_Where("table_session", $column, $value, $data);
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_session", $column, $value);
    }
}
