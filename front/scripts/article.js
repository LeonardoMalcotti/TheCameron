var myStorage = window.sessionStorage;
var loggedUser= {username:null, token:null};
var articolo = {};
var tagIds = [];
var authorized;
/*
loadArticles() effettua il fetch sull'articolo e lo salva, poi controlla la restrizione
  - Se è ristretto lancia checkRestriction()
  - se non è ristretto procede con loadTags()
  infine chiama handleReaction() 

checkRestriction() effettua il fetch per verificare se l'utente è autorizzato
  - se lo è procede con loadTags()
  - se non lo è cambia il testo dell'articolo e procede con printArticle() (salta i tag)

loadTags() effettua un fetch per ottenere tutti i tag e verifica quali tag ha l'articolo (salvati in tagIds[])
  Salva i nomi dei tag tra le info dell'articolo e chiama printArticle()

printArticle() stampa le info presenti in articolo, poi chiama getInfoAuthor()

getAuthorInfo() ottiene info sull'autore dell'articolo e le stampa a video nell'<aside>

handleReactions() si occupa ottenere le reazioni sull'articolo, visualizzarle, e gestire i pulsanti (dipende dall'utente)
  Verifica se è già presente una reazione e cambia il pulsante di conseguenza

addReaction() aggiunge una reazione

changeReaction() viene invocata da addReaction() qualora sia già presente una reazione all'articolo da parte dell'utente
  , la rimuove, e se è stata scelta una nuova reazione la crea

saveArticle() salva l'articolo tra i preferiti dell'utente

isFollowing() controlla se l'autore è tra gli utenti seguiti e decide che pulsante stampare
  viene chiamata solo se user != author e se l'utente ha fatto il login

follow() aggiunge l'autore ai seguiti

unfollow() toglie l'autore dai seguiti
*/

function loadArticle(){
  // Se l'utente è loggato cambiamo il navbar di conseguenza
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

  var id = getUrlVars()["id"];
  var author = getUrlVars()["author"];
  
  // GET articolo, lo salviamo e ne verifichiamo lo status
  var url = '../article/' + id + '/' + author;    //Costruisco l'url con l'id
  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((resp) => resp.json())
  .then(function(data) {
    // Salvo le info dell'articolo ricevuto
    articolo = {
      title: data.title,
      summary: data.summary,
      author: data.author,
      text: data.text,
      date: data.date,
      tags: [],
      restricted: data.restricted,
      };
      // Mi salvo a parte gli id dei tag
      for(x in data.tags){
        if(!tagIds.includes(data.tags[x])){
          tagIds.push(data.tags[x]);
        }
      }
    // Verifico la restrizione 
    if(data.restricted){
      // Articolo ristretto
      checkSubscription(sessionStorage.getItem("loggedUser"), id, author);
    }else{
      // Imposto authorized = true
      authorized = true;
      // Articolo non ristretto
      loadTags();
      
    }

  })
  .catch( error => console.error(error) );
  //handleReactions(id, author);
}

// Controllo se l'utente è autorizzato
function checkSubscription(user, id, author){
  let url = "/restricted/article/"+id+"/"+author+"/user/"+user;
  fetch(url, {
    method: 'GET',
    headers: {'token': loggedUser.token }
  })
  .then(function(response) {
    if(response.ok){
      authorized = true;
      loadTags();
    }else{
      // setto authorized = false
      authorized = false;
      // Elimino il testo dell'articolo
      articolo.text = "<b>This article is restricted. Make a subscription to read it</b>";
      printArticle();
    }
  })
  .catch( error => console.error(error.status));
}

function loadTags(){
  if(tagIds.length>0){
    // Ottengo la lista dei tag
    fetch('../tag', {
      method: 'GET',
      headers:{ 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function(data){
        for(i in data){
          // Se fa parte dei tag dell'articolo (abbiamo gi id) aggiungiamo il nome alla lista dei tag in articolo
          if(tagIds.includes(data[i].id.toString())){
            articolo.tags.push(data[i].name);
          }
        }
        printArticle();
    })
    .catch( error => console.log(error));
  }else{
    // Se non abbiamo tag procediamo alla stampa dell'articolo
    printArticle();
  }
  
}

function printArticle(){
  // Stampo le info "pubbliche" dell'articolo
  document.getElementById("txt_title").innerHTML = articolo.title;
  document.getElementById("txt_summary").innerHTML = articolo.summary;
  document.getElementById("txt_date").innerHTML = articolo.date;
  // Avendone cambiato il testo in caso ristretto, stampo anche il testo
  document.getElementById("txt_text").innerHTML = articolo.text;
  // Controllo cosa devo stampare poi
  // questa funzione viene chiamata dopo che authorized viene valorizzato
  // non dovrebbe arrivarci un authorized non definito, ma controlliamo
  if(authorized != false){
    document.getElementById("txt_text").innerHTML = articolo.text;
    // Stampo i tags
    text_tags = "";
    for( x in articolo.tags){
      text_tags += articolo.tags[x] + ", ";
    }
    document.getElementById("txt_tag").innerHTML = text_tags;
    // Procedo con l'ottenere info sull'autore dell'articolo
    getAuthorInfo(articolo.author);
    // E lancio la funzione che si occupa delle reazioni
    handleReactions();
  }else{
    document.getElementById("span_Tags").innerHTML = '<button onclick="document.location.href=\'subscription.html\';';
    // Blocco anche le info sull'autore
    let htmlAuthor = "<p><b>" + articolo.author + "</b>";
    htmlAuthor += " ha riservato questo articolo per i soli abbonati</p>";
    document.getElementById("infoAutore").innerHTML = htmlAuthor;
  }
}

function getAuthorInfo(author){
  fetch("../user/"+author, {
    method: 'GET',
  })
  .then((resp) => resp.json())
  .then(function(data) {
    if(data){
      let htmlAuthor = "<p>Scritto da: <b>"+data.name+" "+data.surname+"</b></p>";
      htmlAuthor += "<p>email: "+data.email+"</p>";
      htmlAuthor += "<p>username: "+data.username+"</p>";
      // Se l'utente è loggato e l'autore non è l'utente verifico i follow
      if(loggedUser.username && data.username != loggedUser.username){
        isFollowing(data.username);
      }
      document.getElementById("infoAutore").innerHTML = htmlAuthor;
    }
    else{
      alert("Somethong went wrong while getting the author's infos");
    }
  })
  .catch( error => console.log(error));
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function addReaction(num_reaction){
  var url="../reaction"
  fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'token': loggedUser.token
    },
    body: JSON.stringify({
      reaction : num_reaction,
      id : getUrlVars()["id"],
      author : getUrlVars()["author"],
      username : loggedUser.username,
    }),
  })
  .then(function(response) {
    if(response.ok){
      // Se è andata a buon fine ricarico le reazioni
      handleReactions();
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

function handleReactions(){
  let id = getUrlVars()["id"];
  let author = getUrlVars()["author"];
  let num_reactions = [0,0,0,0];
  
  // Carica le reazioni
  url="../reaction/"+id+"/"+author;
  fetch(url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'token': loggedUser.token
    },
  })
  .then((resp) => resp.json())
  .then(function(data) { 
    for(x in data){
      let myReact = parseInt(data.reaction,10);
      if(data[x].username == loggedUser.username){
        // Se l'utente ha già una reazione cerco quale pulsante modificare
        let button, span;
        if(myReact==1){
          button = document.getElementById('btn_react_1');
          span = document.getElementById('span_react_1');
        } else
        if(myReact==2){
          button = document.getElementById('btn_react_2');
          span = document.getElementById('span_react_2');
        } else
        if(myReact==3){
          button = document.getElementById('btn_react_3');
          span = document.getElementById('span_react_3');
        } else
        if(myReact==4){
          button = document.getElementById('btn_react_4');
          span = document.getElementById('span_react_4');
        }
        // Modifico il testo e il parametro passato
        span.innerHTML += " &otimes; ";
        button.addEventListener('click', addReaction(0)); 
        button.style.border = "3px solid var(--color2)"
      }
      num_reactions[myReact-1]++;
    } 
    document.getElementById('react_badge_1').innerHTML = ""+num_reactions[0];
    document.getElementById('react_badge_2').innerHTML = ""+num_reactions[1];
    document.getElementById('react_badge_3').innerHTML = ""+num_reactions[2];
    document.getElementById('react_badge_4').innerHTML = ""+num_reactions[3];
  })
  .catch( error => console.error(error) );
}

function saveArticle(){
  let user, id, author;
  user = sessionStorage.getItem("loggedUser");
  id = getUrlVars()["id"];
  author = getUrlVars()["author"];
  if(user && id && author){
    // Aggiungo l'articolo ai salvati
    fetch("../savedArticle/",{
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'token': loggedUser.token
      },
      body: JSON.stringify({
        username : user,
        id : id,
        author : author,
      }),
    })
    .then(function(data) {
      if(!data.ok){
        alert("An error occurred while saving the article, maybe you already saved it?");
        data.json().then(data => {
          console.log(data.error);
      })
      }
      else{
        alert("Article saved!");
      }
    })
    .catch( error => console.error(error) );
  }else{
    alert(user + " " + id + " " + author);
  } 
}

function isFollowing(target){
  fetch("../followers/user/"+loggedUser.username+"/following", {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'token': loggedUser.token
    },
  })
  .then((resp) => resp.json())
  .then(async function(data){
    let flwd = [];
    // We obtain an object containing an array named users
    if(data.users){
      flwd = data.users;
    }    
    htmlBtn = "";
    // Utente già seguito
    if(flwd.includes(target)){
      htmlBtn += "<button onclick='unfollow(\""+target+"\")'>Unfollow</button>";
    }// Utente non seguito
    else{
      htmlBtn += "<button onclick='follow(\""+target+"\")'>Follow</button>";
    }
    document.getElementById('div_follow').innerHTML = htmlBtn;   
  })
  .catch( error => console.error(error) );
  return;
}
function follow(target){
  fetch("../followers/follow", {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'token': loggedUser.token
    },
    body: JSON.stringify({
      user: loggedUser.username,
      target: target
    }),
  })
  .then(function(data){
    if(!data.ok){
      data.json().then(data => {
          alert(data.error)
          console.log(loggedUser.username+" "+target);
      })
    }else{
      alert("Hai iniziato a seguire "+target);
      isFollowing(target);
    }
  })
  .catch( error => console.error(error) );
}
function unfollow(target){
  fetch("../followers/unfollow", {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'token': loggedUser.token
    },
    body: JSON.stringify({
      user : loggedUser.username,
      target : target,
    }),
  })
  .then(function(data){
    if(!data.ok){
      response.json().then(data => {
          alert(data.error)
      })
    }else{
      alert("Non segui più "+target);
      isFollowing(target);
    }
  })
  .catch( error => console.error(error) );
}