
//const { response } = require("express");

// Retrieve the usernames of users we are followed by
function getFollowers(user){
    fetch('../' + user + '/followers', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then((resp) => resp.json())
    .then(async function(data){
        if(response.ok){alert("Got 'em!");}
        let htmlOut = "<ul>";
        for(let i=0; i<data.length; i++){
            // data[i].username
            htmlOut += ("<li>" + data[i].username + "</li>");
        }
        htmlOut += "</ul>";
        document.getElementById("followers").innerHTML = htmlOut;
    })
}

// Retrieve the usernames of the users that our user is following
function getFollowing(user){
    fetch('../' + user + '/following', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then((resp) => resp.json())
    .then(async function(data){
        if(response.ok){alert("Got 'em!");}
        let htmlOut = "<ul>"
        for(let i=0; i<data.length; i++){
            // data[i].username
            htmlOut += ("<li>" + data[i].username + "</li>");
        }
        htmlOut += "</ul>";
        document.getElementById("following").innerHTML = htmlOut;
    })
}

// Follow a user
function follow(user, target){
    fetch('../follow', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user: user,
            target: [target],
        }),
    })
    .then(function(response) {
        //la risposta è un successo
        if(response.ok){
            alert("Seguito!");
            document.getElementById("btn_follow").disabled = true;
            document.getElementById("btn_unfollow").disabled = false;
        }
        //Da una spiegazione nel caso di fallimento 
        else {
            response.json().then(data => {
                alert(data.error)
            })
        }
    })
    .catch(error => console.log(error));
}

//Unfollow a user
function unfollow(user, target){
    fetch('../unfollow/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user: user,
            target: [target],
        }),
    })
    .then(function(response) {
        //la risposta è un successo
        if(response.ok){
            alert("Non più seguito!");
            document.getElementById("btn_follow").disabled = false;
            document.getElementById("btn_unfollow").disabled = true;
        }
        //Da una spiegazione nel caso di fallimento 
        else {
            response.json().then(data => {
                alert(data.error)
            })
        }
    })
    .catch(error => console.log(error));
}