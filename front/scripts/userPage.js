loggedUser = {};

function setup_User(){
  if(sessionStorage.getItem('loggedUser')){
    loggedUser.username = sessionStorage.getItem('loggedUser');
    loggedUser.token = sessionStorage.getItem('token');
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
    for(x in data){
      htmlOut += data[x].title;
      htmlOut += " <button onclick='deleteArticle(" + data[x].id + ", " + user +")'>Delete</button>";
      htmlOut += " <button onclick='viewArticle(" + data[x].id + ", " + user +")'>Read article</button>";
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
      for(i in flwd){
        htmlOut += ( flwd[i] + "<br>");
      }
      htmlOut += "</ul>";
      document.getElementById("followers").innerHTML = htmlOut;
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
      // We obtain an object containing an array named users
      let flwd = data.users;     
      let htmlOut = "Following: <hr>"
      for(i in flwd){
        htmlOut += flwd[i];
        htmlOut += " <button onclick='unfollow(" + user + ", " + flwd[i] +")'>Unfollow</button><br>";
      }
      
      document.getElementById("following").innerHTML = htmlOut;
      
  })
  .catch(error => console.log(error));
}

function getSavedArticles(user){
  
}

function getSavedTags(user){

}

function deleteArticle(id, author){

}
function viewArticle(id, author){

}
function redirectSubscription(){
  window.location.href = "subscribe.html";
}