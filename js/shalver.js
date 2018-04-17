

// Aux functions
// Copyright Shalver,
// written April 10, 2018

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
    for(var kk = 0; kk < inputval.length; kk++) {
	inputval[kk].value = "";
    }
    for(var kk = 0; kk < sliderval.length; kk++) {
	sliderval[kk].value = sliderval[kk].placeholder;
    }
}

function submitlogin() {



    var inputval  = document.getElementsByClassName("signuptext");
    if(inputval[0].value == "" || inputval[1].value == "") {
	return;
    } else {
	var username  = inputval[0].value;
	var useremail = inputval[1].value;
	inputval[0].value = "";
	inputval[1].value = "";
    }

    document.getElementById("askforsignup").innerHTML = "";
    document.getElementById("txtName").innerHTML = "Hi " + username;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("txtName").innerHTML =
		document.getElementById("txtName").innerHTML +
		". Let's get started :)";
	    console.log(JSON.parse(this.responseText));
        }
    };    
    xmlhttp.open("POST", "php/SaveUserCredentials.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("username="+username+"&useremail="+useremail);

    
}
