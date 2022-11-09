<?php
class Subject extends dbHandler
{
    private $subjects = array();
    public function __construct($studentID = '', $currentEnroled = false)
    {
        parent::__construct();
        if ($studentID == '') {
            $query = "SELECT * FROM subject";
        } elseif($currentEnroled) {
            $query = "SELECT subject.* FROM `subject` INNER JOIN student ON student.level=subject.year_level WHERE student.id=$studentID";
        } else {
            $query = "SELECT subject.* FROM `subject` INNER JOIN student_subject ON subject.code=student_subject.subject_code WHERE student_subject.student_id='$studentID'";
        }
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            while ($row = mysqli_fetch_assoc($result)) {
                $id = $row['id'];
                $this->subjects[] = (object)[
                    'id' => $id,
                    'code' => $row['code'],
                    'description' => $row['description'],
                    'year_level' => $row['year_level'],
                    'semester' => $row['semester'],
                    'specialization' => $row['specialization'],
                    'lec_units' => $row['lec_units'],
                    'lab_units' => $row['lab_units'],
                    'total_units' => $row['total_units'],
                    'hours_per_week' => $row['hours_per_week'],
                    'prereq' => $row['prereq'],
                    'coreq' => $row['co_req']
                ];
            }
        }
    }

    public function getAllSubject()
    {
        return $this->subjects;
    }
}
