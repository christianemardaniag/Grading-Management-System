<?php 
include '../../include/autoloader.inc.php';
$faculty = new Faculty();
if (isset($_POST['faculty'])) {
    echo json_encode((array)$faculty->getFacultyInfo());
}


