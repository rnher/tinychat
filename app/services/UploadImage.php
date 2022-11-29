<?php

namespace APP\SERVICES;

class UploadImage
{
    private $config;
    private $rawdata;
    private $folder_dir;
    private $isMutile;

    function __construct($rawdata, $folder_dir = null, $isMutile = false)
    {
        $this->config = CONF_UPLOAD["image"];
        $this->rawdata = $rawdata;
        $this->folder_dir = $this->config["target_dir"] . "/" .  ($folder_dir ? $folder_dir : "");
        $this->isMutile = $isMutile;

        if (!file_exists($this->folder_dir)) {
            mkdir($this->folder_dir, 0777, true);
        }
    }

    function saveOne($rawdata)
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
            $output_file_with_extension = ($rawdata["name"] ? $rawdata["name"] : time())  . "." . $extension;
        }

        $link_image = $this->folder_dir . "/" . $output_file_with_extension;
        file_put_contents($link_image, base64_decode($data));

        return $this->config["root_dir"] . $link_image;
    }

    private function saveMutile()
    {
        $link_image = "";
        foreach ($this->rawdata as $key => $data) {
            $link_image .=  $this->saveOne($data) . ",";
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