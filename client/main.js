var divLogin = document.getElementById("divLogin");
var divRegister = document.getElementById("divRegister");
var loginUsername = document.getElementById("loginUsername");
var loginPassword = document.getElementById("loginPassword");
var btnSignIn = document.getElementById("btnSignIn");
var btnSignUp = document.getElementById("btnSignUp");
var successDiv = document.getElementById("successDiv");
var welcomeText = document.getElementById("welcomeText");

var registerUsername = document.getElementById("registerUsername");
var registerPassword = document.getElementById("registerPassword");
var registerEmail = document.getElementById("registerEmail");
var btnRegister = document.getElementById("btnRegister");
var btnCancel = document.getElementById("btnCancel");
var socket = io();

btnSignIn.onclick = function(){
	socket.emit("lgnCredentials", {
		username: loginUsername.value,
		password: loginPassword.value
	});
	console.log("btnSignIn clicked");
}

btnRegister.onclick = function(){
	divLogin.style.display = "none";
	divRegister.style.display = "block";
	console.log("btnSignUp clicked");
}

btnSignUp.onclick = function(){
	socket.emit("regCredentials", {
		username: registerUsername.value,
		password: registerPassword.value,
		email: registerEmail.value
	});
	console.log("btnRegister clicked");
}

btnCancel.onclick = function(){
	divLogin.style.display = "block";
	divRegister.style.display = "none";
}

socket.on("lgnCredentialsResponse", data => {
	if (data.success) {
		console.log(data.username);
		divLogin.style.display = "none";
		divRegister.style.display = "none";
		welcomeText.innerHTML = "Hello, " + data.username;
		successDiv.style.display = "block";
		console.log("Sucessfully logged in!");
	} else {
		alert("Invalid Credentials!");
	}
});

socket.on("regCredentialsResponse", data => {
	if (data.type = "success") {
		divRegister.style.display = "none";
		divLogin.style.display = "block";
		console.log("Sucessfully Registered!");
	}

	if (data.type = "usernameTaken") {
		console.log("usernametaken");
		alert("Username has already been registered");
	}
});
