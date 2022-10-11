<?php
class Grade extends dbHandler
{

    public function __construct()
    {
        parent::__construct();
        $arguments = func_get_args();
        switch ($arguments) {
            case 0:
                # code...
                break;
            case 1:
                call_user_func_array(array($this, "withID"), $arguments);
                break;
        }
    }

    // PUBLIC FUNCTIONS
    public function getGrades()
    {
    }

    public function addClassRecordFromFile($data)
    {
        $data = json_encode($data);
        $data = json_decode($data);
        $status = array();
        foreach ($data->students as $student) {
            $criteria = json_encode($data->criteria);
            $grade = json_encode($student->scores);
            $query = "UPDATE student_subject SET criteria='$criteria', grade='$grade' WHERE student_id='$student->studentNo'";
            if (mysqli_query($this->conn, $query)) {
                $status[] = (object) ['status' => true, 'msg' => ''];
            } else {
                $status[] = (object) ['status' => false, 'sql' => $query, 'msg' => "Error description: " . mysqli_error($this->conn)];
            }
        }

        return $status;
    }

    // PRIVATE FUNCTIONS

    private function withID($id)
    {
    }

    private function getCriteria()
    {
        // $query = "SELECT * FROM criteria";
        // $result = mysqli_query($this->conn, $query);
        // if (mysqli_num_rows($result)) {
        //     $criteria = array();
        //     while ($row = mysqli_fetch_assoc($result)) {
        //         $criteria[] = (object) [
        //             'name' => $row['name'],
        //             'equiv' => $row['equiv'],
        //             'username' => $row['username'],
        //             'email' => $row['email'],
        //             'contact_no' => $row['contact_no'],
        //             'profile_picture' => $row['profile_picture'],
        //             'status' => $row['status'],
        //             'sub_sec' => $sub_sec,
        //         ];
        //     }
        // }
        // return $faculties;
    }
}
