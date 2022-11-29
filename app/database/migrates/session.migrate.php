<?php
$runCreateTableSession = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_session (
        id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(200) NOT NULL,
        user_id INT(50) UNSIGNED NOT NULL,
        is_login INT(1) NOT NULL,
        expire INT(50)  NOT NULL,
        create_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
};
