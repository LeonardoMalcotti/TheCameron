var myStorage = window.sessionStorage;
var loggedUser= {username:null, token:null};

function loadSubscription(){
    if(sessionStorage.getItem('loggedUser') && sessionStorage.getItem('token')){
        loggedUser = {
          username: sessionStorage.getItem('loggedUser'),
          token: sessionStorage.getItem('token')
        }
        document.getElementById("header_profile").innerHTML = sessionStorage.loggedUser + "'s profile";
        document.getElementById("header_unlogged").hidden = true;
        document.getElementById("header_logged").hidden = false;
      }else{
        loggedUser = null;
        // disablilito le reazioni
        document.getElementById('btn_react_1').disabled=true;
        document.getElementById('btn_react_2').disabled=true;
        document.getElementById('btn_react_3').disabled=true;
        document.getElementById('btn_react_4').disabled=true;
        // disabilito il pulsante per salvare l'articolo
        document.getElementById("btn_saveArticle").disabled = true;
      }
    var username = decodeURIComponent(window.location.search).substring(10); //Recupero l'id
    var url = '../user/' + username + '/subscription';    //Costruisco l'url con l'id
    console.log("username: " + username);

		fetch(url, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'token': loggedUser.token
        },
    })
    .then((resp) => resp.json())
    .then(function(data) {
        console.log("Data:" + data);
        document.getElementById('abbonamento').innerHTML = "Sei abbonato dal " + data.dateSubscription;
        //paypal non visibile
    })
    .catch( error => console.error(error)
        //document.getElementById('abbonamento').innerHTML = "Non sei abbonato ";
        //paypal visibile
    );
}


function addSubscription(){
		var username = decodeURIComponent(window.location.search).substring(10); //Recupero l'id
    var url = '../user/' + username + '/subscription';
    var date = new Date().toLocaleDateString("it-IT");

    console.log("username: " + username);
    console.log("date: " + date);

		fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'token': loggedUser.token
      },
				body: JSON.stringify({
            username : username,
            dateSubscription : date,
        }),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        console.log(data);
        document.getElementById('abbonato').innerHTML = "<p>Ottimo! Ti sei abbonato</p><button onclick='window.location.href(\"userPage.html\")'>Torna alla pagina utente</button>";
    })
    .catch( error => console.error(error)
			//document.getElementById('abb').innerHTML = "Peccato! Non ti sei abbonato";
		);

    return;
}
