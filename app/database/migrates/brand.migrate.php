<?php
$runCreateTableBrand = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_brand (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            status INT(1) NOT NULL,

            name VARCHAR(100) NOT NULL UNIQUE,
            name_alias VARCHAR(100) NOT NULL UNIQUE,
            description VARCHAR(2000) NOT NULL,
            greeting VARCHAR(500) NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            avatar VARCHAR(150) NOT NULL,
            banner VARCHAR(150) NOT NULL,
            domain VARCHAR(200) NULL,
            token VARCHAR(200) NULL,

            expire DATETIME NOT NULL
            )";
};
