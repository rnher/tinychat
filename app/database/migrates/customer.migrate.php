<?php
$runCreateTableCustomer = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_customer (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            token VARCHAR(200) NOT NULL,
            brand_id INT(50) UNSIGNED NOT NULL,
            name VARCHAR(100) NOT NULL,
            phone INT(50) UNSIGNED NOT NULL,
            is_active BOOLEAN NULL,
            avatar VARCHAR(150) NULL,
            create_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
