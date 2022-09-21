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
    public function getStudentInfo()
    {
        return $this->studentInfo;
    }

    public function addStudentFromFile($data)
    {
        $data = json_encode($data);
        $data = json_decode($data);
        $query = "INSERT INTO student(id, username, password, firstName, middleName, lastName, email, contact_no) VALUES ";
        $status = array();
        foreach ($data->body as $eachData) {
            $email = strtolower($eachData[4]);
            if ($this->isEmailExist($email)) {
                $status[] = (object) ['status' => false, 'msg' => '<b>' . $email . '</b> is already exist'];
            } else {
                $username = $this->generateUsername($eachData[1], $eachData[3]);
                $password = $this->generateRandomPassword();
                $mail = new Mail(ADMIN);
                $mail->sendCredentials($email, $username, $password);
                $query .= "('$eachData[0]', '$username', '$password', '$eachData[1]', '$eachData[2]', '$eachData[3]', '$email', '$eachData[5]'),";
            }
        }
        $query = rtrim($query, ",");
        if (mysqli_query($this->conn, $query)) {
            $status[] = (object) ['status' => true, 'msg' => ''];
        } else {
            $status[] = (object) ['status' => false, 'msg' => "Error description: " . mysqli_error($this->conn)];
        }
        return $status;
    }

    public function addNewStudent($details)
    {
        $username = $this->generateUsername($details->firstName, $details->lastName);
        $password = $this->generateRandomPassword();
        if ($this->isEmailExist($details->email)) {
            return (object) ['status' => false, 'msg' => "Email Address is already exist!"];
        } else {
            $query = "INSERT INTO student(id, username, password, firstName, middleName, lastName, email, contact_no) VALUES 
                ('$details->id', '$username', '$password', '$details->firstName', '$details->middleName', '$details->lastName', '$details->email', '$details->contact_no')";
            $mail = new Mail(ADMIN);
            $mail->sendCredentials($details->email, $username, $password);
            
            if (mysqli_query($this->conn, $query)) {
                return (object) ['status' => true, 'msg' => ''];
            } else {
                return (object) ['status' => false, 'msg' => "Error description: " . mysqli_error($this->conn)];
            }
        }
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
        $query = "SELECT *, CONCAT(lastName,', ', firstName) AS fullName FROM student WHERE status='" . ACTIVE . "'";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            return $this->setStudentInfo($result);
        }
    }

    private function setStudentInfo($result)
    {
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
                'profile_picture' => $row['profile_picture'],
                'status' => $row['status'],
            ];
        }
        return $faculties;
    }

    private function generateUsername($firstName, $lastName)
    {
        $ext = "";
        $i = 1;
        do {
            $username = strtolower($firstName . $lastName . $ext);
            $username = str_replace(' ', '', $username);
            $ext = $i++;
        } while ($this->isUsernameExist($username));

        return $username;
    }

    private function isUsernameExist($username): bool
    {
        $query = "SELECT id FROM student WHERE username='$username'";
        $result = mysqli_query($this->conn, $query);
        return mysqli_num_rows($result);
    }

    private function isEmailExist($email): bool
    {
        $query = "SELECT id FROM student WHERE email='$email'";
        $result = mysqli_query($this->conn, $query);
        return mysqli_num_rows($result);
    }

    private function generateRandomPassword(): string
    {
        $data = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcefghijklmnopqrstuvwxyz!@#$%&*';
        return substr(str_shuffle($data), 0, 8);
    }
}
