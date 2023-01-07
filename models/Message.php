<?php

namespace MODELS;

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

    static function Status($status)
    {
        switch ($status) {
            case "active": {
                    return 1;
                }
                break;
            default: {
                }
                break;
        }
    }

    static function Type($type)
    {
        switch ($type) {
            case "text": {
                    return "text";
                }
                break;
            case "img": {
                    return "img";
                }
                break;
            default: {
                }
                break;
        }
    }

    static function PregContent($type)
    {
        switch ($type) {
            case "text": {
                    return "/^(.*){1,225}$/i";
                }
                break;
            case "img": {
                    return "/^(data:image\/[^;]+;base64[^\"]+)/";
                }
                break;
            default: {
                }
                break;
        }
    }

    static function dir($file_info)
    {
        $CONF_UPLOAD = CONF_UPLOAD;

        $dir = $CONF_UPLOAD["file"]["message"]["dir"];

        $file_name = "id{$file_info["id"]}-{$file_info["create_date"]}";
        $file_name = to_alias($file_name);

        $extension = $CONF_UPLOAD["file"]["message"]["extension"];

        return $dir . $file_name . "." . $extension;
    }

    static function DeleteFile($file_info)
    {
        // FIXME:
        // return unlink(self::dir($file_info));
    }

    static function Save($file_info, $data)
    {
        $file_dir = self::dir($file_info);

        $json_string = self::EnData($data);

        if (file_exists($file_dir)) {
            $json_string = "," . $json_string;
        }

        $file = fopen($file_dir, "a");
        fwrite($file, $json_string);
        fclose($file);

        return $data;
    }

    static function Count($file_info)
    {
        $count = ["count" => 0];
        $file_dir = self::dir($file_info);
        if (file_exists($file_dir)) {
            $file = file_get_contents($file_dir);
            $data = self::DeFile($file);
            $count["count"] = count($data["messages"]);
        }

        return $count;
    }

    static function Get_With_Page($pagination_meta, $file_info)
    {
        $messages = [];

        $file_dir = self::dir($file_info);
        if (file_exists($file_dir)) {
            $file = file_get_contents($file_dir);
            $data = self::DeFile($file);

            // Get message sort create_date
            $form = $pagination_meta["total"] - $pagination_meta["to"];
            if ($form < 0) {
                $per = $pagination_meta["total"] - $pagination_meta["per_page"];
                if ($per < 0) {
                    $per = $pagination_meta["total"];
                }

                $form = 0;
            } else {
                $per = $pagination_meta["per_page"];
            }
            $data["messages"] = array_reverse(array_slice(
                $data["messages"],
                $form,
                $per
            ));

            foreach ($data["messages"] as $message) {
                $messages[] = self::DeData($message);
            }
        } else {
            $messages = null;
        }

        return $messages;
    }

    static function Create($data)
    {
        return [
            "id" => $data["id"],
            "sender_id" => $data["sender_id"],
            "relative_id" => $data["relative_id"],
            "relative_message_id" => $data["relative_message_id"],
            "status" => $data["status"],
            "type" => $data["type"],
            "content" => $data["content"],
            "create_date" => $data["create_date"],
            "update_date" => $data["update_date"],
        ];
    }

    static function EnData($data)
    {
        $data = self::Create($data);

        $en_data = [];
        foreach ($data as $i => $v) {
            // TODO: encode

            $en_data[$i] = $v;
        }

        return json_encode($en_data);
    }

    static function DeData($data)
    {
        $de_data = [];
        foreach ($data as $i => $v) {
            // TODO: decode

            $de_data[$i] = $v;
        }

        return $de_data;
    }

    static function DeFile($data)
    {
        $data_string = '{ "messages":[' . $data . ']}';
        return json_decode($data_string, true);
    }
}
