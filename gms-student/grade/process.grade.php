<?php
include '../../include/autoloader.inc.php';

$grade = new Grade();
$student = new Student();

if(isset($_POST["GET_STUDENT_GRADES_REQ"])) {
    echo json_encode((array)$student->getStudentInfo());
}
