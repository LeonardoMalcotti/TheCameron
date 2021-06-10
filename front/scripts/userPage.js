loggedUser = {};
savedArt = [];

function setup_User(){
  if(sessionStorage.getItem('loggedUser') && sessionStorage.getItem('token')){
    loggedUser = {
      username: sessionStorage.getItem('loggedUser'),
      token: sessionStorage.getItem('token')
    }
    document.getElementById("header_profile").innerHTML = loggedUser.username + "'s profile";
    // Ogni funzione carica una cosa diversa
    getUserInfo(loggedUser.username);
    isSubscribed(loggedUser.username);
    getMyArticles(loggedUser.username);
    getFollowers(loggedUser.username);
    getFollowing(loggedUser.username);
    getSavedArticles(loggedUser.username);
    getSavedTags(loggedUser.username);
  
  }else{
    loggedUser = {};
    document.location.href = "./login.html";
  }
}

// Info about the user
function getUserInfo(user){
  fetch("/user/"+user, {
    method:"GET",
    headers: {'Content-Type':'application/json'},
  })
  .then((resp) => resp.json())
  .then(function (data) {
    // Componiamo l'output e lo stampiamo in infoUser
    let htmlOut = "Full name: " + data.name + " " + data.surname + "<br>";
    htmlOut += "Username: " + data.username + "<br>";
    htmlOut += "Email: " + data.email;
    document.getElementById("infoUser").innerHTML = htmlOut;
  })
  .catch((error) => console.log("error: "+error));
}

//Se l'utente è abbonato cambiamo il pusante subscribe 
function isSubscribed(user){
  fetch("/user/"+user+"/subscription",{
    method: 'GET',
    headers: {'Content-Type':'application/json'},
  })
  .then((resp) => resp.json())
  .then(function (data){
    if(data.username){
      document.getElementById("btn_subscribe").disabled = true;
      document.getElementById("btn_subscribe").innerHTML = "Subscribed user";
    }
  })
  .catch((error) => console.log("error: "+error));
}

//Ottengo la lista degli articoli scritti dall'utente
function getMyArticles(user) {
  fetch("/article/"+user, {
    method: 'GET',
    headers: {'Content-Type':'application/json'},
  })
  .then((resp) => resp.json())
  .then(function (data){
    let htmlOut = "Your articles:<hr>"; 
    if(data[0]){
      for(x in data){
        htmlOut += data[x].title;
        htmlOut += " <button onclick='viewArticle(" + data[x].id + ", \"" + user +"\")'>Read article</button><br>";
      }
    }else{
      htmlOut += "You haven't written any article";
    }
    
    document.getElementById("your_articles").innerHTML = htmlOut;
  })
  .catch((error) => console.log("error: "+error));
}

// Retrieve the usernames of users we are followed by
function getFollowers(user){
  fetch('followers/user/' + user + '/followers/', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
  })
  .then((resp) => resp.json())
  .then(async function(data){
      // We obtain an object containing an array named users
      let flwd = data.users;     
      let htmlOut = "Followed by: <hr>"
      if(flwd && flwd[0]){
        for(i in flwd){
          htmlOut += ( flwd[i] + "<br>");
        }
      }else{
        htmlOut += "0 users are following you";
      }
      
      document.getElementById("followers").innerHTML = htmlOut;
  })
  .catch(error => console.log(error));
}

// Retrieve the usernames of the users that our user is following
function getFollowing(user){
  fetch('followers/user/' + user + '/following/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': loggedUser.token
      }
  })
  .then((resp) => resp.json())
  .then(async function(data){
    // We obtain an object containing an array named users
    let flwd = data.users;     
    let htmlOut = "Following:<hr>";
    if(flwd && flwd[0]){
      for(i in flwd){
        htmlOut += flwd[i];
        htmlOut += " <button onclick='unfollow(\"" + user + "\", \"" + flwd[i] +"\")'>Unfollow</button><br>";
      }
    }else{
      htmlOut += "You aren't following any user";
    }
    document.getElementById("following").innerHTML = htmlOut;
  })
  .catch(error => console.log(error));
}

function getSavedArticles(user){
  fetch("/savedArticle/"+user, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': loggedUser.token
    }
  })
  .then((resp) => resp.json())
  .then(async function(data){
    if(data[0]){
      for(x in data){
        savedArt.push({id: data[x].id, author: data[x].author});
      } 
    }
    printSavedArticles();
  })
  .catch(error => console.log(error));
}

// Ci serve per ottenere il titolo degli articoli
function printSavedArticles(){
  let htmlOut = "Saved articles: <hr>";
  if(savedArt.length > 0 && savedArt[0].id && savedArt[0].author){
    for(i in savedArt){
      fetch("../article/"+savedArt[i].id + "/" +savedArt[i].author, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      })
      .then((resp) => resp.json())
      .then(function(data){
        htmlOut += data.title;
        htmlOut += "<button onclick='viewArticle(" + data.id + ", \"" + data.author +"\")'>Read article</button><br>";
        document.getElementById("savedArticles").innerHTML = htmlOut;
      })
      .catch(error => console.error(error));
    }
  }else{
    savedArt = [];
    htmlOut += "You have 0 saved articles";
    document.getElementById("savedArticles").innerHTML = htmlOut;
  }
  
}

function getSavedTags(user){
  fetch("../tag/user/"+user, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': loggedUser.token
    },
  })
    .then(function(resp) {
      let htmlOut = "Saved tags: <hr>";
      if(resp.ok){
        resp.json().then(data =>{
          if(data && data[0]){
            for(x in data){
              htmlOut += data[x].name; 
              htmlOut += "<br>";
            }
          }else{
            htmlOut += "You haven't saved any tag";
          }
          document.getElementById("savedTags").innerHTML = htmlOut;
        })
      }else{
        htmlOut += "You haven't saved any tag";
        document.getElementById("savedTags").innerHTML = htmlOut;
      }
    })
    .catch(error => console.error(error));
}

function viewArticle(id, author){
  document.location.href = "readArticle.html?id="+id+"&author="+author;
}

function redirectSubscription(){
  window.location.href = "subscription.html";
}

function unfollow(user, target){
  fetch('followers/unfollow/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': loggedUser.token
      },
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