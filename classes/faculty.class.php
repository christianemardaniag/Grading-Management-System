<?php
class Faculty extends dbHandler
{
    private $id;
    private $facultyInfo;
    public function __construct()
    {
        parent::__construct();
        $arguments = func_get_args();
        if (!empty($arguments)) {
            call_user_func_array(array($this, "withID"), $arguments);
        } else {
            $this->facultyInfo = $this->getAllFaculty();
        }
    }

    private function withID($id)
    {
        $this->id = $id;
        echo "withID" . $id;
    }

    private function getAllFaculty()
    {
        $query = "SELECT *, CONCAT(lastName,', ', firstName) AS fullName FROM faculty WHERE status='" . ACTIVE . "'";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            $faculties = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $faculties[] = (object) [
                    'id' => $row['id'],
                    'username' => $row['username'],
                    'firstName' => $row['firstName'],
                    'middleName' => $row['middleName'],
                    'lastName' => $row['lastName'],
                    'fullName' => $row['fullName'],
                    'email' => $row['email'],
                    'contact_no' => $row['contact_no'],
                    'status' => $row['status'],
                ];
            }
            return $faculties;
        }
    }

    public function getFacultyInfo() {
        return $this->facultyInfo;
    }
}
