<?php
class Subject extends dbHandler
{
    private $subjects = array();
    public function __construct()
    {
        parent::__construct();
        $query = "SELECT * FROM subject";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            while ($row = mysqli_fetch_assoc($result)) {
                $code = $row['code'];
                $this->subjects[] = (object)[
                    'code' => $code,
                    'description' => $row['description'],
                    'year_level' => $row['year_level'],
                    'semester' => $row['semester'],
                    'specialization' => $row['specialization'],
                    'teachers' => $this->getTeacher($code),
                ];
            }
        }
    }

    public function getAllSubject()
    {
        return $this->subjects;
    }

    private function getTeacher($code)
    {
        $query = "SELECT CONCAT(faculty.lastName, ', ', faculty.firstName) as fullName 
        FROM faculty INNER JOIN faculty_subject ON faculty.id=faculty_subject.faculty_id
        WHERE faculty_subject.subject_code='$code'";
        $result = mysqli_query($this->conn, $query);
        $teachers = array();
        if (mysqli_num_rows($result)) {
            while ($row = mysqli_fetch_assoc($result)) {
                $teachers[] = (object)[
                    'fullName' => $row['fullName'],
                ];
            }
        }
        return $teachers;
    }
}
