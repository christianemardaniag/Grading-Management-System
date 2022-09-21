<?php
include '../../include/autoloader.inc.php';

$student = new Student();
if (isset($_POST['student'])) {
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
} elseif (isset($_POST['addNewStudent'])) {
	$details = (object) [
		'id' => $_POST['employeeNo'],
		'firstName' => $_POST['firstName'],
		'middleName' => $_POST['middleName'],
		'lastName' => $_POST['lastName'],
		'email' => $_POST['email'],
		'contact_no' => $_POST['contact_no']
	];
    echo json_encode((array)$student->addNewStudent($details));
} 


