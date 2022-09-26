<?php
include '../../include/autoloader.inc.php';

$grade = new Grade();

if(isset($_POST["GET_GRADE_REQ"])) {
    echo json_encode((array)$grade->getGrades());
}
