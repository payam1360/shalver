

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
