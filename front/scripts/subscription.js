var myStorage = window.sessionStorage;
var loggedUser= {username:null, token:null};

function loadSubscription(){
  // COntrolliamo se l'utente è loggato, in caso contrario lo mandiamo al login
  if(sessionStorage.getItem('loggedUser') && sessionStorage.getItem('token')){
    loggedUser = {
      username: sessionStorage.getItem('loggedUser'),
      token: sessionStorage.getItem('token')
    }
    document.getElementById("header_profile").innerHTML = sessionStorage.loggedUser + "'s profile";
    //document.getElementById("header_unlogged").hidden = true;
    document.getElementById("header_logged").hidden = false;

    // Controllo se l'utente ha già una subscription
    var url = '../user/' + loggedUser.username + '/subscription';    //Costruisco l'url con l'id
    fetch(url, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'token': loggedUser.token
        },
    })
    .then(function(data) {
      // Se troviamo una subscription converto data con .json() 
        if(data.ok){
            data.json().then(sub =>{
              document.getElementById('abbonato').innerHTML = "<h3>Sei abbonato dal " + prettyDate(sub.dateSubscription) +"</h3>";
            })
        }
    })
    .catch( error => console.error(error));
  }else{
    loggedUser = null;
    // redirect al login
    document.location.href = "login.html";
  }
    
}


function addSubscription(){
    var url = '../user/' + loggedUser.username + '/subscription';
    var date = new Date().toLocaleDateString("it-IT");

		fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'token': loggedUser.token
      },
				body: JSON.stringify({
            username : loggedUser.username,
            dateSubscription : date,
        }),
    })
    .then(function(resp){
      if(resp.ok){
        document.getElementById('abbonato').innerHTML = "<h3>Ottimo! Ti sei abbonato</h3><button onclick='window.location.href=\"user.html\"'>Torna alla pagina utente</button>";
      }
      else{
        document.getElementById('abbonato').innerHTML = "<h3>Si è verificato un errore, prova più tardi</h3><button onclick='window.location.href =\"user.html\"'>Torna alla pagina utente</button>";
      }
    })
    .catch( error => alert("error: "+error));
    return;
}

function prettyDate(datetime){
  let date = datetime.split("T")[0];
  let ymd = date.split("-");
  return (ymd[2]+"/"+ymd[1]+"/"+ymd[0]);
}
