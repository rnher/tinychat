<?php
$runCreateTableActiveLog = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_active_log (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT(50) UNSIGNED NOT NULL,
            status INT(1) NOT NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            targer_id INT(50) UNSIGNED NOT NULL,
            target_action INT(1) NOT NULL,
            target_status INT(1) NOT NULL,
            targer_type VARCHAR(50) NOT NULL,

            client_ip VARCHAR(100) NOT NULL,
            client_agent VARCHAR(200) NOT NULL
            )";
};
