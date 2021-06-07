var myStorage = window.sessionStorage;
var loggedUser= {username:null, token:null};
var articolo = {};
var tagIds = [];
var authorized;
/*
[done]
 loadArticles() effettua il fetch sull'articolo e lo salva, poi controlla la restrizione
- Se è ristretto lancia checkRestriction()
- se non è ristretto procede con loadTags()
infine chiama handleReaction() 

[done]
checkRestriction() effettua il fetch per verificare se l'utente è autorizzato
- se lo è procede con loadTags()
- se non lo è cambia il testo dell'articolo e procede con printArticle() (salta i tag)

[done]
loadTags() effettua un fetch per ottenere tutti i tag e verifica quali tag ha l'articolo (salvati in tagIds[])
Salva i nomi dei tag tra le info dell'articolo e chiama printArticle()

[done]
printArticle() stampa le info presenti in articolo, poi chiama getInfoAuthor()

[done]
getInfoAuthor() ottiene info sull'autore dell'articolo e le stampa a video nell'<aside>

[da testare]
handleReactions() si occupa ottenere le reazioni sull'articolo, visualizzarle, e gestire i pulsanti (dipende dall'utente)

[da testare]
addReaction() aggiunge una reazione

[da testare]
saveArticle() salva l'articolo tra i preferiti dell'utente
*/

function loadArticle(){
  // Se l'utente è loggato cambiamo il navbar di conseguenza
  if(sessionStorage.getItem('loggedUser')){
    loggedUser.username = sessionStorage.getItem('loggedUser');
    loggedUser.token = sessionStorage.getItem('token');
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
    method: 'GET'
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
      document.getElementById("infoAutore").innerHTML = htmlAuthor;
    }
    else{
      alert("Somethong went wrong while getting the author's infos");
    }
  })
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
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      id : getUrlVars()["id"],
      author : getUrlVars()["author"],
      username : loggedUser.username,
      reaction : num_reaction,
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
    headers: { 'Content-Type': 'application/json' },
  })
  .then((resp) => resp.json())
  .then(function(data) {
  for(x in data){
    num_reactions[parseInt(data.reaction,10)-1]++;
  } 
  document.getElementById('react_badge_1').innerHTML = ""+num_reactions[0];
  document.getElementById('react_badge_2').innerHTML = ""+num_reactions[1];
  document.getElementById('react_badge_3').innerHTML = ""+num_reactions[2];
  document.getElementById('react_badge_4').innerHTML = ""+num_reactions[3];
  })
  .catch( error => console.error(error) );
}

function saveArticle(){
  // Aggiungo l'articolo ai salvati
  fetch("../savedArticle/",{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id : getUrlVars()["id"],
      author : getUrlVars()["author"],
      username : loggedUser.username,
      reaction : num_reaction,
    }),
  })
  .then(function(data) {
    if(!data.ok){
      alert("An error occurred while saving the article, maybe you already saved it?");
    }
    else{
      alert("Article saved!");
    }
  })
  .catch( error => console.error(error) );
}