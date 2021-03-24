

function signInUser(){
	var name = document.getElementById("txt_name").value;
    var surname = document.getElementById("txt_surname").value;
    var username = document.getElementById("txt_username").value;
    var password = document.getElementById("txt_password").value;
    var email = document.getElementById("txt_email").value;

    fetch('../user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name : name,
			surname : surname,
			username : username,
			password : password,
			email : email
        }),
    })
    .then(function(response) {
        //la risposta è un successo
        if(response.ok){
            alert("Utente creato");
        }
        //Da una spiegazione nel caso di fallimento 
        else {
            response.json().then(data => {
                alert(data.error)
            })
        }
    })
    .catch(error => console.log("errore"));

}