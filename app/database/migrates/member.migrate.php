<?php
$runCreateTableMember = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_member (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT(50) UNSIGNED NOT NULL,
            brand_id INT(50) UNSIGNED NOT NULL,
            status INT(1) NOT NULL,
            role INT(1) NOT NULL,

            token VARCHAR(200) NOT NULL,
            
            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            greeting VARCHAR(500) NULL
            )";
};
