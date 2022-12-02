<?php

namespace MODELS;

use APP\DATABASE\Database;

class ChatInfo
{
    private static $chat_info;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$chat_info)) {
            self::$chat_info = new ChatInfo();
        }
        return self::$chat_info;
    }

    static function Save($data)
    {

        return Database::Singleton()->query(self::Create($data), "INSERT");
    }

    static function Create($data)
    {

        return "INSERT INTO table_chat_info (
            id,
            brand_id,
            customer_id,
            is_seen_member,
            is_seen_customer,
            create_date,
            update_date
            )
        VALUES (
            NULL,
            '{$data["brand_id"]}',
            '{$data["customer_id"]}',
            '{$data["is_seen_member"]}',
            '{$data["is_seen_customer"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";
    }

    static function Count_Where($col, $column, $value)
    {
        return Database::Singleton()->Count_From_Where("table_chat_info", $col, $column, $value);
    }

    static function Get_With_Page($pagination, $column, $value)
    {
        $chatinfos = Database::Singleton()->Get_Page_From_Where(
            "table_chat_info",
            $pagination,
            $column,
            $value
        );

        return $chatinfos;
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_chat_info", $column, $value);
    }

    static function Update_Where($column, $value, $data)
    {
        return Database::Singleton()->Update_Form_Where("table_chat_info", $column, $value, $data);
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "id" => $data["id"],
            "brand_id" => $data["brand_id"],
            "customer_id" => $data["customer_id"],
            "is_seen_member" => $data["is_seen_member"],
            "is_seen_customer" => $data["is_seen_customer"],
        ] : null;
    }

}
