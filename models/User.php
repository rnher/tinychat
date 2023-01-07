<?php

namespace MODELS;

include_once "app/utils/util.php";

use APP\DATABASE\Database;

class User
{
    private static $user;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$user)) {
            self::$user = new User();
        }
        return self::$user;
    }

    static function Save($data)
    {

        return Database::Singleton()->query(self::Create($data), "INSERT");
    }

    static function Create($data)
    {
        $data["password"] = password_hash($data["password"], PASSWORD_BCRYPT);

        return "INSERT INTO table_user (
            id,
            status,
            role,
            username,
            name,
            mail,
            password,
            avatar,
            is_active,
            create_date,
            update_date
            )
        VALUES (
            NULL,
            1,
            '{$data["role"]}',
            '{$data["username"]}',
            '{$data["name"]}',
            '{$data["mail"]}',
            '{$data["password"]}',
            '{$data["avatar"]}',
            0,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";
    }

    static function Find_Where($column, $value)
    {

        $user =  Database::Singleton()->Find_From_Where(
            "table_user",
            $column,
            $value
        );

        if ($user) {
            unset($user["password"]);
        }

        return $user;
    }

    static function Login($data)
    {
        $user = Database::Singleton()->Find_From_Where("table_user", "username",  $data["username"]);
        if (isset($user) && password_verify($data["password"], $user["password"])) {
            $user["password"] = null;

            return $user;
        }

        return false;
    }

    static function Update_Where($column, $value, $data)
    {
        if (isset($data["password"])) {
            $data["password"] = password_hash($data["password"], PASSWORD_BCRYPT);
        };

        return Database::Singleton()->Update_Form_Where("table_user", $column, $value, $data);
    }

    static function Get_Default_Avatar()
    {
        $index = random_int(1, CONF_APP["defaults"]["max_user_avatar"]);
        return str_replace(
            "[index]",
            $index,
            CONF_APP["defaults"]["user_avatar"]
        );
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "username" => $data["username"],
            "name" => $data["name"],
            "avatar" => CONF_HOST .  $data["avatar"],
            "mail" => $data["mail"],
        ] : null;
    }

    static function DetailInfo($data = null)
    {
        if (isset($data)) {
            $data["password"] = null;
            $data["avatar"] = CONF_HOST .  $data["avatar"];
        };

        return $data;
    }

    static function Create_Token($data)
    {
        return create_random_bytes(to_alias($data["username"]));
    }

    static function Role($role)
    {
        switch ($role) {
            case "admin": {
                    return "1";
                }
                break;
            case "user": {
                    return "0";
                }
                break;
            default: {
                }
                break;
        }
    }

    static function Count_Where($col, $column, $value)
    {
        return Database::Singleton()->Count_From_Where("table_user", $col, $column, $value);
    }


    static function Get_With_Page($pagination, $column, $value)
    {
        $users = Database::Singleton()->Get_Page_From_Where(
            "table_user",
            $pagination,
            $column,
            $value
        );

        return $users;
    }
}
