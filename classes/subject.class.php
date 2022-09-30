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
                    'coreq' => $row['co_req'],
                    // 'teachers' => $this->getTeacher($id),
                ];
            }
        }
    }

    public function getAllSubject()
    {
        return $this->subjects;
    }

    public function removeSubject($id)
    {
        $query = "DELETE FROM `subject` WHERE id='$id'";
        if (mysqli_query($this->conn, $query)) {
            return (object) ["status" => true, "msg" => ''];
        } else {
            return (object) ["status" => false, "msg" => mysqli_error($this->conn)];
        }
    }

    public function unassignedFaculty($assigned)
    {
        $query = "SELECT id, CONCAT(faculty.lastName, ', ', faculty.firstName) as fullName FROM `faculty` WHERE id NOT IN (''$assigned)";
        $result = mysqli_query($this->conn, $query);
        $teachers = array();
        if (mysqli_num_rows($result)) {
            while ($row = mysqli_fetch_assoc($result)) {
                $teachers[] = (object)[
                    'id' => $row['id'],
                    'fullName' => $row['fullName'],
                    'assigned_subject' => $this->getAssignedSubjects($row['id']),
                ];
            }
        }

        return $teachers;
    }

    public function removeAssignedFaculty($id)
    {
        $query = "DELETE FROM `faculty_subject` WHERE id='$id'";
        if (mysqli_query($this->conn, $query)) {
            return (object) ["status" => true, "msg" => ''];
        } else {
            return (object) ["status" => false, "msg" => mysqli_error($this->conn)];
        }
    }

    public function updateSubject($info)
    {
        $info = json_encode($info);
        $info = json_decode($info);
        $query = "UPDATE subject SET code='$info->new_code', description='$info->description',
            year_level='$info->year_level', semester='$info->semester', specialization='$info->specialization'
            WHERE id='$info->id'";
        if (mysqli_query($this->conn, $query)) {
            return (object) ["status" => true, "msg" => ''];
        } else {
            return (object) ["status" => false, "msg" => mysqli_error($this->conn)];
        }
    }

    public function assignSelectedFaculty($selectedFaculty, $subjectID)
    {
        $query = "INSERT INTO `faculty_subject`(`faculty_id`, `subject_id`) VALUES ";
        $status = array();
        foreach ($selectedFaculty as $eachData) {
            $query .= "('$eachData', '$subjectID'),";
        }
        $query = rtrim($query, ",");
        if (mysqli_query($this->conn, $query)) {
            $status[] = (object) ['status' => true, 'msg' => ''];
        } else {
            $status[] = (object) ['status' => false, 'msg' => "Error description: " . mysqli_error($this->conn)];
        }
        return $status;
    }

    public function addNewSubject($info) {
        $info = json_decode($info);
        $year_level = explode('-',$info->addYearSem)[0];
        $sem = explode('-',$info->addYearSem)[1];
        
        $query = "INSERT INTO `subject`(`code`, `description`, `year_level`, `semester`, `specialization`, 
        `lec_units`, `lab_units`, `hours_per_week`, `prereq`, `co_req`) VALUES ('$info->addCode','$info->addDescription',
        '$year_level','$sem','$info->addSpecialization','$info->addLecUnits','$info->addLabUnits','$info->addHoursPerWeek','$info->addPrereq','$info->addCoReq')";
        if (mysqli_query($this->conn, $query)) {
            $status = (object) ['status' => true, 'msg' => ''];
        } else {
            $status = (object) ['status' => false, 'msg' => "Error description: " . mysqli_error($this->conn)];
        }
        return $status;
    }

    private function getAssignedSubjects($facultyID)
    {
        $query = "SELECT subject.code FROM subject INNER JOIN faculty_subject ON subject.id=faculty_subject.subject_id
            WHERE faculty_subject.faculty_id = '$facultyID'";
        $result = mysqli_query($this->conn, $query);
        $assignedSubject = array();
        if (mysqli_num_rows($result)) {
            while ($row = mysqli_fetch_assoc($result)) {
                $assignedSubject[] = (object)[
                    'code' => $row['code']
                ];
            }
        }
        return $assignedSubject;
    }

    private function getTeacher($id)
    {
        $query = "SELECT faculty_subject.id as FSID, faculty.email, faculty.id, faculty.profile_picture, CONCAT(faculty.lastName, ', ', faculty.firstName) as fullName 
        FROM faculty INNER JOIN faculty_subject ON faculty.id=faculty_subject.faculty_id
        WHERE faculty_subject.subject_id = '$id'";
        $result = mysqli_query($this->conn, $query);
        $teachers = array();
        if (mysqli_num_rows($result)) {
            while ($row = mysqli_fetch_assoc($result)) {
                $teachers[] = (object)[
                    'id' => $row['id'],
                    'fsid' => $row['FSID'],
                    'fullName' => $row['fullName'],
                    'profile_picture' => $row['profile_picture'],
                ];
            }
        }
        return $teachers;
    }
}
