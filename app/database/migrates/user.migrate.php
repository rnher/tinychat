<?php
$runCreateTableUser = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_user (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            password VARCHAR(200) NOT NULL,
            avatar VARCHAR(150) NULL,
            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
