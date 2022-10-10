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

    // public function addClassRecordFromFile($data)
    // {
    //     $data = json_encode($data);
    //     $data = json_decode($data);
    //     $query = "INSERT INTO student(id, fullName, username, email, password, contact_no, gender, specialization, program, level, section) VALUES ";
    //     $sql = "INSERT INTO student_subject(student_id, subject_code) VALUES";
    //     $status = array();
    //     $has_student = false;
    //     $has_subject = false;
    //     foreach ($data->body as $eachData) {
    //         $email = strtolower($eachData[STUDENT_EMAIL]);
    //         if ($this->isEmailExist($email)) {
    //             $status[] = (object) ['status' => false, 'msg' => '<b>' . $email . '</b> is already exist'];
    //         } else {
    //             $username = explode("@", $email)[0];
    //             $password = $this->generateRandomPassword();
    //             // $mail = new Mail(ADMIN);
    //             // $mail->sendCredentials($email, $username, $password);
    //             $query .= "(
    //                 '" . $eachData[STUDENT_STUDENT_NO]      . "',
    //                 '" . $eachData[STUDENT_FULLNAME]        . "', 
    //                 '$username', '$email', '$password', 
    //                 '" . $eachData[STUDENT_CONTACT_NO]      . "', 
    //                 '" . $eachData[STUDENT_GENDER]          . "', 
    //                 '" . $eachData[STUDENT_SPECIALIZATION]  . "', 
    //                 '" . $eachData[STUDENT_PROGRAM]         . "', 
    //                 '" . $eachData[STUDENT_LEVEL]           . "', 
    //                 '" . $eachData[STUDENT_SECTION]         . "'),";
    //             $has_student = true;
    //             foreach (explode(", ", $eachData[STUDENT_SUBJECTS]) as $subject) {
    //                 $sql .= "('" . $eachData[STUDENT_STUDENT_NO] . "', '$subject'),";
    //                 $has_subject = true;
    //             }
    //         }
    //     }
    //     $sql = rtrim($sql, ",");
    //     $query = rtrim($query, ",");
    //     if ($has_student) {
    //         if (mysqli_query($this->conn, $query)) {
    //             if ($has_subject) {
    //                 if (mysqli_query($this->conn, $sql)) {
    //                     $status[] = (object) ['status' => true, 'msg' => ''];
    //                 } else {
    //                     $status[] = (object) ['status' => false, 'sql' => $sql, 'msg' => "Error description: " . mysqli_error($this->conn)];
    //                 }
    //             } else {
    //                 $status[] = (object) ['status' => true, 'msg' => ''];
    //             }
    //         } else {
    //             $status[] = (object) ['status' => false, 'sql' => $query, 'msg' => "Error description: " . mysqli_error($this->conn)];
    //         }
    //     }
    //     return $status;
    // }

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
