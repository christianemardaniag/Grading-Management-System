<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="include/main.style.css">
</head>

<body>
   <?php 
    session_start();
    print_r($_SESSION);
   ?>
   <a href="gms-admin">admin</a>
   <a href="gms-faculty">faculty</a>
</body>

</html>
