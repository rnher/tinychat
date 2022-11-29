<?php
$runCreateTableMember = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_member (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            brand_id  INT(50) UNSIGNED,
            user_id  INT(50) UNSIGNED,
            role VARCHAR(100) NOT NULL,
            create_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
