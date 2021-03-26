function loadSubscription(){
    var username = decodeURIComponent(window.location.search).substring(10); //Recupero l'id
    console.log("username: " + username);
    var url = '../user/' + username + '/subscription';    //Costruisco l'url con l'id

		//document.getElementById('hiddenAbbonamento').value = username;

		fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then((resp) => resp.json())
    .then(function(data) {
        console.log(data);
        document.getElementById('abbonamento').innerHTML = "Sei abbonato dal " + data.dateSubscription;
        //paypal non visibile
    })
    .catch( //error => console.error(error)
				//document.getElementById('abbonamento').innerHTML = "Non sei abbonato! Abbonati! ";
        //paypal visibile
    );
}


function addSubscription(){
		var username = decodeURIComponent(window.location.search).substring(10); //Recupero l'id
		console.log("username: " + username);
		var url = '../user/' + username;    //Costruisco l'url con l'id
    var date = new Date().toLocaleDateString("en-IT")
    var user;
		//document.getElementById('hiddenAbbonamento').value = username;
    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then((resp) => resp.json())
    .then(function(data) {
        console.log(data);
        user = data;
        document.getElementById('abb').innerHTML = "Email" + data.email;
        //paypal non visibile
    })
    .catch( //error => console.error(error)
				//document.getElementById('abb').innerHTML = "Non sei registrato! ";
        //paypal visibile
    );

    var url2 = '../user/' + username + '/subscription';

		fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
            username : user.username,
            email : user.email,
            dateSubscription : date,
        }),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        console.log(data);
        document.getElementById('abb').innerHTML = "Sei abbonato dal " + data.dateSubscription;
    })
    .catch( //error => console.error(error)
						//document.getElementById('abb').innerHTML = "Non sei abbonato";
		);

    return;
}
