

// Aux functions
// Copyright Shalver,
// written April 10, 2018

var USERNAME_GLOBAL;
var USEREMAIL_GLOBAL;
var SLIDE_IDX = 1;
var timeOutSlider = null;

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

function loadusermeasurements(Response) {

    var inputval  = document.getElementsByClassName("measurement-text");
    var sliderval = document.getElementsByClassName("range");
    var userwaist = Response.waist;
    if(userwaist == null) {
	inputval[0].value = "";
	sliderval[0].value = sliderval[0].placeholder;
    } else {
	inputval[0].value = userwaist;
	settextbox2range(0);
    }
    var userthigh = Response.thigh;
    if(userthigh == null) {
	inputval[1].value = "";
	sliderval[1].value = sliderval[1].placeholder;	
    } else {
	inputval[1].value = userthigh;
	settextbox2range(1);
    }
    var userinseam = Response.inseam;
    if(userinseam == null) {
	sliderval[2].value = sliderval[2].placeholder;
	inputval[2].value = "";
    } else {
	inputval[2].value = userinseam;
	settextbox2range(2);
    }

    
    var useroutseam = Response.outseam;
    if(useroutseam == null) {
	sliderval[3].value = sliderval[3].placeholder;
	inputval[3].value = "";
    } else {
	inputval[3].value = useroutseam;
	settextbox2range(3);
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

    var svg = d3.select("svg");
    svg.selectAll("*").remove();


    d3.select("div.results").style("opacity", 0);
    d3.select("div.plot").style("opacity", 0);
    d3.selectAll("div.gallery").style("opacity", 0);    
    
}


function  unlockTheTool() {

    var measure = d3.selectAll(".Measurements");
    measure
	.transition()
	.duration(1000)
	.style("opacity", 1);
    var submit = d3.select(".submitButton");
    submit
	.transition()
	.duration(1000)
	.style("opacity", 1);
    var clear = d3.select(".clearButton");
    clear
	.transition()
	.duration(1000)
	.style("opacity", 1);
    
    
}

function transit2greeting() {

    var signupbox = d3.select(".signuptextstyle");


    signupbox
	.selectAll(".navigation-bar")
	.remove();    

    signupbox
	.selectAll(".txtName")
	.remove();
 
    
    signupbox
	.transition()
	.duration(1000)
	.style("width", "0px")
    	.style("height", "0px")
	.style("margin-top", "40px")

    greeting = d3.select(".greeting")
	.append("div")
	.attr("class", "txtName")
    	.transition()
	.duration(2000)
	.style("color", "coral")
	.style("text-align","center");
    
}


function checknameandemail(inputval) {
    var flag;
    if(inputval[0].value == "" || inputval[1].value == "") {
	flag = false;
	return flag;
    } else {
	re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	im = /^[a-zA-Z ]{2,30}$/;
	var flag1 = re.test(inputval[1].value);
	var flag2 = im.test(inputval[0].value);
	flag = flag1 && flag2; 
	return flag;
    }
}



function submitlogin() {

    var inputval  = document.getElementsByClassName("signuptext");
    var flag      = checknameandemail(inputval);
    if(flag == false) {
	document.getElementsByClassName("txtName")[0].innerHTML = "Invalid name or email !";
	return;
    } else {
	USERNAME_GLOBAL   = inputval[0].value;
	USEREMAIL_GLOBAL  = inputval[1].value;
	setCookie("shalverusername", USERNAME_GLOBAL, 365);
	setCookie("shalveruseremail", USEREMAIL_GLOBAL, 365);
	inputval[0].value = "";
	inputval[1].value = "";
    
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
		console.log(this);
//		var Response = JSON.parse(this.response);
/*		if(Response.flag == true) {
		    transit2greeting();
		    loadusermeasurements(Response);
		    unlockTheTool();
		    document.getElementsByClassName("txtName")[0].innerHTML = "Welcome back "
			+ USERNAME_GLOBAL + ". Your sizes are loaded.";
		} else if(Response.flag == false) {
		    transit2greeting();
		    clearforms();
		    document.getElementsByClassName("txtName")[0].innerHTML = "Hi " + USERNAME_GLOBAL +
			". Let's get started :)";
		    unlockTheTool();
		}
*/
	    }
	};
	xmlhttp.open("POST", "php/register.php", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("username="+USERNAME_GLOBAL+"&useremail="+USEREMAIL_GLOBAL);
    }
}





function returnstyle() {
    var styleval  = document.getElementsByClassName("radioButton");
    var style = "";
    for(var kk = 0; kk < styleval.length; kk++) {
	if(styleval[kk].checked == true) {
	    style = styleval[kk].value;
	}
    }
    return style;
}


function presentResults(data) {

    d3.select("div.plot")
    	.transition()
	.duration(1000)
	.style("opacity", 1);

    d3.select(".xLabel")
    	.transition()
	.duration(1000)
	.style("opacity", 1);
    
    d3.select(".yLabel")
    	.transition()
	.duration(1000)
	.style("opacity", 1);

    
    d3.select("div.results")
	.transition()
	.duration(2000)
	.style("opacity", 1)
	.text("here is the list of brands and sizes that fits you the best for your buck.");

    var picked       = [];
    for(var kk = 0; kk < data.length; kk++) {
	if(data[kk]["bestfit"] == true && data[kk]["link"] != "") {
	    picked.push(data[kk]);
	}
    }

    
    var top = d3.select("div.result-container");
    top.selectAll("*").remove();
    
    
    var wrapper = d3.select("div.result-container");
    var top     = wrapper.selectAll("gallery")
	.data(picked);
    
    var gal     = top
    	.enter()
	.append("div")
	.attr("class", "gallery");

    gal
    	.append("div")
	.attr("class", "img")
	.append("a")
	.attr("xlink:href", function(d) {return d["link"]})
	.append("img")
	.attr("src", function(d) {return "img/" + d["brand"].replace(/\s/g, "") + ".jpg"})
	.attr("width", 150)
	.attr("height", 150);

    gal
	.append("div")
	.attr("class", "desc")
	.html(function(d) {return d["link"] + " price: " + d["price"]});


    d3.selectAll("div.gallery")
        .transition()
	.duration(3000)
	.style("opacity", 1);


    
}


function plot(data) {

    var svg = d3.select("svg");
    svg.selectAll("*").remove();
    
    var svg     = d3.select("svg"),
    width       = svg.attr("width"),
    height      = svg.attr("height");

    var price       = returnColumn(data, "price");
    var figureMerit = returnColumn(data, "merit");
    var xScale  = d3.scaleLinear()
                    .domain([d3.min(figureMerit), d3.max(figureMerit)])
                    .range([0, width]);
    var yScale  = d3.scaleLinear()
                    .domain([d3.min(price), d3.max(price)])
                    .range([height, 0]);


    var xAxis = d3.axisTop(xScale).ticks(8),
        yAxis = d3.axisRight(yScale).ticks(8 * height / width);
    
    
    var div = d3.select("body").append("div")	
	.attr("class", "tooltip")				
	.style("opacity", 0);


    
    var gx = svg.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + (height) + ")")
	.attr("class", "coralAxis")
	.call(xAxis);
    
    var gy = svg.append("g")
	.attr("class", "axis axis--y")
	.attr("transform", "translate(0,0)")
	.attr("class", "coralAxis")
	.call(yAxis);
    
    
    var g = svg.append('g');

    g.append("rect")
	.attr("width", width)
	.attr("height", height)
	.style("fill", "none")
	.style("pointer-events", "all")
	.call(d3.zoom()
	      .scaleExtent([0.8, 4])
	      .on("zoom", zoomed));
   
    var g = svg.append('g');
    
    g.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
    	.attr("cx", function(d) { return xScale(d["merit"]); })
	.attr("cy", function(d) { return yScale(d["price"]); })
	.attr("r", 3)
        .style("fill", function(x) {
 	    if (x["bestfit"] == true && x["link"] == "") {return "coral";}
	    if (x["bestfit"] == true && x["link"] != "") {return "green";}
	    if (x["bestfit"] == false ) {return "blue";}})
	.style("opacity", 0.7)
	.attr("stroke", function(x) {
	    if (x["bestfit"] == true && x["link"] == "") {return "red";}
	    if (x["bestfit"] == true && x["link"] != "") {return "darkgreen";}
	    if (x["bestfit"] == false ) {return "darkblue";}})
        .on("mouseover", function(d) {
	    d3.select(this)
	        .transition()
      		.duration(100)
		.attr("r", 5);
            div.transition()		
                .duration(400)		
                .style("opacity", .7);		
            div	.html( "Brand name: " + d["brand"] + "<br>" + "Price: " + d["price"] + "$" + "<br>" +  d["link"])	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 50) + "px");

	    
        })
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(400)
		.style("opacity", 0);
	    d3.select(this)
	        .transition()
      		.duration(100)
		.attr("r", 3); 
        })

    function zoomed() {

      var transform = d3.event.transform,
      zx = transform.rescaleX(xScale),
      zy = transform.rescaleY(yScale);

      gx.call(xAxis.scale(zx));
      gy.call(yAxis.scale(zy));
      g.attr("transform", d3.event.transform);
	
    }
    
}

function returnColumn(data, str) {

    var out = [];
    for(var kk = 0; kk < data.length; kk++) {
	out.push(data[kk][str]);
    }

    return out;

}

function sanitycheckuserinput(style, inputval) {

    var htmltext = d3.select(".radioselecttext")
	    .html();
    var flag = true;
    if(style == "") {
	d3.select(".radioselecttext")
	    .style("color", "red")
	    .html(htmltext + "*      <-- please select!");
	flag = false;
	return flag;
    } else {
	d3.select(".radioselecttext")
	    .style("color", "black")
	    .html("Choose your fit:");	
    }


    if(inputval[0].value == "") {
	d3.select("#waistname")
	    .style("color","red")
	    .html("Waist*");
	d3.select("#waistid")
	    .style("border-color","red");
	flag = false;
	return flag;
    }else {
	d3.select("#waistname")
	    .style("color","black")
	    .html("Waist");
	d3.select("#waistid")
	    .style("border-color","grey");	
    }

    if(inputval[1].value == "") {
	d3.select("#thighname")
	    .style("color","red")
	    .html("Thigh*");
	d3.select("#thighid")
	    .style("border-color","red");
	flag = false;
	return flag;
    }else {
	d3.select("#thighname")
	    .style("color","black")
	    .html("Thigh");
	d3.select("#thighid")
	    .style("border-color","grey");	
    }

    if(inputval[2].value == "") {
	d3.select("#inseamname")
	    .style("color","red")
	    .html("Inseam*");
	d3.select("#inseamid")
	    .style("border-color","red");
	flag = false;
	return flag;
    }else {
	d3.select("#inseamname")
	    .style("color","black")
	    .html("Inseam");
	d3.select("#inseamid")
	    .style("border-color","grey");	
    }


    if(inputval[3].value == "") {
	d3.select("#outseamname")
	    .style("color","red")
	    .html("Outseam*");
	d3.select("#outseamid")
	    .style("border-color","red");
	flag = false;
	return flag;
    }else {
	d3.select("#outseamname")
	    .style("color","black")
	    .html("Outseam");
	d3.select("#outseamid")
	    .style("border-color","grey");	
    }


    
    if(inputval[4].value == "") {
	d3.select(".pricetexttag")
	    .style("color","red")
	    .html("Price ($)*");
	d3.select("#pricemininput")
	    .style("border-color","red");
	flag = false;
	return flag;
    }else {
	d3.select(".pricetexttag")
	    .style("color","black")
	    .html("Price ($)");
	d3.select("#pricemininput")
	    .style("border-color","grey");	
    }

    if(inputval[5].value == "") {
	d3.select(".pricetexttag")
	    .style("color","red")
	    .html("Price ($)*");
	d3.select("#pricemaxinput")
	    .style("border-color","red");
	flag = false;
	return flag;
    }else {
	d3.select(".pricetexttag")
	    .style("color","black")
	    .html("Price ($)");
	d3.select("#pricemaxinput")
	    .style("border-color","grey");
	
    }

    
}


function submituserdata() {

    var inputval  = document.getElementsByClassName("measurement-text");
    var style     = returnstyle();

    var flag      = sanitycheckuserinput(style, inputval);
    if(flag == false) {
	return;
    }
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
	    data = JSON.parse(this.response);
	    console.log(data);
	    plot(data);
	    presentResults(data);
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



function plusDivs(n) {
    
    var num_fig = 4;
    SLIDE_IDX += n;
    if (SLIDE_IDX < 1) {SLIDE_IDX = num_fig;}
    if (SLIDE_IDX > num_fig) {SLIDE_IDX = 1;}
    showDivs(SLIDE_IDX);
    timeOutSlider = setTimeout("plusDivs(+1)", 5000);

}


function plusDivsManual(n) {
    
    var num_fig = 4;
    SLIDE_IDX += n;
    if (SLIDE_IDX < 1) {SLIDE_IDX = num_fig;}
    if (SLIDE_IDX > num_fig) {SLIDE_IDX = 1;}
    showDivs(SLIDE_IDX);
    clearTimeout(timeOutSlider);
    timeOutSlider = setTimeout("plusDivs(+1)", 5000);
}

function showDivs(n) {


    var AdText = ["baba shalver.com kheili khoobe", "estefadeh kon halesho bebar",
		  "ye pooli am bere too jib e ma", "be khoda koonam pare shod neveshtamesh"];

    var x = d3.select('.mainslider');
    x
	.selectAll('*')
	.remove();
    
    x.append("img")
	.attr("src", "img/sliders/" + n + ".jpg")
	.attr("class", "sliderimg")
	.style('opacity', 0);

    x.append("div")
	.attr("class", "slideNav");

    x.append("div")
	.attr("class", "sliderText")
	.html(AdText[n-1]);
    
    var y = d3.select(".slideNav");

    y.append("div")
	.attr("class", "arrow-left")
	.append("div")
	.attr("class", "fa fa-angle-left")
	.on("click", function () {plusDivsManual(-1);});
    y.append("div")
	.attr("class", "arrow-right")
	.append("div")
	.attr("class", "fa fa-angle-right")
	.on("click", function () {plusDivsManual(+1);});

    y.append("div")
	.attr("class", "circleNav c1");
    y.append("div")
	.attr("class", "circleNav c2");
    y.append("div")
	.attr("class", "circleNav c3");
    y.append("div")
	.attr("class", "circleNav c4");
    
      
    d3.selectAll(".sliderimg")
	.transition()
	.duration(1000)
	.style('opacity', 1);

    d3.selectAll(".circleNav")
	.style("background", "none");
    
    d3.select(".c" + n)
	.transition()
	.duration(1000)
	.style("background", "coral");

    d3.select(".sliderText")
	.transition()
	.duration(2500)
	.style("opacity", 1);
    

}



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    var user = getCookie(cname);
    if (user != "") {
	if (cname == "shalveruseremail") {
	    var inputval  = d3.select("#emailbox");
	}
	if (cname == "shalverusername") {
	    var inputval  = d3.select("#namebox");
	}
	setOption(inputval, user);
    } 
} 


function setOption(input, user) {
	input.select("option").remove();
	input
	    .append("option")
	    .attr("value", user);

}
