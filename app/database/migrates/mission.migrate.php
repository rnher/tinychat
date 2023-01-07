<?php
$runCreateTableMission = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_sission (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            relative_id INT(50) UNSIGNED NOT NULL,
            status INT(1) NOT NULL,

            name VARCHAR(100) NOT NULL,
            content VARCHAR(2000) NOT NULL,
            type VARCHAR(50) NOT NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            expire DATETIME NULL
            )";
};
