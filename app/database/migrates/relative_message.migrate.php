<?php
$runCreateTableRelativeMessage = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_relative_message (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            status INT(1) NOT NULL,
            
            someone_id INT(50) UNSIGNED NOT NULL,
            someone_type INT(1) NOT NULL,

            relative_id INT(50) UNSIGNED NOT NULL,
            relative_type INT(1) NOT NULL,

            count_not_seen INT(50) UNSIGNED NOT NULL,
            is_deleted BOOLEAN NOT NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   
            join_date DATETIME NOT NULL,
            leave_date DATETIME NULL
            )";
};
