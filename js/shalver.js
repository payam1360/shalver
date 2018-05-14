

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

function loadusermeasurements(Response) {

    var inputval  = document.getElementsByClassName("measurement-text");
    document.getElementById("askforsignup").innerHTML = "";
    document.getElementById("txtName").innerHTML = "Hi " + USERNAME_GLOBAL;
    var userwaist = Response.waist;
    inputval[0].value = userwaist;
    settextbox2range(0);
    var userthigh = Response.thigh;
    inputval[1].value = userthigh;
    settextbox2range(1);    
    var userinseam = Response.inseam;
    inputval[2].value = userinseam;
    settextbox2range(2);
    var useroutseam = Response.outseam;
    inputval[3].value = useroutseam;
    settextbox2range(3);
    
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
    
}

function submitregister() {



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


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
	    var Response = JSON.parse(this.response);
	    if(Response.flag == true) {
		loadusermeasurements(Response);
	    } else {
		document.getElementById("askforsignup").innerHTML = "";
	        document.getElementById("txtName").innerHTML = "User not found. Please register first.";
	    }
        }
    };    
    xmlhttp.open("POST", "php/CheckUserCredentials.php", true);
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
            div.transition()		
                .duration(400)		
                .style("opacity", .7);		
            div	.html( "Brand name: " + d["brand"] + "<br>" + "Price: " + d["price"] + "$" + "<br>" +  d["link"])	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
        })
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(400)
		.style("opacity", 0);	
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




function submituserdata() {

    var inputval  = document.getElementsByClassName("measurement-text");
    var style     = returnstyle();
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
	    data = JSON.parse(this.response);
	    plot(data);
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
