<?php
class dbHandler
{
    public $conn;
    private const DB_SERVERNAME = "localhost";
    private const DB_USERNAME = "root";
    private const DB_PASSWORD = "";
    private const DB_NAME = "gradingmanagementsystem";

    public function __construct()
    {
        $this->conn = new mysqli(
            self::DB_SERVERNAME,
            self::DB_USERNAME,
            self::DB_PASSWORD,
            self::DB_NAME
        );
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    function __destruct()
    {
        $this->conn->close();
    }
}  // End of dbHandler class
