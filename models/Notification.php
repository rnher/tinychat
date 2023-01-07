<?php

namespace MODELS;

include_once "app/utils/util.php";

use APP\DATABASE\Database;

class Notification
{
    private static $noti;

    protected function  __construct()
    {
    }

    static function Singleton()
    {
        if (!isset(self::$noti)) {
            self::$noti = new Notification();
        }
        return self::$noti;
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
        $is_result = isset($data["is_result"]) ? "'{$data["is_result"]}'" : 'NULL';

        return "INSERT INTO table_notification (
            id,
            status,
            type,
            action,
            content_code,
            target_id,
            target_name,
            target_avatar,
            sender_id,
            sender_name,
            sender_avatar,
            receiver_id,
            is_seen,
            is_response,
            is_result,
            create_date,
            update_date
            )
        VALUES (
            NULL,
            1,
            '{$data["type"]}',
            '{$data["action"]}',
            '{$data["content_code"]}',
            '{$data["target_id"]}',
            '{$data["target_name"]}',
            '{$data["target_avatar"]}',
            '{$data["sender_id"]}',
            '{$data["sender_name"]}',
            '{$data["sender_avatar"]}',
            '{$data["receiver_id"]}',
            0,
            0,
            $is_result,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )";
    }

    static function Find_Where($column, $value)
    {
        return Database::Singleton()->Find_From_Where("table_notification", $column, $value);
    }

    static function Count_Where($col, $column, $value)
    {
        return Database::Singleton()->Count_From_Where("table_notification", $col, $column, $value);
    }

    static function Get_With_Page($pagination, $column, $value)
    {
        $notifications = Database::Singleton()->Get_Page_From_Where(
            "table_notification",
            $pagination,
            $column,
            $value
        );

        return $notifications;
    }

    static function Update_Where($column, $value, $data)
    {
        return Database::Singleton()->Update_Form_Where("table_notification", $column, $value, $data);
    }

    static function Delete_Where($column, $value)
    {
        return Database::Singleton()->Delete_From_Where("table_notification", $column, $value);
    }

    static function Type($type)
    {
        switch ($type) {
                // room = 1
            case "room_group":
                return 11;
                break;
                // brand = 2
            case "brand_member":
                return 22;
                break;
            default:
                return 0;
                break;
        }
    }

    static function Action($action)
    {
        switch ($action) {
            case "question":
                return 1;
                break;
            case "view":
                return 2;
                break;
            default:
                return 0;
                break;
        }
    }

    static function ContentCode($content_code)
    {
        switch ($content_code) {
            case "invite":
                return 1;
                break;
            case "delete":
                return 2;
                break;
            default:
                return 0;
                break;
        }
    }

    static function ToContentSring($data)
    {
        if (isset($data["is_result"])) {
            switch ($data["content_code"]) {
                case self::ContentCode("invite"): {
                        switch ($data["type"]) {
                            case self::Type("brand_member"): {
                                    return "{$data["sender_name"]} đã " . ($data["is_result"] == "1" ? "chấp nhận" : "từ chối") . " làm thành viên của nhãn hàng {$data["target_name"]}.";
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch ($data["content_code"]) {
                case self::ContentCode("invite"): {
                        switch ($data["type"]) {
                            case self::Type("brand_member"): {
                                    return "{$data["sender_name"]} đã mời bạn làm thành viên của thương hiệu {$data["target_name"]}.";
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                case self::ContentCode("delete"): {
                        switch ($data["type"]) {
                            case self::Type("brand_member"): {
                                    return "{$data["sender_name"]} đã xóa bạn ra khỏi thương hiệu {$data["target_name"]}.";
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        return "";
    }

    static function ShortcutInfo($data)
    {
        return isset($data) ? [
            "id" => $data["id"],
            "status" => $data["status"],
            "is_seen" => $data["is_seen"],
            "is_response" => $data["is_response"],
            "create_date" => $data["create_date"],
            "content" => self::ToContentSring($data),
            "action" => $data["action"],
            "type" => $data["type"],
            "sender_name" => $data["sender_name"],
            "sender_avatar" => CONF_HOST .  $data["sender_avatar"],
            "target_name" => $data["target_name"],
            "target_avatar" => CONF_HOST . $data["target_avatar"],
        ] : null;
    }

    static function DetailInfo($data)
    {
        $data["content"] = self::ToContentSring($data);
        $data["sender_avatar"] = CONF_HOST .  $data["sender_avatar"];
        $data["target_avatar"] = CONF_HOST .  $data["target_avatar"];

        return $data;
    }
}
