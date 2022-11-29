<?php
$runCreateTableChatInfo = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_chat_info (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            brand_id INT(50) UNSIGNED NOT NULL,
            customer_id INT(50) UNSIGNED NOT NULL,
            is_seen_member INT(1) UNSIGNED NOT NULL,
            is_seen_customer INT(1) UNSIGNED NOT NULL,
            create_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
