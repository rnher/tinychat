<?php
$runCreateTableChatInfo = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_chat_info (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            brand_id INT(50) UNSIGNED NOT NULL,
            customer_id INT(50) UNSIGNED NOT NULL,
            status INT(1) NOT NULL,

            is_seen_brand BOOLEAN NOT NULL,
            is_deleted_brand BOOLEAN NOT NULL,

            public_key VARCHAR(500) NOT NULL,
            private_key VARCHAR(2000) NOT NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
