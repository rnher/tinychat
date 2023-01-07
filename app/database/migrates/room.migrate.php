<?php
$runCreateTableRoom = function () {
    return $sql = "CREATE TABLE IF NOT EXISTS table_room (
            id INT(50) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            status INT(1) NOT NULL,

            type INT(1) NOT NULL,
            room_id INT(50) UNSIGNED,
            user_id INT(50) UNSIGNED,
            is_member BOOLEAN NOT NULL,

            create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";
};
