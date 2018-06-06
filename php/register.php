
<?php

define(DBG, false);


function fetchuserdata() {

        $servername  = "localhost";
        $loginname   = "root";
        $password    = "Asghar22";
        $dbname      = "Shalver";
        $tablename   = "Users";
        // Create connection
        $conn        = new mysqli($servername, $loginname, $password, $dbname);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        if(DBG) {
            echo "Connected successfully";
        }
        $sql = "SELECT * FROM " . $tablename ;

        $result = $conn->query($sql);

        if ($result->num_rows > 0 and DBG) {
            // output data of each row
            echo "data retrieved successfully";
        } elseif(DBG) {
            echo "0 results";
        }

        $data = array();
        while($row = $result->fetch_assoc()){ 
            $data[] = $row;
        }
        
        $conn->close();
        return $data;

}

function checknames($usersInfo, $username, $useremail) {

    $allusernames     = array_column($usersInfo, "username");
    $allemails        = array_column($usersInfo, "email");
    $allwaist         = array_column($usersInfo, "waist");
    $allthigh         = array_column($usersInfo, "thigh");
    $allinseam        = array_column($usersInfo, "inseam");
    $alloutseam       = array_column($usersInfo, "outseam");
    
    $M                = count($allusernames);
    $flag             = false;
    $results          = ["flag" => $flag];
    for($kk = 0; $kk < $M; $kk++) {
        if($allusernames[$kk] == $username and $allemails[$kk] == $useremail ) {
            $flag = true;
            $results = ["flag" => $flag, "waist" => $allwaist[$kk],
            "thigh" => $allthigh[$kk], "inseam" => $allinseam[$kk],
            "outseam" => $alloutseam[$kk]];       
            break;
        }
    }

    return $results;
}


function register_user($firstname, $useremail) {
    
    $servername = "localhost";
    $username   = "root";
    $password   = "Asghar22";
    $dbname     = "Shalver";
    $tablename  = "Users";


// Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    if(DBG) {
        echo "Connected successfully";
    }


    $sql = "INSERT INTO " . $tablename . " (username, email) VALUES ('". $firstname . "', '" . $useremail . "')";

    if(DBG) {
        echo $sql;
    }

    if ($conn->query($sql) === TRUE and DBG) {
        echo "New record created successfully";
    } else if (DBG){
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    
    $conn->close();
}






$username       = $_POST["username"];
$useremail      = $_POST["useremail"];
$AllusersData   = fetchuserdata();
$results        = checknames($AllusersData, $username, $useremail);
if($results["flag"] == false) {
    register_user($username, $useremail);
}
echo json_encode($results);


?> 