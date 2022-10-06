<?php
include '../../include/autoloader.inc.php';
// print_r($_SESSION);
// if (!isset($_SESSION[FACULTY])) {
//     echo true;
//     exit();
// }
// $faculty = new Faculty($_SESSION[FACULTY]);

// PROFILE
if (isset($_POST['getInfo'])) {
    echo json_encode((array)$faculty->getFacultyInfo());
} elseif (isset($_POST['setInfo'])) {
    $info = $faculty->getFacultyInfo();

    // if ($_POST['password'] == $info->password) {
    //     if (isset($_POST['newPassword'])) {
    //         $newPassword = $_POST['newPassword'];
    //         if ($newPassword == $_POST['confirmPassword']) {
    //             $faculty->setPassword($newPassword);
    //         } else {
    //             echo json_encode(array(
    //                 "status" => false,
    //                 "msg" => 'Incorrect Password!'
    //             ));
    //             exit();
    //         }
    //     }
    //     $newInfo = (object) [
    //         'username' => $_POST['username'],
    //         'email' => $_POST['email'],
    //     ];
    //     echo json_encode((array) $faculty->setInfo($newInfo));
    // } else {
    //     echo json_encode(array(
    //         "status" => false,
    //         "msg" => 'Incorrect Password!'
    //     ));
    // }
}
