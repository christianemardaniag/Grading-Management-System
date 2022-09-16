<?php
include '../../include/autoloader.inc.php';

$subject = new Subject();
if (isset($_POST['subject'])) {
    echo json_encode((array)$subject->getAllSubject());
}
