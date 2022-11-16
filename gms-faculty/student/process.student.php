<?php
include '../../include/autoloader.inc.php';

$facultyID = $_SESSION[FACULTY];
$student = new Student();
$faculty = new Faculty($facultyID);

if (isset($_POST['GET_FACULTY_REQ'])) {
	echo json_encode((array)$faculty->getSubjectSection($facultyID));
} elseif (isset($_POST['GET_STUDENTS_REQ'])) {
	echo json_encode((array)$student->getHandledStudent($facultyID));
} elseif (isset($_POST['GET_SECTION_REQ'])) {
	echo json_encode((array)$faculty->getSectionBySubjectCode($facultyID, $_POST['GET_SECTION_REQ']));
} elseif (isset($_POST['DROP_STUDENT_REQ'])) {
	// echo json_encode((array)$faculty->dropStudent($_POST['DROP_STUDENT_REQ']));
} 
