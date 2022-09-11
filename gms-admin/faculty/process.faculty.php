<?php
include '../../include/autoloader.inc.php';

$faculty = new Faculty();
if (isset($_POST['faculty'])) {
    echo json_encode((array)$faculty->getFacultyInfo());
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
    echo json_encode((array)$faculty->addFacultyFromFile($_POST['uploadFileToDB']));
    // echo $faculty->addFacultyFromFile($_POST['uploadFileToDB']);
} 


