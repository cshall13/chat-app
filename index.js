// We need the http and fs modules to make the app work
var http = require("http");
var fs = require("fs");

// Include socket.io which was installed by npm. It is NOT part of core.
var socketio = require("socket.io");

var server = http.createServer(function(req, res){
	console.log("Someone connected via HTTP!");
	if(req.url == '/'){
		fs.readFile('index.html', 'utf-8',function(error,data){
			// console.log(error);
			// console.log(data);
			if(error){
				res.writeHead(500,{'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'text/html'});
				res.end(data);
			}
		});
	}else if(req.url == '/styles.css'){
		fs.readFile('styles.css','utf-8',(error,data)=>{
			if(error){
				res.writeHead(500,{'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'text/css'});
				res.end(data);
			}
		});
	}else if(req.url == '/config.js'){
		fs.readFile('config.js','utf-8',(error,data)=>{
			if(error){
				res.writeHead(500,{'content-type':'text/html'});
				res.end('Internal Server Error');
			}else{
				res.writeHead(200,{'content-type':'application/javascript'});
				res.end(data);
			}
		});
	}
});

var io = socketio.listen(server);
// handle socket connections ...
io.sockets.on('connect',(socket)=>{
	console.log("Someone connected via socket!");
	
	socket.on('nameToServer',(name)=>{
		console.log(name + " just joined.");		
		io.sockets.emit('newUser',name);
	});
	socket.on('sendMessage',()=>{
		console.log("Someone clicked on the big blue button.");
	});
	socket.on('messageToServer',(messageObj)=>{
		var time = (new Date()).toLocaleString();
		io.sockets.emit('messageToClient',messageObj.name + ' : ' + messageObj.newMessage + ' ' + time);
	});
});

// console.log("The node file is working.")
server.listen(8080);
console.log("Listening on port 8080");



