<?php
$runCreateTableMessage = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_message (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            sender_id INT(50) UNSIGNED NOT NULL,
            relative_id INT(50) UNSIGNED NOT NULL,
            relative_message_id INT(50) UNSIGNED NOT NULL,
            status INT(1) NOT NULL,

            type VARCHAR(50) NOT NULL,
            content VARCHAR(1000) NOT NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
