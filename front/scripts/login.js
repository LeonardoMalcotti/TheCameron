
var loggedUser = {};

function LogInUser(){
	var username = document.getElementById("txt_username").value;
    var password = document.getElementById("txt_password").value;

    fetch('../login', {
    	method: 'POST',
    	headers: { 'Content-Type': 'application/json' },
    	body: JSON.stringify({ 
			username : username,
			password : password,
        }),
    })
    .then(response => {
    	let json = response.json();
    	if(response.status == 400){
    		alert(json.error);
    	}
    	if(response.status == 403){
    		alert(json.message);
    	}
    	if(response.status == 200){
    		if(json.success == true){
    			loggedUser.username = username;
    			loggedUser.token = json.token;
    		}
    	}
    })
    .catch( error => console.error(error) );
}