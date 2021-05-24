// Retrieve the usernames of users we are followed by
function getFollowers(user){
    fetch('followers/user/' + user + '/followers/', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then((resp) => resp.json())
    .then(async function(data){
        console.log(data);
        
        /*
        let htmlOut = "<ul>";
        for(let i=0; i<data.length; i++){
            // data[i].username
            htmlOut += ("<li>" + data[i].username + "</li>");
        }
        htmlOut += "</ul>";
        document.getElementById("followers").innerHTML = htmlOut;
        */
    })
    .catch(error => console.log(error));
}

// Retrieve the usernames of the users that our user is following
function getFollowing(user){
    fetch('followers/user/' + user + '/following/', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
    .then((resp) => resp.json())
    .then(async function(data){
        console.log(data);

        
        
        /*
        let htmlOut = "<ul>"
        for(let i=0; i<data.length; i++){
            // data[i].username
            htmlOut += ("<li>" + data[i].username + "</li>");
        }
        htmlOut += "</ul>";
        document.getElementById("following").innerHTML = htmlOut;
        */
    })
    .catch(error => console.log(error));
}

// Follow a user
function follow(user, target){
    fetch('followers/follow/', {
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
    fetch('followers/unfollow/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user: user,
            target: target,
        }),
    })
    .then(function(response) {
        //la risposta è un successo
        if(response.ok){
            alert("Non più seguito!");
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