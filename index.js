const mongojs = require("mongojs");
const bcrypt = require("bcryptjs");
const express = require("express");
const app = express();
const serv = require("http").Server(app);
const io = require("socket.io")(serv, {});

let db = mongojs("localhost:27017/passworddb", ["account"]);

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/client/index.html");
	console.log("Loaded index.html");
});

app.use("/client", express.static(__dirname + "/client"));

serv.listen(8000);

console.log("Server has loaded");

var isValidEmail = email => {
	console.log("isValidEmail called");
	var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

var checkPassword = (data, cb) => {
	var unHashedPassword = data.password;
	var dbHash = getPasswordFromUserName(data.username);
	bcrypt.compare(unHashedPassword, dbHash, (err, res) => {
    	if (res = true) {
			cb(true);
		} else {
			cb(false);
		}
	});

	console.log("isValidPassword");
}

var getPasswordFromUserName = username => {
	db.account.find({username: username}, (err, res) => {
		return res.password;
	});
}

var isUsernameTaken = (data, cb) => {
	db.account.find({username: data.username}, (err, res) => {
		if (res) {
			cb(true);
		} else {
			cb(false);
		}
	});
	console.log("isUsernameTaken");
}
var addUser = (data, cb) => {
	var unHashedPassword = data.password;
	bcrypt.hash(unHashedPassword, 10, (err, hash) => {
		db.account.insert({username: data.username, password: hash, email: data.email}, err => {
			cb();
		});
	});
	console.log("addUser");
}

io.sockets.on("connection", socket => {
	socket.on("lgnCredentials", data => {
		var usernaame = data.username;
		console.log("Socket got lgnCredentials");
		checkPassword(data, correct => {
			console.log("isValidPassword called");
			if (correct) {
				console.log("Valid password");
				socket.emit("lgnCredentialsResponse", {success: true, username: usernaame});
				console.log("socket emitted lgnCredentialsResponse");
			} else {
				console.log("Invalid password");
				socket.emit("lgnCredentialsResponse", {success: false});
				console.log("socket did not emit lgnCredentialsResponse");
			}
		});
	});

	socket.on("regCredentials", data => {
		console.log("Socket got regCredentials");
		var useremail = data.email;
		isUsernameTaken(data, res => {
			console.log("isUsernameTaken called");
			if (res) {
				if (isValidEmail(useremail) == false) {
					console.log("username is taken");
					socket.emit("regCredentialsResponse", {success: false});
					console.log("socket did not emit regCredentialsResponse");
				}
			} else if (isValidEmail(useremail) == true) {
				console.log("username is not taken");
				addUser(data, () => {
					console.log("addUser called");
					socket.emit("regCredentialsResponse", {success: true});
					console.log("socket emitted regCredentialsResponse");
				});
			}
		});
	});

	console.log("A client has connected")
	socket.on("disconnect", () => {
		console.log("A client has disconnected");
	});
});
