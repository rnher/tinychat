<?php

namespace APP\DATABASE;

class Database
{
    private static $db;
    private $conn;
    private $config;
    private $migrates;
    private $seeds;
    private $sample_records;

    protected function  __construct()
    {
        $this->config = CONF_DB;
    }

    function init()
    {
        include_once "migrates/brand.migrate.php";
        include_once "migrates/chatinfo.migrate.php";
        include_once "migrates/customer.migrate.php";
        include_once "migrates/message.migrate.php";
        include_once "migrates/member.migrate.php";
        include_once "migrates/session.migrate.php";
        include_once "migrates/user.migrate.php";
        $this->migrates = [
            "table_brand" => $runCreateTableBrand,
            "table_chat_info" => $runCreateTableChatInfo,
            "table_customer" => $runCreateTableCustomer,
            "table_message" => $runCreateTableMessage,
            "table_member" => $runCreateTableMember,
            "table_session" => $runCreateTableSession,
            "table_user" => $runCreateTableUser,
        ];

        include_once "seeds/chatinfo.seed.php";
        include_once "seeds/customer.seed.php";
        include_once "seeds/message.seed.php";
        include_once "seeds/brand.seed.php";
        // include_once "seeds/user.seed.php";
        // include_once "seeds/session.seed.php";
        // include_once "seeds/member.seed.php";
        $this->seeds = [
            "table_message" => $runCreateRecordMessage,
            "table_customer" => $runCreateRecordCustomer,
            "table_brand" => $runCreateRecordBrand,
            "table_chat_info" => $runCreateRecordChatInfo,
            // "table_user" => $runCreateRecordUser,
        ];

        $this->sample_records = [
            "table_brand" => $brand_sample_record,
            "table_customer" => $customer_sample_record,
            "table_message" => $message_sample_record,
            "table_chat_info" => $chatinfo_sample_record,
            // "table_user" => $user_sample_record,
        ];
    }

    function connect()
    {
        if ($this->conn) {
            return true;
        }

        $this->conn = new \mysqli(
            $this->config["hostname"],
            $this->config["username"],
            $this->config["password"],
            $this->config["dbname"]
        );

        return $this->conn->connect_error;
    }

    function disconnect()
    {
        return $this->conn->close();
    }

    static function Singleton()
    {
        if (!isset(self::$db)) {
            self::$db = new Database();
        }
        return self::$db;
    }

    function runMigrates()
    {
        foreach ($this->migrates as $migrate) {
            $this->query($migrate());
        }
    }

    function runSeeds()
    {
        foreach ($this->seeds as $key => $seed) {
            $this->query("TRUNCATE  TABLE `$key`;");

            $sample_record = $this->sample_records[$key];
            foreach ($sample_record as $record) {
                $this->query($seed($record), "INSERT");
            }
        }
    }

    function query($sql, $type = null)
    {
        $this->connect();
        switch ($type) {
            case "INSERT": {
                    $this->conn->query($sql);
                    return $this->conn->insert_id;
                }
                break;
            default: {
                    $query = $this->conn->query($sql);
                    if (isset($query) && is_object($query)) {
                        switch ($query->num_rows) {
                            case 0: {
                                    return null;
                                }
                                break;
                            case 1: {
                                    return $query->fetch_assoc();
                                }
                                break;
                            default: {
                                    $rows = [];
                                    while ($row = $query->fetch_assoc()) {
                                        $rows[] = $row;
                                    }
                                    return $rows;
                                }
                                break;
                        }
                    } else {
                        return $query;
                    }
                }
                break;
        }
    }

    function Update_Form_Where($table, $column, $value, $data)
    {
        $where = $this->String_Where($column, $value);
        $sql = "UPDATE `$table` SET ";
        $str_set = "";
        foreach ($data as $key => $v) {
            $str_set .= "`$key`= '$v',";
        }

        $sql .= substr($str_set, 0, -1) . " WHERE " . $where . ";";

        return $this->query($sql);
    }

    function Delete_From_Where($table, $column, $value)
    {
        $where = $this->String_Where($column, $value);
        $sql = "DELETE FROM `$table` WHERE " . $where . ";";

        return $this->query($sql);
    }

    function Count_From_Where($table, $col, $column, $value)
    {
        $where = $this->String_Where($column, $value);
        $sql = "SELECT COUNT(`$col`) AS `count` FROM `$table` WHERE " . $where . ";";

        return $this->query($sql);
    }

    function Get_Page_From_Where($table, $pagination, $column, $value, $str_select = "*")
    {
        $where = $this->String_Where($column, $value);

        $sql = "SELECT"
            . " "
            . "$str_select"
            . " FROM"
            . " "
            . "`$table`"
            . " WHERE"
            . " "
            . $where
            . " ORDER BY"
            . " "
            . "`{$pagination["order_by"]}`"
            . " "
            . "{$pagination["sort"]}"
            . " LIMIT"
            . " "
            . "{$pagination["from"]}"
            . " , "
            . "{$pagination["per_page"]}"
            . ";";

        return $this->query($sql);
    }

    function Find_From_Where($table, $column, $value, $str_select = "*")
    {
        $where = $this->String_Where($column, $value);
        $sql = "SELECT " . $str_select . " FROM `$table` WHERE " . $where . ";";

        return $this->query($sql);
    }

    function String_Where($column, $value)
    {
        if (is_array($column) && is_array($value)) {
            $where = "";
            foreach ($column as $index => $c) {
                $where .= " `$column[$index]` " . (isset($value[$index]) ? (" = " . "'$value[$index]' AND") : (" IS NULL AND"));
            }
            $where = substr($where, 0, -3);
        } else {
            $where = "`$column` = '$value'";
        }

        return $where;
    }
}
