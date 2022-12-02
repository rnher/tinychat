<?php

namespace MODELS;

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
            username,
            name,
            password,
            avatar,
            create_date,
            update_date
            )
        VALUES (
            NULL,
            '{$data["username"]}',
            '{$data["name"]}',
            '{$data["password"]}',
            '{$data["avatar"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where(
            "table_user",
            $column,
            $value,
            "id, name, username, avatar"
        );
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
        return CONF_APP["defaults"]["user_avatar"];
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "username" => $data["username"],
            "name" => $data["name"],
            "avatar" => $data["avatar"],
        ] : null;
    }

    static function DetailInfo($data)
    {
        return isset($data) ? [
            "username" => $data["username"],
            "name" => $data["name"],
            "avatar" => $data["avatar"],
        ] : null;
    }

    static function Create_Token($data)
    {
        return create_random_bytes(to_alias($data["username"]));
    }
}
