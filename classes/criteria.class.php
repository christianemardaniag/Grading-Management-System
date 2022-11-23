<?php
class Criteria extends dbHandler
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getCriteria()
    {
        $data = array();
        $query = "SELECT * FROM criteria";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = (object) [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "equiv" => $row['equiv'],
                ];
            }
        }
        return $data;
    }

    public function updateCriteria($data)
    {
        $query = "";
        foreach ($data as $key => $x) {
            $query = "UPDATE `criteria` SET `equiv`='" . $x . "' WHERE id='" . $key . "'; ";
            if (mysqli_query($this->conn, $query)) {
                // return (object) ['status' => true, 'msg' => ''];
            } else {
                // return (object) ['status' => false, 'sql' => $query, 'msg' => "Error description: " . mysqli_error($this->conn)];
            }
        }
    }

    public function getEquiv()
    {
        $data = array();
        $query = "SELECT * FROM criteria";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            while ($row = mysqli_fetch_assoc($result)) {
                array_push($data, $row['equiv']);
            }
        }
        return $data;
    }
}
