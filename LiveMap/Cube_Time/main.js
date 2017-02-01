var mousedown = false;                
var randomrotation = true;
var lastrotation = false;

var moving=false;
var drag=false;

var currentspeed = 0;

var windowheight = null;
var windowwidth = null;
var lastwindowheight = null;
var lastwindowwidth = null;

var mousex;
var mousey;
var lastx;
var lasty;

var binaryhour;
var binaryminute;
var binarysecond;
var hexhour;
var hexminute;
var hexsecond;
var dechour;
var decminute;
var decsecond;

var lastcolor=0;

///////////////////////////////////////////////////////////////////////////////////////////////////

function init() {
    var i;
    var help;
	
	$("#binary, #dec, #hex, #cube").draggable({scroll:false});

    cube = new cube($(window).width() / 2, $(window).height() / 2, -23, -30, 70); 
    
	clock();
	windowResize();         
	setEventHandler();
	hostf();
}

function hostf(){
	if(drag)
		rotate();
		
	if(randomrotation)
		rotateRandom();

	window.setTimeout(hostf,30);
}

function setEventHandler() {
	$(document).on("contextmenu",
        function () {
            return false;
        }
    );
	
    $(window).resize( 
        function () {
            windowResize();
        }
    );

    $(document).mousemove(   
        function (e) {
            inactivity = 0;

            mousex = e.pageX;
            mousey = e.pageY;

            if (mousedown)
                drag = true;
        } 
    );

	$(document).keypress(           ///various shortcuts
        function (e) {
			if(e.which==32){
				randomrotation=true;
				rotateRandom();	
			}
	});
	
	$(document).dblclick(
		function (e) {
			randomrotation=true;
			rotateRandom();	
	});

    $("#cube").mousedown(
        function (e) {
            randomrotation = false;
			
            if (e.which == 3) {
                mousex = e.pageX;
                mousey = e.pageY;

                lastx = mousex;
                lasty = mousey;
				
                mousedown = true;
            }
        }
    );

    $(document).mouseup( 
        function () {
            mousedown = false;
			drag=false;
        }
    );

    $(document).on("mousewheel",       
        function (e, delta) {
            inactivity = 0;

            cube.setZoom(cube.getZoom() + delta * 2);
        }
    );
}

function rotateRandom() {
	cube.setRotation(cube.getRotation().y + 0.2, cube.getRotation().x + 0);
}

function rotate() {
    var helpy =  cube.getRotation().y;
    var helpx = cube.getRotation().x;

    cube.setRotation(helpy + (((mousex * 0.4) - (lastx * 0.4)))*0.8, helpx + (((lasty * 0.4) - (mousey * 0.4)))*0.8);

    if (helpy != cube.getRotation().y || helpx != cube.getRotation().x)
        downid = -1;

    lastx = mousex;
    lasty = mousey;
}

function windowResize() {
    windowheight=$(window).height();
    windowwidth = $(window).width();

	$("body").css("height",windowheight).css("width",windowwidth);

    lastwindowheight = windowheight;
    lastwindowwidth = windowwidth;
}

function clock() {
    var date = new Date();

    binary = toLength(date.getHours().toString(2),6) + toLength(date.getMinutes().toString(2),6) + toLength(date.getSeconds().toString(2),6);
    hex = toLength(date.getHours().toString(16).toUpperCase(),2) + toLength(date.getMinutes().toString(16).toUpperCase(),2) + toLength(date.getSeconds().toString(16).toUpperCase(),2);
	dec = toLength(date.getHours().toString(10),2) + toLength(date.getMinutes().toString(10),2) + toLength(date.getSeconds().toString(10),2);
	
	for(var i=0; i<binary.length; i++){
		$("#binary>span:eq(" + i + ")").text(binary.charAt(i));
	}
	
	for(var i=0; i<hex.length; i++){
		$("#hex>span:eq(" + i + ")").text(hex.charAt(i));
	}
	
	for(var i=0; i<dec.length; i++){
		$("#dec>span:eq(" + i + ")").text(dec.charAt(i));
	}
	
	var ids = [6,7,20,21,22,23,10,11,24,25,26,27,14,15,28,29,30,31];
	var mids = [38,39,52,53,54,55,42,43,56,57,58,59,46,47,60,61,62,63];
	
	for(var i = 0; i < ids.length; i++){
		$("#" + ids[i]).css("background-color", binary.charAt(i) == "0" ? "white" : "#B0DA1E");
		$("#" + mids[i]).css("background-color", binary.charAt(i) == "0" ? "white" : "#0B55A2");	
	}
	
    window.setTimeout(clock, 1000);
}

function toLength(_var, _length) {
    while(_var.length<_length){
        _var = "0" + _var;
    }
	
	return _var;
}