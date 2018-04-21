
<?php
$servername = "localhost";
$username   = "root";
$password   = "Asghar22";
$dbname     = "Shalver";
$tablename  = "Users";
$firstname  = $_POST["username"];
$useremail  = $_POST["useremail"];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";


$sql = "INSERT INTO " . $tablename . " (username, email) VALUES ('". $firstname . "', '" . $useremail . "')";


echo $sql;

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
    
$conn->close();
?> 