<?php

namespace APP\SERVICES;

class UploadImage
{
    private $config;
    private $rawdata;
    private $folder_dir;
    private $isMutile;

    function __construct($rawdata = null, $folder_dir = null, $isMutile = false)
    {
        $this->config = CONF_UPLOAD["image"];
        $this->rawdata = $rawdata;
        // TODO: kiểm tra đường dẫn target_dir
        $this->folder_dir = $this->config["target_dir"] . "/" .  ($folder_dir ? $folder_dir : "");
        $this->isMutile = $isMutile;

        if (!file_exists($this->folder_dir)) {
            mkdir($this->folder_dir, 0777, true);
        }
    }

    public function getBase64ImageSize($rawdata)
    {
        $size_in_bytes = (int) (strlen(rtrim($rawdata["data"], '=')) * 3 / 4);
        $size_in_kb    = $size_in_bytes / 1024;
        $size_in_mb    = $size_in_kb / 1024;

        return $size_in_mb;
    }

    function validate($rawdata)
    {
        $splited = explode(",", substr($rawdata["data"], 5), 2);
        $mime = $splited[0];
        $data = $splited[1];
        $mime_split_without_base64 = explode(";", $mime, 2);
        $mime_split = explode("/", $mime_split_without_base64[0], 2);
        if (count($mime_split) == 2) {
            $extension = $mime_split[1];
            if ($extension == "jpeg") {
                $extension = "jpg";
            }

            $is_truth_format = array_search($extension, $this->config["formats"]);
            // $size = getimagesize($rawdata["data"]);
            $size = $this->getBase64ImageSize($rawdata);
            $is_truth_size =  $size  <= $this->config["size"];
            if ($is_truth_format == false || !$is_truth_size) {
                return false;
            }

            return [
                "data" => $data,
                "name" => ($rawdata["name"] ? $rawdata["name"] : time())  . "." . $extension
            ];
        }

        return false;
    }

    function saveOne($rawdata)
    {
        $validate = $this->validate($rawdata);

        if (!$validate) {
            return false;
        }

        $link_image = $this->folder_dir . "/" . $validate["name"];
        file_put_contents($link_image, base64_decode($validate["data"]));

        // TODO: kiểm tra đường dẫn root_dir
        return $this->config["root_dir"] . $link_image;
    }

    private function saveMutile()
    {
        $link_image = "";
        foreach ($this->rawdata as $key => $data) {
            if ($image_name = $this->saveOne($data) != false) {
                $link_image .=  $image_name . ",";
            } else {
                return false;
            }
        }

        return substr($link_image, 0, -1);
    }

    function save()
    {
        if ($this->isMutile) {
            return $this->saveMutile();
        } else {
            return $this->saveOne($this->rawdata);
        }
    }

    static function formatURL($string)
    {
        return explode(",", $string);
    }
}
