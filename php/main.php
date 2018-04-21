<?php

// Aux functions definitions

function checknameexists($username, $useremail) {
    if($username == "" or $useremail == "") {
        return false; }
    else {
        return true;
    }   
}



function saveinfointoDB($userwaist, $userthigh, $userinseam, $useroutseam, $username, $useremail) {

    $dbrecexist = checknameexists($username, $useremail);
    if($dbrecexist == false) {
        return false;
    } else {
       
        $servername = "localhost";
        $loginname   = "root";
        $password   = "Asghar22";
        $dbname     = "Shalver";
        $table1name  = "Users";
        // Create connection
        $conn = new mysqli($servername, $loginname, $password, $dbname);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        echo "Connected successfully";
        
        $sql = "UPDATE " . $table1name .
            " SET waist = " . $userwaist . ", thigh = " . $userthigh .
            ", inseam = ". $userinseam . ", outseam = ".  $useroutseam . 
            " WHERE username = '" . $username .
            "' AND email = '" . $useremail . "';";

        echo $sql;

        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        $conn->close();
    }
    return true;
}

/// -------------------------
/// main routin starts here.
/// -------------------------
$userwaist      = $_POST["userwaist"];
$userthigh      = $_POST["userthigh"];     
$userinseam     = $_POST["userinseam"];
$useroutseam    = $_POST["useroutseam"];     
$username       = $_POST["username"];
$useremail      = $_POST["useremail"];

$dbflag = saveinfointoDB($userwaist, $userthigh, $userinseam, $useroutseam, $username, $useremail);






?> 