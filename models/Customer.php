<?php

namespace MODELS;

include_once "app/utils/util.php";

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
        $phone = isset($data["phone"]) ? "'{$data["phone"]}'" : 'NULL';
        $mail = isset($data["mail"]) ? "'{$data["mail"]}'" : 'NULL';

        return "INSERT INTO table_customer (
            id,
            brand_id,
            status,
            token,
            name,
            avatar,
            is_active,
            create_date,
            update_date,
            phone,
            mail
            )
        VALUES (
            NULL,
            '{$data["brand_id"]}',
            '{$data["status"]}',
            '{$data["token"]}',
            '{$data["name"]}',
            '{$data["avatar"]}',
            '{$data["is_active"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            $phone,
            $mail
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
        $index = random_int(1, CONF_APP["defaults"]["max_customer_avatar"]);
        return str_replace(
            "[index]",
            $index,
            CONF_APP["defaults"]["customer_avatar"]
        );
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "name" => $data["name"],
            "avatar" => $data["avatar"],
            "phone" => $data["phone"],
            "mail" => $data["mail"],
            "create_date" => $data["create_date"],
            "is_active" => $data["is_active"],
        ] : null;
    }

    static function Create_Token($name, $refix)
    {
        return create_random_bytes(to_alias($name) . to_alias($refix));
    }

    static function Delete_Where($column, $value)
    {
        return Database::Singleton()->Delete_From_Where("table_customer", $column, $value);
    }
}
