<?php
include '../../include/autoloader.inc.php';

$student = new Student();
$faculty = new Faculty($_SESSION[FACULTY]);

if (isset($_POST['GET_FACULTY_REQ'])) {
	echo json_encode((array)$faculty->getFacultyInfo()[0]);
}

if (isset($_POST['GET_STUDENTS_REQ'])) {
	echo json_encode((array)$student->getStudentInfo());
} 
// elseif (isset($_FILES['fileUpload'])) {
// 	$fileName = $_FILES['fileUpload']['tmp_name'];
// 	if ($xlsx = SimpleXLSX::parse("$fileName")) {
// 		$dim = $xlsx->dimension();
// 		$cols = $dim[0];
// 		echo json_encode((array)$xlsx->rows());
// 	} else {
// 		echo SimpleXLSX::parseError();
// 	}
// } elseif (isset($_POST['uploadFileToDB'])) {
// 	echo json_encode((array)$student->addStudentFromFile($_POST['uploadFileToDB']));
// } elseif (isset($_POST['ADD_STUDENT_REQ'])) {
// 	$details = (object) [
// 		'id' => $_POST['add-studentNo'],
// 		'fullName' => strtoupper($_POST['add-lastName']) . ", " . $_POST['add-firstName'] . " " . $_POST['add-middleName'],
// 		'email' => $_POST['add-email'],
// 		'contactNo' => $_POST['add-contactNo'],
// 		'gender' => $_POST['add-gender'],
// 		'program' => $_POST['add-program'],
// 		'specialization' => $_POST['add-specialization'],
// 		'level' => $_POST['add-level'],
// 		'section' => $_POST['add-section'],
// 		'subjects' => $_POST['add-subjects'],
// 	];
// 	echo json_encode((array)$student->addNewStudent($details));
// } elseif (isset($_POST['EDIT_STUDENT_REQ'])) {
// 	$details = (object) [
// 		'id_old' => $_POST['edit-oldStudentNo'],
// 		'id' => $_POST['edit-studentNo'],
// 		'fullName' => $_POST['edit-fullName'],
// 		'email' => $_POST['edit-email'],
// 		'contactNo' => $_POST['edit-contactNo'],
// 		'gender' => $_POST['edit-gender'],
// 		'program' => $_POST['edit-program'],
// 		'specialization' => $_POST['edit-specialization'],
// 		'level' => $_POST['edit-level'],
// 		'section' => $_POST['edit-section'],
// 		'subjects' => $_POST['edit-subjects'],
// 	];
// 	echo json_encode((array)$student->editStudent($details));
// } elseif (isset($_POST['GET_HANDLED_SUBJECT_REQ'])) {
// 	$faculty = new Faculty();
// 	echo json_encode((array)$faculty->getFacultyInfo());
// } elseif (isset($_POST['GET_SECTION_DESTINCT_REQ'])) {
// 	echo json_encode((array)$student->getSections($_POST["program"], $_POST["level"]));
// } elseif (isset($_POST['REMOVE_STUDENT_REQ'])) {
// 	echo json_encode((array)$student->removeStudent($_POST["REMOVE_STUDENT_REQ"]));
// }
