<?php
include '../../include/autoloader.inc.php';

$student = new Student();

if (isset($_POST['GET_STUDENTS_REQ'])) {
	echo json_encode((array)$student->getStudentInfo());
}
