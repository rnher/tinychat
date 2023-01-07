<?php
$runCreateTableGroup = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_group (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            status INT(1) NOT NULL,

            name VARCHAR(100) NOT NULL,
            name_alias VARCHAR(100) NOT NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
