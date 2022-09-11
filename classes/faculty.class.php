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
        $query = "SELECT *, CONCAT(lastName,', ', firstName) AS fullName FROM faculty WHERE id=$id";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            $this->facultyInfo = $this->setFacultyInfo($result);
            return $this->facultyInfo;
        }
    }

    private function getAllFaculty()
    {
        $query = "SELECT *, CONCAT(lastName,', ', firstName) AS fullName FROM faculty WHERE status='" . ACTIVE . "'";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            return $this->setFacultyInfo($result);
        }
    }

    public function getFacultyInfo()
    {
        return $this->facultyInfo;
    }

    private function setFacultyInfo($result)
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
                'status' => $row['status'],
            ];
        }
        return $faculties;
    }

    public function addFacultyFromFile($data)
    {
        $data = json_encode($data);
        $data = json_decode($data);
        // TODO: EMAIL EACH USER FOR USERNAME AND PASSWORD
        $query = "INSERT INTO faculty(id, username, password, firstName, middleName, lastName, email, contact_no) VALUES ";
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
        mysqli_query($this->conn, $query);
        $status[] = (object) ['status' => true, 'msg' =>''];
        return $status;
    }

    private function generateUsername($firstName, $lastName)
    {
        $ext = "";
        $i = 1;
        do {
            $username = strtolower($firstName . $lastName . $ext);
            $ext = $i++;
        } while ($this->isUsernameExist($username));

        return $username;
    }

    private function isUsernameExist($username): bool
    {
        $query = "SELECT id FROM faculty WHERE username='$username'";
        $result = mysqli_query($this->conn, $query);
        return mysqli_num_rows($result);
    }

    private function isEmailExist($email): bool
    {
        $query = "SELECT id FROM faculty WHERE email='$email'";
        $result = mysqli_query($this->conn, $query);
        return mysqli_num_rows($result);
    }

    private function generateRandomPassword(): string
    {
        $data = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcefghijklmnopqrstuvwxyz!@#$%&*';
        return substr(str_shuffle($data), 0, 8);
    }
}
