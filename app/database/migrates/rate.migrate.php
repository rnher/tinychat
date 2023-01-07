<?php
$runCreateTableRate = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_rate (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            relative_id INT(50) UNSIGNED NOT NULL,
            status INT(1) NOT NULL,
            quality INT(1) NOT NULL,

            type VARCHAR(50) NOT NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            advantageContent VARCHAR(100) NULL,
            defectContent VARCHAR(100) NULL,
            commonContent VARCHAR(100) NULL
            )";
};
