var myStorage = window.sessionStorage;
var loggedUser= {};
var articolo = {};

function loadArticle(){

  if(sessionStorage.getItem('loggedUser')){
    loggedUser.username = sessionStorage.getItem('loggedUser');
    loggedUser.token = sessionStorage.getItem('token');
    document.getElementById("header_profile").innerHTML = loggedUser.username + "'s profile";
    document.getElementById("header_unlogged").hidden = true;
    document.getElementById("header_logged").hidden = false;
  }else{
    loggedUser = {};
  }

  var id = getUrlVars()["id"];
  var author = getUrlVars()["author"];
  var url = '../article/' + id + '/' + author;    //Costruisco l'url con l'id

  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((resp) => resp.json())
  .then(function(data) {
    if(data.restricted){
      articolo = data;
      checkSubscription(loggedUser.username, id, author);
    }else{
      document.getElementById('txt_title').innerHTML = data.title;
      document.getElementById('txt_summary').innerHTML = data.summary;
      document.getElementById('txt_author').innerHTML = data.author;
      document.getElementById('txt_text').innerHTML = data.text;
      document.getElementById('txt_date').innerHTML = data.date;
      var htmlOut="";
      for(x in data.tags){
        htmlOut += "<span>+"+data.tags[x]+"</span>"
      }
      document.getElementById('txt_tag').innerHTML = htmlOut;
    }
  })
  .catch( error => console.error(error) );

  url="../reaction/"+id+"/"+author;
  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((resp) => resp.json())
  .then(function(data) {
    var like=data.reaction.filter(tmp=> tmp.reaction=1);
    var dislike=data.reaction.filter(tmp=> tmp.reaction=2);
    var love=data.reaction.filter(tmp=> tmp.reaction=3);
    var amazing=data.reaction.filter(tmp=> tmp.reaction=4);
    document.getElementById('1').value =like.length ;
    document.getElementById('2').value = dislike.length;
    document.getElementById('3').value= love.length;
    document.getElementById('4').value = amazing.length;
  })
  .catch( error => console.error(error) );

  if(loggedUser==null){
    document.getElementById('1').disabled=true;
    document.getElementById('2').disabled=true;
    document.getElementById('3').disabled=true;
    document.getElementById('4').disabled=true;
  }
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function addReaction(){
  var url="../reaction"

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      id : getUrlVars()["id"],
      author : document.getElementById("txt_summary").value,
      username : loggedUser.username,
      reaction : event.target.id,
    }),
  })
  .then(function(response) {
    if(response.ok){
        
    }
    else {
      response.json().then(data => {
          alert(data.error)
      })
    }
  })
  .catch( error => console.log(error));
  loadArticle();
  return;
}

function checkSubscription(user, id, author){
  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      id : getUrlVars()["id"],
      author : document.getElementById("txt_summary").value,
      username : loggedUser.username,
      reaction : event.target.id,
    }),
  })
  .then(function(response) {
    if(response.ok){
      document.getElementById('txt_title').innerHTML = articolo.title;
      document.getElementById('txt_summary').innerHTML = articolo.summary;
      document.getElementById('txt_author').innerHTML = articolo.author;
      document.getElementById('txt_text').innerHTML = articolo.text;
      document.getElementById('txt_date').innerHTML = articolo.date;
    }
  })
  .catch( error => console.log(error));
}