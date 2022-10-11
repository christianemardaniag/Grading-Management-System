<?php
include '../../include/autoloader.inc.php';

$grade = new Grade();

if(isset($_POST["GET_GRADE_REQ"])) {
    echo json_encode((array)$grade->getGrades());
} elseif (isset($_FILES['fileUpload'])) {
	$fileName = $_FILES['fileUpload']['tmp_name'];
	if ($xlsx = SimpleXLSX::parse("$fileName")) {
		$dim = $xlsx->dimension();
		$cols = $dim[0];
		echo json_encode((array)$xlsx->rows());
	} else {
		echo SimpleXLSX::parseError();
	}
} elseif (isset($_POST['UPLOAD_FILE_REQ'])) {
	echo json_encode((array)$grade->addClassRecordFromFile($_POST['UPLOAD_FILE_REQ']));
}
