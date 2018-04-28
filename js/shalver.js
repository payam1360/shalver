

// Aux functions
// Copyright Shalver,
// written April 10, 2018

var USERNAME_GLOBAL;
var USEREMAIL_GLOBAL;

function setrange2textbox (slider_number) {

    var sliderval = document.getElementsByClassName("range");
    var outputval = document.getElementsByClassName("measurement-text");
    outputval[slider_number].value = sliderval[slider_number].value;
}

function settextbox2range (textbox_number) {

    var timeout   = null;
    var sliderval = document.getElementsByClassName("range");
    var inputval  = document.getElementsByClassName("measurement-text");
    timeout       = setTimeout(function() {checkuserinput(inputval, textbox_number);}, 2000);
}

function checkuserinput (inputval, textbox_number) {


    var sliderval = document.getElementsByClassName("range");
    if(inputval[textbox_number].value > sliderval[textbox_number].max) {
	inputval[textbox_number].value = sliderval[textbox_number].max;
    }
    else if(inputval[textbox_number].value < sliderval[textbox_number].min) {
	inputval[textbox_number].value = sliderval[textbox_number].min;
    }else {
    sliderval[textbox_number].value = inputval[textbox_number].value;
    }
    
}


function clearforms() {

    var sliderval = document.getElementsByClassName("range");
    var inputval  = document.getElementsByClassName("measurement-text");
    var radioval  = document.getElementsByClassName("radioButton");
    
    
    for(var kk = 0; kk < inputval.length; kk++) {
	inputval[kk].value = "";
    }
    for(var kk = 0; kk < sliderval.length; kk++) {
	sliderval[kk].value = sliderval[kk].placeholder;
    }
    for(var kk = 0; kk < radioval.length; kk++) {
	radioval[kk].checked = false;
    }
}

function submitlogin() {



    var inputval  = document.getElementsByClassName("signuptext");
    if(inputval[0].value == "" || inputval[1].value == "") {
	return;
    } else {
	USERNAME_GLOBAL   = inputval[0].value;
	USEREMAIL_GLOBAL  = inputval[1].value;
	inputval[0].value = "";
	inputval[1].value = "";
    }

    document.getElementById("askforsignup").innerHTML = "";
    document.getElementById("txtName").innerHTML = "Hi " + USERNAME_GLOBAL;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("txtName").innerHTML =
		document.getElementById("txtName").innerHTML +
		". Let's get started :)";
        }
    };    
    xmlhttp.open("POST", "php/SaveUserCredentials.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("username="+USERNAME_GLOBAL+"&useremail="+USEREMAIL_GLOBAL);

}

function returnstyle() {
    var styleval  = document.getElementsByClassName("radioButton");
    for(var kk = 0; kk < styleval.length; kk++) {
	if(styleval[kk].checked == true) {
	    var style = styleval[kk].value;
	}
    }
    return style;
}

function submituserdata() {

    var inputval  = document.getElementsByClassName("measurement-text");
    var style     = returnstyle();
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
	    console.log(JSON.parse(this.response));
        }
    };

    // sending the request
    xmlhttp.open("POST", "php/main.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    var userdata = "userwaist="+inputval[0].value+"&userthigh="+inputval[1].value+
	"&userinseam="+inputval[2].value+"&useroutseam="+inputval[3].value
	+"&username="+USERNAME_GLOBAL+"&useremail="+USEREMAIL_GLOBAL+
	"&userstyle="+style+"&pricemin="+inputval[4].value+"&pricemax="+inputval[5].value;
    
    xmlhttp.send(userdata);

}
