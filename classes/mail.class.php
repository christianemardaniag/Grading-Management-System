<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class Mail extends dbHandler
{
    private $mail;
    private $userType;
    private const SERVER_EMAIL = 'the_back_end@outlook.ph';

    function __construct($userType)
    {
        parent::__construct();
        $this->userType = $userType;
        $this->mail = new PHPMailer(true);

        $this->mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $this->mail->isSMTP();
        $this->mail->Host       = 'smtp.office365.com';
        $this->mail->SMTPAuth   = true;
        $this->mail->Username   = self::SERVER_EMAIL;
        $this->mail->Password   = 'hannaqt1722';
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mail->Port       = 587;
    }

    public function sendMail($recipient, $subject, $body)
    {
        try {
            $this->mail->setFrom(self::SERVER_EMAIL, 'Grading Management System');
            $this->mail->addAddress($recipient);
            $this->mail->isHTML(true);
            $this->mail->Subject = $subject;
            $this->mail->Body    = $body;
            $this->mail->send();
            return (object) [
                'status' => true,
                'msg' => 'Your new password has been sent to your email address'
            ];
        } catch (Exception $e) {
            return (object) [
                'status' => false,
                'msg' => 'Message could not be sent. Mailer Error: {' . $this->mail->ErrorInfo . '}'
            ];
        }
    }

    public function sendNewPassword($recipient)
    {
        if ($id = $this->isEmailRegistered($recipient)) {
            $newPassword = $this->generateRandomPassword();
            $body = " <table><tbody>";
            $body .= "<tr><td style='background-color: rgb(58, 26, 14); color: white; padding: 10px 10px; font-size: 20px; font-weight: 600;'>Grading Management System</td></tr>";
            $body .= "<tr><td>";
            $body .= "<h3>Good day!</h3>";
            $body .= "<p style='font-size: 20px;'>We have successfully reset your password</p>";
            $body .= "<p>You may now sign in to the Grading Management System using the information below :</p>";
            $body .= "</td></tr>";
            $body .= "<tr><td>";
            $body .= "<div>username: [your-email-address]</div>";
            $body .= "<div>password: <b>$newPassword</b></div>";
            $body .= "</td></tr>";
            $body .= "<tr><td><i>*Note:Please check your spelling and case.</i></td></tr>";
            $body .= "</tbody></table>";
            $this->sendMail($recipient, "GCM Online : Reset Password", $body);
            $this->updatePassword($id, $newPassword);
        } else {
            return (object) [
                'status' => false,
                'msg' => 'You have entered unregistered email address!'
            ];
        }
    }

    private function generateRandomPassword(): string
    {
        $data = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcefghijklmnopqrstuvwxyz!@#$%&*';
        return substr(str_shuffle($data), 0, 8);
    }

    private function isEmailRegistered($email): string
    {
        $query = "SELECT id FROM $this->userType WHERE email='$email'";
        $result = mysqli_query($this->conn, $query);
        if (mysqli_num_rows($result)) {
            $row = mysqli_fetch_assoc($result);
            return $row['id'];
        }
        return false;
    }

    private function updatePassword($id, $newPass)
    {
        $query = "UPDATE $this->userType SET `password`='$newPass' WHERE `id`='$id'";
        return mysqli_query($this->conn, $query);
    }
    
}
