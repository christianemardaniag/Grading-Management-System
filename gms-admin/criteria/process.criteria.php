<?php
include '../../include/autoloader.inc.php';

$criteria = new Criteria();

if (isset($_POST['GET_CRITERIA_REQ'])) {
    echo json_encode((array)$criteria->getCriteria());
} else if (isset($_POST['UPDATE_CRITERIA_REQ'])) {
    $data = (object) [
		'1' => $_POST['c1'],
		'2' => $_POST['c2'],
		'3' => $_POST['c3'],
		'4' => $_POST['c4'],
		'5' => $_POST['c5']
	];
    echo json_encode((array)$criteria->updateCriteria($data));
}
