
//<?php

//$username = $_POST["username"];
//$useremail= $_POST["useremail"];
//$z = array("username"=>$username, "useremail"=>$useremail);
//$p = json_encode($z);
//echo $p;

//?>


 <?php
$servername = "localhost";
$username = "root";
$password = "Asghar22";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
$conn->close();
?> 