<?php
$runCreateTableBrand = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_brand (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            name_alias VARCHAR(100) NOT NULL UNIQUE,
            avatar VARCHAR(150) NULL,
            domain VARCHAR(200) NULL,
            token VARCHAR(200) NULL,
            description VARCHAR(2000) NOT NULL,
            expired_date DATETIME,
            create_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
