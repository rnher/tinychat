<?php

namespace MODELS;

use APP\DATABASE\Database;

class Message
{
    private static $message;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$message)) {
            self::$message = new Message();
        }
        return self::$message;
    }

    static function Save($data)
    {

        return Database::Singleton()->query(self::Create($data), "INSERT");
    }

    static function Create($data)
    {

        return "INSERT INTO table_message (
            id,
            chatinfo_id,
            sender_id,
            is_brand,
            type,
            content,
            is_seen_member,
            is_seen_customer,
            create_date,
            update_date
            )
        VALUES (
            NULL,
            '{$data["chatinfo_id"]}',
            '{$data["sender_id"]}',
            '{$data["is_brand"]}',
            '{$data["type"]}',
            '{$data["content"]}',
            '{$data["is_seen_member"]}',
            '{$data["is_seen_customer"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";
    }

    static function Count_Where($col, $column, $value)
    {
        return Database::Singleton()->Count_From_Where("table_message", $col, $column, $value);
    }

    static function Get_With_Page($pagination, $column, $value)
    {
        $messages = Database::Singleton()->Get_Page_From_Where(
            "table_message",
            $pagination,
            $column,
            $value
        );

        return $messages;
    }

    static function Update_Where($column, $value, $data)
    {
        return Database::Singleton()->Update_Form_Where("table_message", $column, $value, $data);
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_message", $column, $value);
    }
}
