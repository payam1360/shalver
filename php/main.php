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
define("DBG", false);

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
       
        $servername  = "127.0.0.1";
        $loginname   = "root";
        $password    = "@Brcm123";
        $dbname      = "Shalver";
        $table1name  = "Users";
        // Create connection
        $conn        = new mysqli($servername, $loginname, $password, $dbname);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        if(DBG) {
            echo "Connected successfully";
        }
        
        $sql = "UPDATE " . $table1name .
            " SET waist = " . $userwaist . ", thigh = " . $userthigh .
            ", inseam = ". $userinseam . ", outseam = ".  $useroutseam . 
            " WHERE username = '" . $username .
            "' AND email = '" . $useremail . "';";
        if(DBG) {
            echo $sql;
        }
        
        if ($conn->query($sql) === TRUE and DBG) {
            echo "New record created successfully";
        } elseif(DBG) {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        $conn->close();
    }
    return true;
}



function estimatealluserparams($userwaist, $userthigh, $userinseam, $useroutseam, $userstyle) {

    $user_data = new user;

    
    switch ($userstyle) {

        case 'skinny':
            $fit_factor      = 1.0;
            $user_data->set_member( 0.6 * $userthigh, LEG_OPEN);
            $user_data->set_member(($userwaist + $userthigh * 2) * 1.0 * $fit_factor / 2, HIP);
            break;
        case 'normal':
            $fit_factor      = 1.01;
            $user_data->set_member( 0.8 * $userthigh, LEG_OPEN);
            $user_data->set_member(($userwaist + $userthigh * 2) * 1.05 * $fit_factor / 2, HIP);
            break;
        case 'loose':
            $fit_factor      = 1.05;
            $user_data->set_member( 0.9 * $userthigh, LEG_OPEN);
            $user_data->set_member(($userwaist + $userthigh * 2) * 1.1 * $fit_factor / 2, HIP);
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

        $servername  = "127.0.0.1";
        $loginname   = "root";
        $password    = "@Brcm123";
        $dbname      = "Shalver";
        $tablename   = "Brands";
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
            echo "data retrieved successfully from Brands table";
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


function solveLS($Alldata, $user_info, $userpricemin, $userpricemax, $numOutput) {


    // defining the weights
    $w_waist     = 0.25;
    $w_thigh     = 0.15;
    $w_inseam    = 0.25;
    $w_outseam   = 0.05;
    $w_leg_open  = 0.10;
    $w_hip       = 0.15;
    $w_rise      = 0.05;

    
    
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
    $error    = array();
    for($kx = 0; $kx < $numOutput; $kx++) {
      $error[$kx] =  MAX_ERROR;
    }

    for($kk = 0; $kk < $M; $kk++) {
        
        
        
        $LS      = $w_waist    * abs($waist[$kk]    - $user_info->get_member(WAIST    )) ** 2 +
                   $w_thigh    * abs($thigh[$kk]    - $user_info->get_member(THIGH    )) ** 2 +
                   $w_inseam   * abs($inseam[$kk]   - $user_info->get_member(INSEAM   )) ** 2 +
                   $w_outseam  * abs($outseam[$kk]  - $user_info->get_member(OUTSEAM  )) ** 2 +
                   $w_leg_open * abs($leg_open[$kk] - $user_info->get_member(LEG_OPEN )) ** 2 +
                   $w_hip      * abs($hip[$kk]      - $user_info->get_member(HIP      )) ** 2 +
                   $w_rise     * abs($rise[$kk]     - $user_info->get_member(RISE     )) ** 2 ;
        if($price[$kk] <= $userpricemax + $maxMargin and $userpricemin - $minMargin <= $price[$kk] ) {
            for($kx = 0; $kx < $numOutput; $kx++) {
                if($LS < $error[$kx] and $error[$kx] == max($error)) {
                    $error[$kx] = $LS;
                    $index[$kx] = $kk;
                    break;
                }
            }
        }
    }


    return $index;
    
}


function calculateFigureofMerit($Alldata, $user_info, $userpricemin, $userpricemax){

    // defining the weights
    $w_waist     = 0.25;
    $w_thigh     = 0.15;
    $w_inseam    = 0.25;
    $w_outseam   = 0.05;
    $w_leg_open  = 0.10;
    $w_hip       = 0.15;
    $w_rise      = 0.05;
    $price_w     = 0.2;
    
    $waist     = array_column($Alldata, "waist");
    $thigh     = array_column($Alldata, "thigh");
    $inseam    = array_column($Alldata, "inseam");
    $outseam   = array_column($Alldata, "outseam");
    $leg_open  = array_column($Alldata, "leg_open");
    $hip       = array_column($Alldata, "hip");
    $rise      = array_column($Alldata, "rise");
    $price     = array_column($Alldata, "price");
    $M         = count($waist);
    $mean_user_price = ($userpricemin + $userpricemax) / 2;
    
    $figureofmerit = array();

    // calculating the user figure of merit as well:
    $userfigureofmerit =  $w_waist    * $user_info->get_member(WAIST    )  +
                          $w_thigh    * $user_info->get_member(THIGH    )  +
                          $w_inseam   * $user_info->get_member(INSEAM   )  +
                          $w_outseam  * $user_info->get_member(OUTSEAM  )  +
                          $w_leg_open * $user_info->get_member(LEG_OPEN )  +
                          $w_hip      * $user_info->get_member(HIP      )  +
                          $w_rise     * $user_info->get_member(RISE     )  +
                          $price_w    * $mean_user_price ;

    
    for($kk = 0; $kk < $M; $kk++) {

        $sign  =  $w_waist    * ($waist[$kk]    - $user_info->get_member(WAIST    )) +
                  $w_thigh    * ($thigh[$kk]    - $user_info->get_member(THIGH    )) +
                  $w_inseam   * ($inseam[$kk]   - $user_info->get_member(INSEAM   )) +
                  $w_outseam  * ($outseam[$kk]  - $user_info->get_member(OUTSEAM  )) +
                  $w_leg_open * ($leg_open[$kk] - $user_info->get_member(LEG_OPEN )) +
                  $w_hip      * ($hip[$kk]      - $user_info->get_member(HIP      )) +
                  $w_rise     * ($rise[$kk]     - $user_info->get_member(RISE     )) ;
        
        if($sign < 0) {
            $sign = -0.5;
        }
        else {
            $sign = 0.5;
        }


         $hamming_distance  =  $w_waist    * ($waist[$kk]    - $user_info->get_member(WAIST    )) ** 2 +
                               $w_thigh    * ($thigh[$kk]    - $user_info->get_member(THIGH    )) ** 2 +
                               $w_inseam   * ($inseam[$kk]   - $user_info->get_member(INSEAM   )) ** 2 +
                               $w_outseam  * ($outseam[$kk]  - $user_info->get_member(OUTSEAM  )) ** 2 +
                               $w_leg_open * ($leg_open[$kk] - $user_info->get_member(LEG_OPEN )) ** 2 +
                               $w_hip      * ($hip[$kk]      - $user_info->get_member(HIP      )) ** 2 +
                               $w_rise     * ($rise[$kk]     - $user_info->get_member(RISE     )) ** 2 ;
        
       $figureofmerit[$kk] = $userfigureofmerit + $sign * ($hamming_distance + $price_w * $price[$kk]);

    }



    // appending at the end of the merit vector
    $figureofmerit[$M] = $userfigureofmerit;

    
    return $figureofmerit;

}


function CreateBlob4Js($Alldata, $figureMerit, $bestfit_idx, $userpricemax, $userpricemin, $username) {

    $Blob   = array();
    $M      = count($figureMerit);
    $N      = count($bestfit_idx);
    $price  = array_column($Alldata, "price");
    $brand  = array_column($Alldata, "brand");    
    $link   = array_column($Alldata, "web_link");

    
    for($kk = 0; $kk < $M - 1; $kk++) {
        $isbest = false;
        for($kx = 0; $kx < $N; $kx++) {
            if($kk == $bestfit_idx[$kx]) {
                $isbest = true;
                break;
            }
        }
        $Blob[$kk] = array("price"   => (float)$price[$kk],
                           "merit"   => $figureMerit[$kk],
                           "brand"   => $brand[$kk],
                           "bestfit" => $isbest,
                           "link"    => $link[$kk] );
    }

    $userprice = ($userpricemax + $userpricemin) / 2;
    $Blob[$M - 1] = array("price"   => $userprice,
                          "merit"   => $figureMerit[$M-1],
                          "brand"   => $username,
                          "bestfit" => true,
                          "link"    => "");
    
    return $Blob;
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

if($dbflag == false and DBG) {
    echo "user has not registered. no data is saved";
}elseif(DBG){
    echo "user data is saved.\n";
}

$user_info   = new user;
$user_info   = estimatealluserparams($userwaist, $userthigh, $userinseam, $useroutseam, $userstyle);
$Alldata     = fetchdata();
$bestfit_idx = solveLS($Alldata, $user_info, $userpricemin, $userpricemax, NUM_BEST_FIT);
$figureMerit = calculateFigureofMerit($Alldata, $user_info, $userpricemin, $userpricemax);
$DataBlob    = CreateBlob4Js($Alldata, $figureMerit, $bestfit_idx, $userpricemax, $userpricemin, $username);


echo json_encode($DataBlob);


?> 
