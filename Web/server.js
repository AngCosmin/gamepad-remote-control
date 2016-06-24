var express = require("express");
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var connected = 0;
var port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', function (req, res) {
	res.sendFile(__dirname);
});

io.on("connection", function(socket){	
	connected++;
	console.log("A device has been connected!");
	console.log("Devices connected: " + connected);

	socket.on("command", function(data)
	{	
		io.emit("command", {cmd: data.cmd});
	});

	socket.on("mouseMove", function(data)
	{
		io.emit("mouseMove", {xAx: data.xAx, yAx: data.yAx});
	});

	socket.on("mousePress", function(data)
	{
		io.emit("mousePress", {key: data.key, keyCode: data.keyCode, pressed: data.pressed});
	});

	socket.on("keyPress", function(data)
	{	
		io.emit("keyPress", {key: data.key, keyCode: data.keyCode, pressed: data.pressed});
	});
	
	socket.on("playerConnect", function(data)
	{
		io.emit("playerConnect", {id: data.id});
	});

	socket.on("optionChange", function(data){
		io.emit("optionChange", {id: data.id, value: data.value});
	});

	socket.on("disconnect", function(){
		connected--;
		console.log("A device has been disconnected!");
		console.log("Devices connected: " + connected);
	});
});

http.listen(port, function(){
	console.log("RUNNING ON localhost:" + port);
});