<?php

namespace MODELS;

include_once "app/utils/util.php";

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
        $greeting = isset($data["greeting"]) ? "'{$data["greeting"]}'" : 'NULL';

        return $sql = "INSERT INTO table_member (
            id,
            user_id,
            brand_id,
            status,
            role,
            token,
            create_date,
            update_date,
            greeting
        )
        VALUES (
            NULL,
            '{$data["user_id"]}',
            '{$data["brand_id"]}',
            '{$data["status"]}',
            '{$data["role"]}',
            '{$data["token"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            $greeting
        )";
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_member", $column, $value);
    }

    static function Create_Token($prefix)
    {
        return create_random_bytes(to_alias($prefix));
    }

    static function Role($type)
    {
        switch ($type) {
            case "admin":
                return 1;
                break;
            case "member":
                return 2;
                break;
            default:
                return 0;
                break;
        }
    }

    static function Status($status = null)
    {
        switch ($status) {
            case "active":
                return 1;
                break;
            case "not_active":
                return -1;
                break;
            case "pendding":
                return 0;
                break;
            default:
                return 1;
                break;
        }
    }

    static function Delete_Where($column, $value)
    {
        return Database::Singleton()->Delete_From_Where("table_member", $column, $value);
    }

    static function Update_Where($column, $value, $data)
    {
        return Database::Singleton()->Update_Form_Where("table_member", $column, $value, $data);
    }

    static function Find_With_Rerelative_Brand($brand_id)
    {
        $sql = "SELECT
        member.id AS id, 
        member.brand_id AS brand_id,
        member.status AS status,
        member.role AS role,
        member.greeting AS greeting,
        member.create_date AS create_date,
        user.name AS name,
        user.avatar AS avatar,
        user.mail AS mail

        FROM 
        table_member AS member 

        RIGHT JOIN 
        table_user AS user

        ON 
        member.user_id = user.id 

        WHERE 
        member.brand_id = '$brand_id' 
        ;
        ";

        return Database::Singleton()->query($sql);
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "id" => $data["id"],
            "user_id" => $data["user_id"],
            "brand_id" => $data["brand_id"],
            "status" => $data["status"],
            "token" => $data["token"],
            "role" => $data["role"],
            "greeting" => $data["greeting"]
        ] : null;
    }

    static function Find_With_Rerelative_Brand_User($brand_id)
    {
        $sql = "SELECT
        member.id AS member_id, 
        member.brand_id AS brand_id,
        member.user_id AS user_id,
        user.name AS user_name,
        user.avatar AS user_avatar,
        user.mail AS user_mail,
        brand.avatar AS brand_avatar,
        brand.domain AS brand_domain,
        brand.expire AS brand_expire,
        brand.status AS brand_status,
        brand.create_date AS brand_create_date

        FROM 
        table_member AS member 

        RIGHT JOIN 
        table_user AS user

        ON 
        member.user_id = user.id 

        RIGHT JOIN 
        table_brand AS brand

        ON 
        member.brand_id = brand.id 

        WHERE 
        member.brand_id = '$brand_id' 
        ;
        ";

        return Database::Singleton()->query($sql);
    }

    static function Count_Where($col, $column, $value)
    {
        return Database::Singleton()->Count_From_Where("table_member", $col, $column, $value);
    }

    static function Get_With_Page($pagination, $column, $value)
    {
        $brands = Database::Singleton()->Get_Page_From_Where(
            "table_member",
            $pagination,
            $column,
            $value
        );

        return $brands;
    }
}
