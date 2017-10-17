var signinDiv = document.getElementById('login');
// var loginBtn = document.getElementById("loginBtn");
var loginUsername = document.getElementById('loginusername');
var loginPassword = document.getElementById('loginpassword');
var btnSignIn = document.getElementById('signin');
var btnSignUp = document.getElementById('signup');
var successDiv = document.getElementById("successDiv");
var welcomeText = document.getElementById("welcomeText");

var registerDiv = document.getElementById('register');
// var registerBtn = document.getElementById("registerBtn");
var registerUsername = document.getElementById('registerusername');
var registerPassword = document.getElementById('registerpassword');
var registerEmail = document.getElementById('registeremail');
var btnRegister = document.getElementById('registerAccount');
var btnCancel = document.getElementById('cancel');
var socket = io();

// loginBtn.onclick = function(){
// 	loginBtn.style = "display: inline-block";
// }
//
// registerBtn.onclick = function(){
// 	registerBtn.style = "display: inline-block";
// }

btnSignIn.onclick = function(){
	socket.emit('lgnCredentials', {
		username: loginUsername.value,
		password: loginPassword.value
	});
	console.log("btnSignIn clicked");
}

btnSignUp.onclick = function(){
	signinDiv.style.display = 'none';
	registerDiv.style.display = 'block';
	console.log("btnSignUp clicked");
}

btnRegister.onclick = function(){
	socket.emit('regCredentials', {
		username: registerUsername.value,
		password: registerPassword.value,
		email: registerEmail.value
	});
	console.log("btnRegister clicked");
}

btnCancel.onclick = function(){
	signinDiv.style.display = 'block';
	registerDiv.style.display = 'none';
}

socket.on('lgnCredentialsResponse', data => {
	if (data.success) {
		console.log(data.username);
		signinDiv.style.display = 'none';
		registerDiv.style.display = 'none';
		welcomeText.innerHTML = "Hello, " + data.username;
		successDiv.style.display = "block";
		console.log("Sucessfully logged in!");
	} else {
		alert("Invalid Credentials!");
	}
});
socket.on('regCredentialsResponse', data => {
	if (data.success) {
		registerDiv.style.display = 'none';
		signinDiv.style.display = 'block';
		console.log("Sucessfully Registered!");
	} else {
		alert("Invalid Credentials!");
	}
});
