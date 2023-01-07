<?php
include_once "models/Message.php";

use MODELS\Message;

function validateMesage($typeNames, $typePatterns, $typeError, $typeRequiredNames = [], $raw_data = null)
{
    $data = [];
    $error = [];

    foreach ($typeNames as $name) {
        $data[$name] = $raw_data[$name];

        if (
            isset($typeRequiredNames[$name])
            && is_null($data[$name])
        ) {
            $error[$name] = $typeError[$name];
        }

        if (isset($data[$name])) {
            if (
                isset($typePatterns[$name])
                ? !preg_match($typePatterns[$name], $data[$name])
                : false
            ) {
                $error[$name] = $typeError[$name];
            }
        } else {
            unset($data[$name]);
        }
    }

    return [
        "data" => $data,
        "error" => $error,
        "isError" => count($error) !== 0
    ];
}

$metadata = function ($data) {
    $typeRequiredNames = [
        "content" => "content",
    ];
    $typeNames = [
        "content",
        "type",
    ];
    $typePatterns = [
        "content" => Message::PregContent("text"),
    ];
    $typeError = [
        "content" => "Nội dung không hợp lệ",
    ];

    // Xác định và phân loại dữ liệu
    $data["content"] = trim($data["content"]);
    switch ($data["type"]) {
        case Message::Type("text"): {
                $data["type"] = Message::Type("text");
                $typePatterns["content"] = Message::PregContent("text");
            }
            break;
        case Message::Type("img"): {
                $data["type"] = Message::Type("img");
                $typePatterns["content"] = Message::PregContent("img");
            }
            break;
        default: {
                $data["type"] = Message::Type("text");
                $typePatterns["content"] = Message::PregContent("text");
            }
            break;
    }

    $validate = validateMesage(
        $typeNames,
        $typePatterns,
        $typeError,
        $typeRequiredNames,
        $data
    );

    return $validate;
};

return [
    "metadata" => $metadata,
];
