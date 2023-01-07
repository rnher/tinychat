<?php
$runCreateTableNotification = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_notification (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            status INT(1) NOT NULL,

            type INT(50) NOT NULL,
            action INT(1) NOT NULL,
            content_code INT(1) NOT NULL,

            target_id INT(50) UNSIGNED,
            target_name VARCHAR(100) NOT NULL,
            target_avatar VARCHAR(150) NOT NULL,

            sender_id INT(50) UNSIGNED,
            sender_name VARCHAR(100) NOT NULL,
            sender_avatar VARCHAR(150) NOT NULL,

            receiver_id INT(50) UNSIGNED,

            is_seen BOOLEAN NOT NULL,
            is_response BOOLEAN NOT NULL,
            is_result BOOLEAN NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
