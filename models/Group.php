<?php

namespace MODELS;

include_once "app/utils/util.php";

use APP\DATABASE\Database;

class Group
{
    private static $group;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$group)) {
            self::$group = new Group();
        }
        return self::$group;
    }

    static function Save($data)
    {

        return Database::Singleton()->query(self::Create($data), "INSERT");
    }

    static function Create_Token($prefix)
    {
        return create_random_bytes(to_alias($prefix));
    }

    static function Create($data)
    {

        $data["name"] = isset($data["name"]) ? $data["name"] : self::Create_Token(create_random_bytes());
        $data["name_alias"] = to_alias($data["name"]);

        return "INSERT INTO table_group (
            id,
            status,
            name,
            name_alias,
            create_date,
            update_date
            )
        VALUES (
            NULL,
            1,
            '{$data["name"]}',
            '{$data["name_alias"]}',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_group", $column, $value);
    }

    static function Count_Where($col, $column, $value)
    {
        return Database::Singleton()->Count_From_Where("table_group", $col, $column, $value);
    }

    static function Get_With_Page($pagination, $column, $value)
    {
        $groups = Database::Singleton()->Get_Page_From_Where(
            "table_group",
            $pagination,
            $column,
            $value
        );

        return $groups;
    }

    static function Update_Where($column, $value, $data)
    {
        return Database::Singleton()->Update_Form_Where("table_group", $column, $value, $data);
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "name_alias" => $data["name_alias"],
            "name" => $data["name"]
        ] : null;
    }
}
