<?php
$runCreateTableCustomer = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_customer (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            brand_id INT(50) UNSIGNED NOT NULL,
            status INT(1) NOT NULL,

            token VARCHAR(200) NOT NULL,
            name VARCHAR(100) NOT NULL,
            avatar VARCHAR(150) NOT NULL,

            is_active BOOLEAN NOT NULL,

            create_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            phone VARCHAR(200) NULL,
            mail VARCHAR(200) NULL
            )";
};
