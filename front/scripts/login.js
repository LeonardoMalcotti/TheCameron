
var loggedUser = {};

function LogInUser(){
	var username = document.getElementById("txt_username").value;
    var password = document.getElementById("txt_password").value;
	var myStorage = window.sessionStorage;
    fetch('../login', {
    	method: 'POST',
    	headers: { 'Content-Type': 'application/json' },
    	body: JSON.stringify({ 
			username : username,
			password : password,
        }),
    })
    .then(response => {
    	response.json().then(json =>{
	    	if(response.status == 400){
	    		//manca un parametro
	    		alert(json.error);
	    	}
	    	if(response.status == 403){
	    		//user non trovato o psw sbagliata
	    		alert(json.message);
	    	}
	    	if(response.status == 200){
	    		if(json.success == true){
	    			loggedUser.username = username;
					loggedUser.token = json.token;
					myStorage.setItem('loggedUser', loggedUser);
					
	    		}
	    	}
    	});
    });
}