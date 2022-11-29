<?php
$runCreateTableMessage = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_message (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            chatinfo_id INT(50) UNSIGNED NOT NULL,
            sender_id INT(50) UNSIGNED NOT NULL,
            is_brand INT(1) UNSIGNED NOT NULL,
            type VARCHAR(50) NOT NULL,
            content VARCHAR(1000) NOT NULL,
            is_seen_member INT(1) UNSIGNED NOT NULL,
            is_seen_customer INT(1) UNSIGNED NOT NULL,
            create_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
