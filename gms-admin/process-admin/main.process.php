<?php
include '../../include/autoloader.inc.php';

if (isset($_POST['login-admin'])) {
    $login = new Login(ADMIN, $_POST['username'], $_POST['password']);
    echo json_encode((array)$login->getResponse());
} 
elseif (isset($_POST['forgot-password-admin'])) {
    $mail = new Mail(ADMIN);
    echo json_encode((array)$mail->sendNewPassword($_POST['email']));
}
// else {
//     echo json_encode(array(
//         "status" => false,
//         'msg' => "ERRORRRRR!!"
//     ));
// }
