<?php
include '../../include/autoloader.inc.php';

$student = new Student();
$faculty = new Faculty($_SESSION[FACULTY]);

if (isset($_POST['GET_FACULTY_REQ'])) {
	echo json_encode((array)$faculty->getFacultyInfo()[0]);
} elseif (isset($_POST['GET_STUDENTS_REQ'])) {
	echo json_encode((array)$student->getStudentInfo());
}
