<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

include '../include/autoloader.inc.php';

if (isset($_POST['login'])) { 
    $userType = $_POST['login'];
    $login = new Login($userType, $_POST['username'], $_POST['password']);
    echo json_encode((array)$login->getResponse());
} 
elseif (isset($_POST['forgot-password'])) {
    $userType = $_POST['forgot-password'];
    $mail = new Mail($userType);
    echo json_encode((array)$mail->sendNewPassword($_POST['email']));
}


