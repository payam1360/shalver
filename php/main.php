<?php
define("WAIST",   0);
define("THIGH",   1);
define("INSEAM",  2);
define("OUTSEAM", 3);
define("HIP",     4);
define("LEG_OPEN",5);
define("RISE",    6);
define("MAX_ERROR", 1000);
define("NUM_BEST_FIT", 4);


class user {
    
    var $waist;
    var $thigh;
    var $inseam;
    var $outseam;
    var $hip;
    var $leg_open;
    var $rise;

	function set_member($value, $member_num) {
        if($member_num == WAIST) {
			$this->waist = $value;
        }
        if($member_num == THIGH) {
			$this->thigh = $value;
        }
        if($member_num == INSEAM) {
			$this->inseam = $value;
        }
        if($member_num == OUTSEAM) {
			$this->outseam = $value;
        }
        if($member_num == HIP) {
			$this->hip = $value;
        }
        if($member_num == LEG_OPEN) {
			$this->leg_open = $value;
        }
        if($member_num == RISE) {
			$this->rise = $value;
        }
        
    }
    function get_member($member_num) {
        if($member_num == WAIST) {
            return $this->waist;
        }           
        if($member_num == THIGH) {
            return $this->thigh;
        }           
        if($member_num == INSEAM) {
            return $this->inseam;
        }           
        if($member_num == OUTSEAM) {
            return $this->outseam;
        }           
        if($member_num == HIP) {
            return $this->hip;
        }           
        if($member_num == LEG_OPEN) {
            return $this->leg_open;
        }           
        if($member_num == RISE) {
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
            $user_data->set_member( 0.6 * $userthigh, LEG_OPEN);
            $user_data->set_member(($userwaist + $userthigh * 2) * 1.0 * $fit_factor / 2, HIP);
            break;
        case normal:
            $fit_factor      = 1.05;
            $user_data->set_member( 0.8 * $userthigh, LEG_OPEN);
            $user_data->set_member(($userwaist + $userthigh * 2) * 1.2 * $fit_factor / 2, HIP);
            break;
        case loose:
            $fit_factor      = 1.1;
            $user_data->set_member( 0.9 * $userthigh, LEG_OPEN);
            $user_data->set_member(($userwaist + $userthigh * 2) * 1.5 * $fit_factor / 2, HIP);
            break;
        }
    
    $user_data->set_member($fit_factor * $userwaist, WAIST);
    $user_data->set_member($fit_factor * $userthigh, THIGH);
    $user_data->set_member($fit_factor * $userinseam, INSEAM);
    $user_data->set_member($fit_factor * $useroutseam, OUTSEAM);
    $user_data->set_member($fit_factor * ($useroutseam - $userinseam), RISE);
    

    return $user_data;

}


function fetchdata() {

        $servername  = "localhost";
        $loginname   = "root";
        $password    = "Asghar22";
        $dbname      = "Shalver";
        $tablename   = "Brands";
        // Create connection
        $conn        = new mysqli($servername, $loginname, $password, $dbname);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        echo "Connected successfully";
        
        $sql = "SELECT * FROM " . $tablename ;

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // output data of each row
            echo "data retrieved successfully";
        } else {
            echo "0 results";
        }

        $data = array();
        while($row = $result->fetch_assoc()){ 
            $data[] = $row;
        }
        
        $conn->close();
        return $data;
}


function solveLS($Alldata, $user_info, $userpricemin, $userpricemax, $numOutput) {

    
    $waist     = array_column($Alldata, "waist");
    $thigh     = array_column($Alldata, "thigh");
    $inseam    = array_column($Alldata, "inseam");
    $outseam   = array_column($Alldata, "outseam");
    $leg_open  = array_column($Alldata, "leg_open");
    $hip       = array_column($Alldata, "hip");
    $rise      = array_column($Alldata, "rise");
    $price     = array_column($Alldata, "price");
    $M         = count($waist);
    $maxMargin = 0;
    $minMargin = 0;

    $index    = array();
    $error    = MAX_ERROR;
    $count    = 0;
    for($kk = 0; $kk < $M; $kk++) {
        
        $LS      = abs($waist[$kk]    - $user_info->get_member(WAIST    )) ** 2 +
                   abs($thigh[$kk]    - $user_info->get_member(THIGH    )) ** 2 +
                   abs($inseam[$kk]   - $user_info->get_member(INSEAM   )) ** 2 +
                   abs($outseam[$kk]  - $user_info->get_member(OUTSEAM  )) ** 2 +
                   abs($leg_open[$kk] - $user_info->get_member(LEG_OPEN )) ** 2 +
                   abs($hip[$kk]      - $user_info->get_member(HIP      )) ** 2 +
                   abs($rise[$kk]     - $user_info->get_member(RISE     )) ** 2 ;
        if($price[$kk] <= $userpricemax + $maxMargin and $userpricemin - $minMargin <= $price[$kk] ) {
            if($LS < $error) {
                $error = $LS;
                $index[$count % $numOutput] = $kk;
                $count++;
            }
        }
        
    }

    return $index;
    
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
$userpricemax   = $_POST["pricemax"];
$userpricemin   = $_POST["pricemin"];



$dbflag = saveusermeasurementintoDB($userwaist, $userthigh, $userinseam, $useroutseam, $username, $useremail);
if($dbflag == false) {
    echo "user has not registered. no data is saved";
}else{
    echo "user data is saved.";
}

$user_info   = new user;
$user_info   = estimatealluserparams($userwaist, $userthigh, $userinseam, $useroutseam, $userstyle);
$Alldata     = fetchdata();
$bestfit_idx = solveLS($Alldata, $user_info, $userpricemin, $userpricemax, NUM_BEST_FIT); 




?> 