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

    public function updateClassRecord($data)
    {
        $data = json_encode($data);
        $data = json_decode($data);
        $status = array();
        foreach ($data->students as $student) {
            $criteria = json_encode($data->criteria);
            $grade = json_encode($student->scores);
            if ($grade !== "\"\"") {
                $query = "UPDATE student_subject SET criteria='$criteria', grade='$grade', final_grade='$student->grade', 
                equiv='$student->equiv', remarks='$student->remarks' WHERE student_id='$student->studentNo' AND subject_code='$data->code'";

                if (mysqli_query($this->conn, $query)) {
                    $status[] = (object) ['status' => true, 'msg' => ''];
                } else {
                    $status[] = (object) ['status' => false, 'sql' => $query, 'msg' => "Error description: " . mysqli_error($this->conn)];
                }
            }
        }

        return $status;
    }

    // PRIVATE FUNCTIONS

    private function withID($id)
    {
    }

}
