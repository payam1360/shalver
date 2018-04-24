<?php


class user {
    
    var $waist;
    var $thigh;
    var $inseam;
    var $outseam;
    var $hip;
    var $leg_open;
    var $rise;

	function set_member($value, $member_num) {
        if($member_num == 0) {
			$this->waist = $value;
        }
        if($member_num == 1) {
			$this->thigh = $value;
        }
        if($member_num == 2) {
			$this->inseam = $value;
        }
        if($member_num == 3) {
			$this->outseam = $value;
        }
        if($member_num == 4) {
			$this->hip = $value;
        }
        if($member_num == 5) {
			$this->leg_open = $value;
        }
        if($member_num == 6) {
			$this->rise = $value;
        }
        
    }
    function get_member($member_num) {
        if($member_num == 0) {
            return $this->waist;
        }           
        if($member_num == 1) {
            return $this->thigh;
        }           
        if($member_num == 2) {
            return $this->inseam;
        }           
        if($member_num == 3) {
            return $this->outseam;
        }           
        if($member_num == 4) {
            return $this->hip;
        }           
        if($member_num == 5) {
            return $this->leg_open;
        }           
        if($member_num == 6) {
            return $this->rise;
        }           
		
    }

    
};


// Aux functions definitions

function checknameexists($username, $useremail) {
    if($username == "" or $useremail == "") {
        return false; }
    else {
        return true;
    }   
}



function saveusermeasurementintoDB($userwaist, $userthigh, $userinseam, $useroutseam, $username, $useremail) {

    $dbrecexist = checknameexists($username, $useremail);
    if($dbrecexist == false) {
        return false;
    } else {
       
        $servername  = "localhost";
        $loginname   = "root";
        $password    = "Asghar22";
        $dbname      = "Shalver";
        $table1name  = "Users";
        // Create connection
        $conn        = new mysqli($servername, $loginname, $password, $dbname);
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



function estimatealluserparams($userwaist, $userthigh, $userinseam, $useroutseam, $userstyle) {

    $user_data = new user;

    
    switch ($userstyle) {

        case skinny:
            $fit_factor      = 1.0;
            $user_data->set_member( 0.6 * $userthigh, 5);
            $user_data->set_member(($userwaist + $userthigh * 2) * 1.0 * $fit_factor / 2, 4);
            break;
        case normal:
            $fit_factor      = 1.05;
            $user_data->set_member( 0.8 * $userthigh, 5);
            $user_data->set_member(($userwaist + $userthigh * 2) * 1.2 * $fit_factor / 2, 4);
            break;
        case loose:
            $fit_factor      = 1.1;
            $user_data->set_member( 0.9 * $userthigh, 5);
            $user_data->set_member(($userwaist + $userthigh * 2) * 1.5 * $fit_factor / 2, 4);
            break;
        }
    
    $user_data->set_member($fit_factor * $userwaist, 0);
    $user_data->set_member($fit_factor * $userthigh, 1);
    $user_data->set_member($fit_factor * $userinseam, 2);
    $user_data->set_member($fit_factor * $useroutseam, 3);
    $user_data->set_member($fit_factor * ($useroutseam - $userinseam), 6);
    

    return $user_data;

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
$userstyle      = $_POST["userstyle"];


$dbflag = saveusermeasurementintoDB($userwaist, $userthigh, $userinseam, $useroutseam, $username, $useremail);
if($dbflag == false) {
    echo "user has not registered. no data is saved";
}else{
    echo "user data is saved.";
}

$user_info = new user;
$user_info = estimatealluserparams($userwaist, $userthigh, $userinseam, $useroutseam, $userstyle);


?> 