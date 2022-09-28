<?php
include '../../include/autoloader.inc.php';

$student = new Student();
if (isset($_POST['GET_STUDENTS_REQ'])) {
    echo json_encode((array)$student->getStudentInfo());
} elseif (isset($_FILES['fileUpload'])) {
    $fileName = $_FILES['fileUpload']['tmp_name'];
	if ($xlsx = SimpleXLSX::parse("$fileName")) {
		$dim = $xlsx->dimension();
		$cols = $dim[0];
        echo json_encode((array)$xlsx->rows());
	} else {
		echo SimpleXLSX::parseError();
	}
} elseif (isset($_POST['uploadFileToDB'])) {
    echo json_encode((array)$student->addStudentFromFile($_POST['uploadFileToDB']));
} elseif (isset($_POST['ADD_STUDENT_REQ'])) {
	$details = (object) [
		'id' => $_POST['add-studentNo'],
		'fullName' => strtoupper($_POST['add-lastName']) .", ". $_POST['add-firstName'] . " " . $_POST['add-middleName'],
		'email' => $_POST['add-email'],
		'contactNo' => $_POST['add-contactNo'],
		'gender' => $_POST['add-gender'],
		'program' => $_POST['add-program'],
		'specialization' => $_POST['add-specialization'],
		'level' => $_POST['add-level'],
		'section' => $_POST['add-section'],
		'subjects' => $_POST['add-subjects'],
	];
    echo json_encode((array)$student->addNewStudent($details));
} elseif (isset($_POST['GET_PROGRAM_DESTINCT_REQ'])) {
    echo json_encode((array)$student->getDestinctProgram());
} elseif (isset($_POST['GET_SECTION_DESTINCT_REQ'])) {
    echo json_encode((array)$student->getSections($_POST["program"], $_POST["level"]));
}


