<?php
$runCreateTableChatSettings = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_chat_settings (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            brand_id INT(50) UNSIGNED NOT NULL,
            status INT(1) NOT NULL,

            brand_name_color VARCHAR(7) NOT NULL,
            brand_text_color VARCHAR(7) NOT NULL,

            brand_chat_color VARCHAR(7) NOT NULL,
            brand_chat_bg VARCHAR(7) NOT NULL,

            client_chat_color VARCHAR(7) NOT NULL,
            client_chat_bg VARCHAR(7) NOT NULL,

            main_bg VARCHAR(7) NOT NULL,
            main_color VARCHAR(7) NOT NULL,
            main_text VARCHAR(100) NOT NULL,
            main_icon VARCHAR(100) NOT NULL,

            chat_bg VARCHAR(7) NOT NULL,

            is_require_mail BOOLEAN NOT NULL,
            is_require_phone BOOLEAN NOT NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
