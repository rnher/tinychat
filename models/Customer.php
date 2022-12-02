<?php

namespace MODELS;

use APP\DATABASE\Database;

class Customer
{
    private static $customer;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$customer)) {
            self::$customer = new Customer();
        }
        return self::$customer;
    }

    static function Save($data)
    {
        return Database::Singleton()->query(self::Create($data), "INSERT");
    }

    static function Create($data)
    {
        return "INSERT INTO table_customer (
            id,
            token,
            brand_id,
            name,
            phone,
            is_active,
            avatar,
            create_date,
            update_date
            )
        VALUES (
            NULL,
            '{$data["token"]}',
            '{$data["brand_id"]}',
            '{$data["name"]}',
            '{$data["phone"]}',
            '{$data["is_active"]}',
            '{$data["avatar"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_customer", $column, $value);
    }

    static function Find_With_Rerelative_ChatInfo($value)
    {
        $sql = "SELECT
        customer.id AS id, 
        chatinfo.id AS chatinfo_id,
        chatinfo.brand_id AS brand_id

        FROM 
        table_customer AS customer 

        RIGHT JOIN 
        table_chat_info AS chatinfo

        ON 
        customer.id = chatinfo.customer_id 

        WHERE 
        customer.brand_id = '$value' 
        ;
        ";

        return Database::Singleton()->query($sql);
    }

    static function Get_Default_Avatar()
    {
        return CONF_APP["defaults"]["customer_avatar"];
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "name" => $data["name"],
            "avatar" => $data["avatar"],
            "phone" => $data["phone"],
            "is_active" => $data["is_active"],
        ] : null;
    }

    static function Create_Token($data)
    {
        return create_random_bytes(to_alias($data["name"]) . to_alias($data["phone"]));
    }
}
