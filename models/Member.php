<?php

namespace MODELS;

use APP\DATABASE\Database;

class Member
{
    private static $member;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$member)) {
            self::$member = new Member();
        }
        return self::$member;
    }

    static function Save($data)
    {
        return Database::Singleton()->query(self::Create($data), "INSERT");
    }

    static function Create($data)
    {
        return $sql = "INSERT INTO table_member (
            id,
            brand_id,
            user_id,
            role,
            create_date,
            update_date
        )
        VALUES (
            NULL,
            '{$data["brand_id"]}',
            '{$data["user_id"]}',
            '{$data["role"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_member", $column, $value);
    }

}
