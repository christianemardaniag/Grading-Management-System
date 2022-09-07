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
                'msg' => 'Message could not be sent. Mailer Error: {$this->mail->ErrorInfo}'
            ];
        }
    }

    public function sendNewPassword($recipient)
    {
        if ($this->isEmailRegistered($recipient)) {
            $body = $this->generateRandomPassword();
            $this->sendMail($recipient, "Forgot Password", $body);
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

    private function isEmailRegistered($email): bool
    {
        $query = "SELECT id FROM $this->userType WHERE email='$email'";
        $result = mysqli_query($this->conn, $query);
        return mysqli_num_rows($result);
    }
}
