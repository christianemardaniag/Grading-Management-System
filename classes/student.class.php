<?php
class Student extends dbHandler
{
    private $id;
    private $studentInfo;
    public function __construct()
    {
        parent::__construct();
        $arguments = func_get_args();
        if (!empty($arguments)) {
            call_user_func_array(array($this, "withID"), $arguments);
        } else {
            $this->studentInfo = $this->getAllStudent();
        }
    }

    // PUBLIC FUNCTIONS


    public function addStudentFromFile($data)
    {
        $data = json_encode($data);
        $data = json_decode($data);
        $query = "INSERT INTO student(id, fullName, username, email, password, contact_no, gender, specialization, program, level, section) VALUES ";
        $sql = "INSERT INTO student_subject(student_id, subject_code) VALUES";
        $status = array();
        $has_student = false;
        $has_subject = false;
        foreach ($data->body as $eachData) {
            $email = strtolower($eachData[STUDENT_EMAIL]);
            if ($this->isEmailExist($email)) {
                $status[] = (object) ['status' => false, 'msg' => '<b>' . $email . '</b> is already exist'];
            } else {
                $username = explode("@", $email)[0];
                $password = $this->generateRandomPassword();
                // $mail = new Mail(ADMIN);
                // $mail->sendCredentials($email, $username, $password);
                $query .= "(
                    '" . $eachData[STUDENT_STUDENT_NO]      . "',
                    '" . $eachData[STUDENT_FULLNAME]        . "', 
                    '$username', '$email', '$password', 
                    '" . $eachData[STUDENT_CONTACT_NO]      . "', 
                    '" . $eachData[STUDENT_GENDER]          . "', 
                    '" . $eachData[STUDENT_SPECIALIZATION]  . "', 
                    '" . $eachData[STUDENT_PROGRAM]         . "', 
                    '" . $eachData[STUDENT_LEVEL]           . "', 
                    '" . $eachData[STUDENT_SECTION]         . "'),";
                $has_student = true;
                foreach (explode(", ", $eachData[STUDENT_SUBJECTS]) as $subject) {
                    $sql .= "('" . $eachData[STUDENT_STUDENT_NO] . "', '$subject'),";
                    $has_subject = true;
                }
            }
        }
        $sql = rtrim($sql, ",");
        $query = rtrim($query, ",");
        if ($has_student) {
            if (mysqli_query($this->conn, $query)) {
                if ($has_subject) {
                    if (mysqli_query($this->conn, $sql)) {
                        $status[] = (object) ['status' => true, 'msg' => ''];
                    } else {
                        $status[] = (object) ['status' => false, 'sql' => $sql, 'msg' => "Error description: " . mysqli_error($this->conn)];
                    }
                } else {
                    $status[] = (object) ['status' => true, 'msg' => ''];
                }
            } else {
                $status[] = (object) ['status' => false, 'sql' => $query, 'msg' => "Error description: " . mysqli_error($this->conn)];
            }
        }
        return $status;
    }

    public function addNewStudent($details)
    {
        $username = explode("@", $details->email)[0];
        $password = $this->generateRandomPassword();
        if ($this->isEmailExist($details->email)) {
            return (object) ['status' => false, 'msg' => "Email Address is already exist!"];
        } else {
            $query = "INSERT INTO student(id, fullName, username, email, password, contact_no, gender, specialization, program, level, section) VALUES 
                ('$details->id', '$details->fullName', '$username', '$details->email', '$password', '$details->contactNo', '$details->gender', '$details->specialization', '$details->program', '$details->level', '$details->section')";
            // $mail = new Mail(ADMIN);
            // $mail->sendCredentials($details->email, $username, $password);

            if (mysqli_query($this->conn, $query)) {
                $sql = "INSERT INTO student_subject(student_id, subject_code) VALUES";
                foreach (explode(", ", $details->subjects) as $subject) {
                    $sql .= "('$details->id', '$subject'),";
                }
                $sql = rtrim($sql, ",");
                if (mysqli_query($this->conn, $sql)) {
                    return (object) ['status' => true, 'msg' => ''];
                } else {
                    return (object) ['status' => false, 'sql' => $query, 'msg' => "Error description: " . mysqli_error($this->conn)];
                }
            } else {
                return (object) ['status' => false, 'sql' => $query, 'msg' => "Error description: " . mysqli_error($this->conn)];
            }
        }
    }

    public function editStudent($details)
    {
        if ($this->isEmailExist($details->email, $details->id_old)) {
            return (object) ['status' => false, 'msg' => "Email Address is already exist!"];
        } else {

            $query = "UPDATE `student` SET `id`='$details->id',`fullName`='$details->fullName',`contact_no`='$details->contactNo',`gender`='$details->gender',`specialization`='$details->specialization',`program`='$details->program',`level`='$details->level',`section`='$details->section'/* ,`subjects`='$details->subjects' */ WHERE id='$details->id_old'";
            if (mysqli_query($this->conn, $query)) {
                return (object) ['status' => true, 'msg' => ''];
            } else {
                return (object) ['status' => false, 'sql' => $query, 'msg' => "Error description: " . mysqli_error($this->conn)];
            }
        }
    }

    public function removeStudent($studentNo)
    {
        $query = "UPDATE `student` SET `status`='deleted' WHERE id='$studentNo'";
        if (mysqli_query($this->conn, $query)) {
            return (object) ['status' => true, 'msg' => ''];
        } else {
            return (object) ['status' => false, 'sql' => $query, 'msg' => "Error description: " . mysqli_error($this->conn)];
        }
    }

    public function getDestinctProgram()
    {
        $prog = array();
        $query = "SELECT DISTINCT(program) FROM student";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            while ($row = mysqli_fetch_assoc($result))
                array_push($prog, $row["program"]);
        }
        return $prog;
    }

    public function getSections($program, $level)
    {
        $prog = array();
        $query = "SELECT DISTINCT(section) FROM student WHERE program='$program' AND level='$level'";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            while ($row = mysqli_fetch_assoc($result))
                array_push($prog, $row["section"]);
        }
        return $prog;
    }


    // PRIVATE FUNCTIONS

    private function withID($id)
    {
        $this->id = $id;
        $query = "SELECT *, CONCAT(lastName,', ', firstName) AS fullName FROM student WHERE id=$id";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            $this->studentInfo = $this->setStudentInfo($result);
            return $this->studentInfo;
        }
    }

    private function getAllStudent()
    {
        $query = "SELECT * FROM student WHERE status='" . ACTIVE . "'";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            return $this->setStudentInfo($result);
        }
    }

    public function getStudentInfo()
    {
        return $this->studentInfo;
    }

    private function setStudentInfo($result)
    {
        $students = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $subjects = array();
            $id = $row['id'];
            $query = "SELECT student_subject.*, subject.description FROM `student_subject` INNER JOIN subject on student_subject.subject_code=subject.code WHERE student_subject.student_id=$id";
            $res = mysqli_query($this->conn, $query);
            if (mysqli_num_rows($res)) {
                while ($subrow = mysqli_fetch_assoc($res)) {
                    $subjects[] = (object) [
                        "code" => $subrow["subject_code"],
                        "description" => $subrow['description'],
                        "grade" => $subrow['final_grade'],
                        "equiv" => $subrow['equiv'],
                        "remarks" => $subrow['remarks'],
                        "criteria" => json_decode($subrow['criteria']),
                        "scores" => json_decode($subrow['grade'])
                    ];
                }
            }

            $students[] = (object) [
                'studentNo' => $id,
                'fullName' => $row['fullName'],
                'username' => $row['username'],
                'email' => $row['email'],
                'contact_no' => $row['contact_no'],
                'gender' => $row['gender'],
                'specialization' => $row['specialization'],
                'program' => $row['program'],
                'level' => $row['level'],
                'section' => $row['section'],
                'subjects' => $subjects,
                'profile_picture' => $row['profile_picture'],
                'status' => $row['status'],
            ];
        }
        return $students;
    }

    private function isEmailExist($email, $id = "")
    {
        $query = 'SELECT id FROM `student` WHERE email="' . $email . '" AND id!="' . $id . '"';
        $result = mysqli_query($this->conn, $query);
        return mysqli_num_rows($result);
    }

    private function generateRandomPassword(): string
    {
        $data = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcefghijklmnopqrstuvwxyz!@#$%&*';
        return substr(str_shuffle($data), 0, 8);
    }
}
