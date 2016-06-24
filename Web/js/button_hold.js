var buttons = new Array();
var pointers = new Array();
var pointerDebugging = false;
var socket = io();
var interval;

function buttonOn(button) 
{
	if (buttons[button] == null) 
	{
		buttons[button] = 1;
		var e = document.getElementById(button);
		if (e)
			e.classList.add("pressed");
	}
}

function buttonOff(button) 
{
	if (buttons[button] != null) 
	{
		buttons[button] = null;
		var e = document.getElementById(button);
		if (e)
			e.classList.remove("pressed");
	}
}

function pointerDown(x) 
{
	var button = x.target.id;
	if(button == "volup" || button == "voldown")
	{
		interval = setInterval(function(){
			socket.emit("command", {cmd: button});
		}, 50);
	}
	else
	{
		socket.emit("command", {cmd: button});
	}
	
	if (pointerDebugging)
	{
		console.log("Pointer on: pointerId = " + x.pointerId + " target_id = " + x.target.id + " buton = " + button);
	}
	if (button != "area") 
	{
		buttonOn(button);
		pointers[x.pointerId] = button;
	}
	x.preventDefault();
}

function pointerUp(x) 
{
	var button = x.target.id;
	
	if(button == "volup" || button == "voldown")
	{
		clearInterval(interval);
	}

	if (pointerDebugging)
	{
		console.log("Pointer up: pointerId = " + x.pointerId + " buton = " + button);
		console.log("");
	}
	
	if (button != "area")
		buttonOff(button);
		
	pointers[x.pointerId] = null;
	x.preventDefault();
}

function initialize() {
	shutdown = document.getElementById("shutdown");
	shutdown.addEventListener('down', pointerDown);
	shutdown.addEventListener('up', pointerUp);

	restart = document.getElementById("restart");
	restart.addEventListener('down', pointerDown);
	restart.addEventListener('up', pointerUp);

	volup = document.getElementById("volup");
	volup.addEventListener('down', pointerDown);
	volup.addEventListener('up', pointerUp);

	voldown = document.getElementById("voldown");
	voldown.addEventListener('down', pointerDown);
	voldown.addEventListener('up', pointerUp);

	mute = document.getElementById("mute");
	mute.addEventListener('down', pointerDown);
	mute.addEventListener('up', pointerUp);
}

window.onload = initialize;