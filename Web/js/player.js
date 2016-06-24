var socket = io();
var buttons = [];
var pointers = [];
var player1 = [];
var player2 = [];
var selected_player;
var gamepad_mode;
var pointerDebugging = false;
var lastJoystickDir = "none";

// buttonOn - Primeste un ID, apasa butonul, aplica efectul 'pressed' si il adauga in lista cu butoane apasate
function buttonOn(button) 
{
	if (buttons[button] == null) // Verifica ca butonul sa nu fie deja apasat
	{
		buttons[button] = 1; // Butonul devine apasat
		var e = document.getElementById(button); // Iau elementul cu IDul buttonului primit ca parametru
		if (e) // Verific daca exista
		{
			emitKey(button, 1); // Emite semnal prin sockets
			e.classList.add("pressed"); // Ii aplic clasa 'pressed'
		}
	}
}

// buttonOff - Primeste un ID, ridica butonul, sterge efectul 'pressed' si il adauga in lista cu butoane apasate
function buttonOff(button)
{
	if (buttons[button] != null) // Verific daca exista printre butoanele care sunt la momentul respectiv apasate
	{
		buttons[button] = null; // Butonul devine null
		var e = document.getElementById(button); // Iau elementul cu IDul buttonului primit ca parametru
		if (e) // Verific daca exista
		{
			emitKey(button, 0); // Emite semnal prin sockets
			e.classList.remove("pressed"); // Ii sterg clasa 'pressed'
		}
	}
}

function pointerDown(element) 
{
	var button = element.target.id;
	
	if (pointerDebugging)
		console.log("Pointer on: pointerId = " + element.pointerId + " target_id = " + element.target.id + " buton = " + button);

	buttonOn(button);
	pointers[element.pointerId] = button;
	element.preventDefault();	
}

function pointerUp(element) 
{
	var button = element.target.id;
	
	if (pointerDebugging)
		console.log("Pointer off: pointerId = " + element.pointerId + " buton = " + button);
	
	buttonOff(button)
	pointers[element.pointerId] = null;
	element.preventDefault();
}

// Socket emit keys
function emitKey(button, press)
{
	switch(button)
	{
		// Directions
		case "up":
			if(selected_player == 1)
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["up"]), keyCode: player1["up"], pressed: press});
			else if(selected_player == 2)
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["up"]), keyCode: player2["up"], pressed: press});
			break;

		case "down":
			if(selected_player == 1)
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["down"]), keyCode: player1["down"], pressed: press});
			else if(selected_player == 2)
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["down"]), keyCode: player2["down"], pressed: press});
			break;

		case "left":
			if(selected_player == 1)
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["left"]), keyCode: player1["left"], pressed: press});
			else if(selected_player == 2)
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["left"]), keyCode: player2["left"], pressed: press});
			break;

		case "right":
			if(selected_player == 1)
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["right"]), keyCode: player1["right"], pressed: press});
			else if(selected_player == 2)
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["right"]), keyCode: player2["right"], pressed: press});
			break;

		// Corners
		case "upleft":
			if(selected_player == 1){
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["up"]), keyCode: player1["up"], pressed: press});
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["left"]), keyCode: player1["left"], pressed: press});
			}
			else if(selected_player == 2){
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["up"]), keyCode: player2["up"], pressed: press});
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["left"]), keyCode: player2["left"], pressed: press});
			}
			break;

		case "upright":
			if(selected_player == 1){
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["up"]), keyCode: player1["up"], pressed: press});
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["right"]), keyCode: player1["right"], pressed: press});
			}
			else if(selected_player == 2){
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["up"]), keyCode: player2["up"], pressed: press});
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["right"]), keyCode: player2["right"], pressed: press});				
			}
			break;

		case "downleft":
			if(selected_player == 1){
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["down"]), keyCode: player1["down"], pressed: press});
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["left"]), keyCode: player1["left"], pressed: press});
			}
			else if(selected_player == 2){
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["down"]), keyCode: player2["down"], pressed: press});
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["left"]), keyCode: player2["left"], pressed: press});
			}
			break;

		case "downright":
			if(selected_player == 1){
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["down"]), keyCode: player1["down"], pressed: press});
				socket.emit("keyPress", {key: convertVKCodeInReadable(player1["right"]), keyCode: player1["right"], pressed: press});
			}
			else if(selected_player == 2){
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["down"]), keyCode: player2["down"], pressed: press});
				socket.emit("keyPress", {key: convertVKCodeInReadable(player2["right"]), keyCode: player2["right"], pressed: press});				
			}
			break;

		// Buttons
		case "blue":
			if(selected_player == 1)
				if(isMouseEvent(blue))
					socket.emit("mousePress", {key: convertVKCodeInReadable(player1["blue"]), keyCode: player1["blue"], pressed: press});
				else
					socket.emit("keyPress", {key: convertVKCodeInReadable(player1["blue"]), keyCode: player1["blue"], pressed: press});
			else if(selected_player == 2)
				if(isMouseEvent(blue))
					socket.emit("mousePress", {key: convertVKCodeInReadable(player2["blue"]), keyCode: player2["blue"], pressed: press});
				else
					socket.emit("keyPress", {key: convertVKCodeInReadable(player2["blue"]), keyCode: player2["blue"], pressed: press});
			break;

		case "green":
			if(selected_player == 1)
				if(isMouseEvent(green))
					socket.emit("mousePress", {key: convertVKCodeInReadable(player1["green"]), keyCode: player1["green"], pressed: press});
				else
					socket.emit("keyPress", {key: convertVKCodeInReadable(player1["green"]), keyCode: player1["green"], pressed: press});
			else if(selected_player == 2)
				if(isMouseEvent(green))
					socket.emit("mousePress", {key: convertVKCodeInReadable(player2["green"]), keyCode: player2["green"], pressed: press});
				else
					socket.emit("keyPress", {key: convertVKCodeInReadable(player2["green"]), keyCode: player2["green"], pressed: press});
			break;

		case "red":
			if(selected_player == 1)
				if(isMouseEvent(red))
					socket.emit("mousePress", {key: convertVKCodeInReadable(player1["red"]), keyCode: player1["red"], pressed: press});
				else
					socket.emit("keyPress", {key: convertVKCodeInReadable(player1["red"]), keyCode: player1["red"], pressed: press});
			else if(selected_player == 2)
				if(isMouseEvent(red))
					socket.emit("mousePress", {key: convertVKCodeInReadable(player2["red"]), keyCode: player2["red"], pressed: press});
				else
					socket.emit("keyPress", {key: convertVKCodeInReadable(player2["red"]), keyCode: player2["red"], pressed: press});
			break;

		case "orange":
			if(selected_player == 1)
				if(isMouseEvent(orange))
					socket.emit("mousePress", {key: convertVKCodeInReadable(player1["orange"]), keyCode: player1["orange"], pressed: press});
				else
					socket.emit("keyPress", {key: convertVKCodeInReadable(player1["orange"]), keyCode: player1["orange"], pressed: press});
			else if(selected_player == 2)
				if(isMouseEvent(orange))
					socket.emit("mousePress", {key: convertVKCodeInReadable(player2["orange"]), keyCode: player2["orange"], pressed: press});
				else
					socket.emit("keyPress", {key: convertVKCodeInReadable(player2["orange"]), keyCode: player2["orange"], pressed: press});
			break;
	}
}

// Detect if the button is a mouse event
function isMouseEvent(button)
{
	var button_value = convertVKCodeInReadable(button);
	
	if(button_value == "mouseleft")
		return 1;
	if(button_value == "mouseright")
		return 1;
	if(button_value == "mousemiddle")
		return 1;

	return 0;
}

// Set all the controls to NULL
function setControlsToNothing()
{
	player1["up"] = "NULL";
	player1["down"] = "NULL";
	player1["left"] = "NULL";
	player1["right"] = "NULL";
	player1["blue"] = "NULL";
	player1["green"] = "NULL";
	player1["red"] = "NULL";
	player1["orange"] = "NULL";

	player2["up"] = "NULL";
	player2["down"] = "NULL";
	player2["left"] = "NULL";
	player2["right"] = "NULL";
	player2["blue"] = "NULL";
	player2["green"] = "NULL";
	player2["red"] = "NULL";
	player2["orange"] = "NULL";
}

// Set all the controls to the players
function setControlsToPlayers()
{
	player1["up"] = Cookies.get("p1_up");
	player1["down"] = Cookies.get("p1_down");
	player1["left"] = Cookies.get("p1_left");
	player1["right"] = Cookies.get("p1_right");
	player1["blue"] = Cookies.get("p1_blue");
	player1["green"] = Cookies.get("p1_green");
	player1["red"] = Cookies.get("p1_red");
	player1["orange"] = Cookies.get("p1_orange");

	player2["up"] = Cookies.get("p2_up");
	player2["down"] = Cookies.get("p2_down");
	player2["left"] = Cookies.get("p2_left");
	player2["right"] = Cookies.get("p2_right");
	player2["blue"] = Cookies.get("p2_blue");
	player2["green"] = Cookies.get("p2_green");
	player2["red"] = Cookies.get("p2_red");
	player2["orange"] = Cookies.get("p2_orange");
}

// If cookies are not definet then set them
function setAllCookies()
{
	// Player 1
	if(Cookies.get("p1_up") === undefined)
		Cookies.set("p1_up", convertReadableInVKCode("w"));
	if(Cookies.get("p1_down") === undefined)
		Cookies.set("p1_down", convertReadableInVKCode("s"));
	if(Cookies.get("p1_left") === undefined)
		Cookies.set("p1_left", convertReadableInVKCode("a"));
	if(Cookies.get("p1_right") === undefined)
		Cookies.set("p1_right", convertReadableInVKCode("d"));
	if(Cookies.get("p1_blue") === undefined)
		Cookies.set("p1_blue", convertReadableInVKCode("1"));
	if(Cookies.get("p1_green") === undefined)
		Cookies.set("p1_green", convertReadableInVKCode("2"));
	if(Cookies.get("p1_red") === undefined)
		Cookies.set("p1_red", convertReadableInVKCode("3"));
	if(Cookies.get("p1_orange") === undefined)
		Cookies.set("p1_orange", convertReadableInVKCode("4"));
	if(Cookies.get("select_gamepad_type_p1") === undefined)
		Cookies.set("select_gamepad_type_p1", "joystick");

	// Player 2
	if(Cookies.get("p2_up") === undefined)
		Cookies.set("p2_up", convertReadableInVKCode("up"));
	if(Cookies.get("p2_down") === undefined)
		Cookies.set("p2_down", convertReadableInVKCode("down"));
	if(Cookies.get("p2_left") === undefined)
		Cookies.set("p2_left", convertReadableInVKCode("left"));
	if(Cookies.get("p2_right") === undefined)
		Cookies.set("p2_right", convertReadableInVKCode("right"));
	if(Cookies.get("p2_blue") === undefined)
		Cookies.set("p2_blue", convertReadableInVKCode("1 num"));
	if(Cookies.get("p2_green") === undefined)
		Cookies.set("p2_green", convertReadableInVKCode("2 num"));
	if(Cookies.get("p2_red") === undefined)
		Cookies.set("p2_red", convertReadableInVKCode("3 num"));
	if(Cookies.get("p2_orange") === undefined)
		Cookies.set("p2_orange", convertReadableInVKCode("4 num"));
	if(Cookies.get("select_gamepad_type_p2") === undefined)
		Cookies.set("select_gamepad_type_p2", "joystick");
}

// Check every move for joystick
setInterval(function(){
	if(gamepad_mode == "mouse") // If gamepad_mode is 'mouse'
	{
		if(joystick.deltaX() != 0 || joystick.deltaY() != 0)
			socket.emit("mouseMove", {xAx: joystick.deltaX().toFixed(0), yAx: joystick.deltaY().toFixed(0)});
	}

	if(gamepad_mode == "joystick") // If gamepad_mode is 'joystick'
	{
		if(parseInt(joystick.deltaX()) == 0 && parseInt(joystick.deltaY()) == 0) // If joystick is in middle reset direction
		{
			emitKey(lastJoystickDir, 0);
			lastJoystickDir = "none";
		}

		if(joystick.up() && lastJoystickDir != "up")
		{
			emitKey(lastJoystickDir, 0);
			lastJoystickDir = "up";
			emitKey("up", 1);
		}
		else if(joystick.down() && lastJoystickDir != "down")
		{
			emitKey(lastJoystickDir, 0);
			lastJoystickDir = "down";
			emitKey("down", 1);
		}
		else if(joystick.left() && lastJoystickDir != "left")
		{
			emitKey(lastJoystickDir, 0);
			lastJoystickDir = "left";
			emitKey("left", 1);
		}
		else if(joystick.right() && lastJoystickDir != "right")
		{
			emitKey(lastJoystickDir, 0);
			lastJoystickDir = "right";
			emitKey("right", 1);
		}
		else if(joystick.upright() && lastJoystickDir != "upright")
		{
			emitKey(lastJoystickDir, 0);
			lastJoystickDir = "upright";
			emitKey("upright", 1);
		}
		else if(joystick.upleft() && lastJoystickDir != "upleft")
		{
			emitKey(lastJoystickDir, 0);
			lastJoystickDir = "upleft";
			emitKey("upleft", 1);
		}
		else if(joystick.downright() && lastJoystickDir != "downright")
		{
			emitKey(lastJoystickDir, 0);
			lastJoystickDir = "downright";
			emitKey("downright", 1);
		}
		else if(joystick.downleft() && lastJoystickDir != "downleft")
		{
			emitKey(lastJoystickDir, 0);
			lastJoystickDir = "downleft";
			emitKey("downleft", 1);
		}
	}	
}, 1/60 * 1000);

function convertReadableInVKCode(key)
{
	switch(key)
	{
		case "NULL":
			return "NULL";
			break;
		case "mouseleft":
			return "mouseleft";
			break;
		case "mouseright":
			return "mouseright";
			break;
		case "mousemiddle":
			return "mousemiddle";
			break;
		case "up":
			return "0x26";
			break;
		case "down":
			return "0x28";
			break;
		case "left":
			return "0x25";
			break;
		case "right":
			return "0x27";
			break;
		case "space":
			return "0x20";
			break;
		case "enter":
			return "0x0D";
			break;
		case "shift":
			return "0x10";
			break;
		case "tab":
			return "0x09";
			break;
		case "0":
			return "0x30";
			break;
		case "1":
			return "0x31";
			break;
		case "2":
			return "0x32";
			break;
		case "3":
			return "0x33";
			break;
		case "4":
			return "0x34";
			break;
		case "5":
			return "0x35";
			break;
		case "6":
			return "0x36";
			break;
		case "7":
			return "0x37";
			break;
		case "8":
			return "0x38";
			break;
		case "9":
			return "0x39";
			break;
		case "a":
			return "0x41";
			break;
		case "b":
			return "0x42";
			break;
		case "c":
			return "0x43";
			break;
		case "d":
			return "0x44";
			break;
		case "e":
			return "0x45";
			break;
		case "f":
			return "0x46";
			break;
		case "g":
			return "0x47";
			break;
		case "h":
			return "0x48";
			break;
		case "i":
			return "0x49";
			break;
		case "j":
			return "0x4A";
			break;
		case "k":
			return "0x4B";
			break;
		case "l":
			return "0x4C";
			break;
		case "m":
			return "0x4D";
			break;
		case "n":
			return "0x4E";
			break;
		case "o":
			return "0x4F";
			break;
		case "p":
			return "0x50";
			break;
		case "q":
			return "0x51";
			break;
		case "r":
			return "0x52";
			break;
		case "s":
			return "0x53";
			break;
		case "t":
			return "0x54";
			break;
		case "u":
			return "0x55";
			break;
		case "v":
			return "0x56";
			break;
		case "w":
			return "0x57";
			break;
		case "x":
			return "0x58";
			break;
		case "y":
			return "0x59";
			break;
		case "z":
			return "0x5A";
			break;
		case "0 num":
			return "0x60";
			break;
		case "1 num":
			return "0x61";
			break;
		case "2 num":
			return "0x62";
			break;
		case "3 num":
			return "0x63";
			break;
		case "4 num":
			return "0x64";
			break;
		case "5 num":
			return "0x65";
			break;
		case "6 num":
			return "0x66";
			break;
		case "7 num":
			return "0x67";
			break;
		case "8 num":
			return "0x68";
			break;
		case "9 num":
			return "0x69";
			break;
	}
}

function convertVKCodeInReadable(cod)
{
	switch(cod)
	{
		case "NULL":
			return "NULL";
			break;
		case "mouseleft":
			return "mouseleft";
			break;
		case "mouseright":
			return "mouseright";
			break;
		case "mousemiddle":
			return "mousemiddle";
			break;
		case "0x26":
			return "up";
			break;
		case "0x28":
			return "down";
			break;
		case "0x25":
			return "left";
			break;
		case "0x27":
			return "right";
			break;
		case "0x20":
			return "space";
			break;
		case "0x0D":
			return "enter";
			break;
		case "0x10":
			return "shift";
			break;
		case "0x09":
			return "tab";
			break;
		case "0x30":
			return "0";
			break;
		case "0x31":
			return "1";
			break;
		case "0x32":
			return "2";
			break;
		case "0x33":
			return "3";
			break;
		case "0x34":
			return "4";
			break;
		case "0x35":
			return "5";
			break;
		case "0x36":
			return "6";
			break;
		case "0x37":
			return "7";
			break;
		case "0x38":
			return "8";
			break;
		case "0x39":
			return "9";
			break;
		case "0x41":
			return "a";
			break;
		case "0x42":
			return "b";
			break;
		case "0x43":
			return "c";
			break;
		case "0x44":
			return "d";
			break;
		case "0x45":
			return "e";
			break;
		case "0x46":
			return "f";
			break;
		case "0x47":
			return "g";
			break;
		case "0x48":
			return "h";
			break;
		case "0x49":
			return "i";
			break;
		case "0x4A":
			return "j";
			break;
		case "0x4B":
			return "k";
			break;
		case "0x4C":
			return "l";
			break;
		case "0x4D":
			return "m";
			break;
		case "0x4E":
			return "n";
			break;
		case "0x4F":
			return "o";
			break;
		case "0x50":
			return "p";
			break;
		case "0x51":
			return "q";
			break;
		case "0x52":
			return "r";
			break;
		case "0x53":
			return "s";
			break;
		case "0x54":
			return "t";
			break;
		case "0x55":
			return "u";
			break;
		case "0x56":
			return "v";
			break;
		case "0x57":
			return "w";
			break;
		case "0x58":
			return "x";
			break;
		case "0x59":
			return "y";
			break;
		case "0x5A":
			return "z";
			break;
		case "0x60":
			return "0 num";
			break;
		case "0x61":
			return "1 num";
			break;
		case "0x62":
			return "2 num";
			break;
		case "0x63":
			return "3 num";
			break;
		case "0x64":
			return "4 num";
			break;
		case "0x65":
			return "5 num";
			break;
		case "0x66":
			return "6 num";
			break;
		case "0x67":
			return "7 num";
			break;
		case "0x68":
			return "8 num";
			break;
		case "0x69":
			return "9 num";
			break;
	}
}

function initialize() 
{
	blue = document.getElementById("blue");
	blue.addEventListener('down', pointerDown);
	blue.addEventListener('up', pointerUp);
	
	green = document.getElementById("green");
	green.addEventListener('down', pointerDown);
	green.addEventListener('up', pointerUp);
	
	red = document.getElementById("red");
	red.addEventListener('down', pointerDown);
	red.addEventListener('up', pointerUp);
	
	orange = document.getElementById("orange");
	orange.addEventListener('down', pointerDown);
	orange.addEventListener('up', pointerUp);

	setControlsToNothing();
	setAllCookies();
	setControlsToPlayers();
}

window.onload = initialize;