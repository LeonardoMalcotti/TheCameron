function loadSubscription(){
    var username = decodeURIComponent(window.location.search).substring(10); //Recupero l'id
    var url = '../user/' + username + '/subscription';    //Costruisco l'url con l'id
    console.log("username: " + username);

    //Controllo token se presente

		fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
            username : username,
            dateSubscription : date,
        }),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        console.log(data);
        document.getElementById('abbonato').innerHTML = "Ottimo! Ti sei abbonato";
    })
    .catch( error => console.error(error)
						//document.getElementById('abb').innerHTML = "Peccato! Non ti sei abbonato";
		);

    return;
}
