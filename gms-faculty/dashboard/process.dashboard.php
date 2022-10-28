<?php
include '../../include/autoloader.inc.php';

$facultyID = $_SESSION[FACULTY];
$faculty = new Faculty($facultyID);

if (isset($_POST['GET_FACULTY_REQ'])) {
	echo json_encode((array)$faculty->getFacultyInfo()[0]);
} 
