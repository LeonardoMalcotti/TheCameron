var myStorage = window.sessionStorage;
var loggedUser= {username:null, token:null};
var articolo = {};
var tagIds = [];
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

[to-do]
getInfoAuthor() ottiene info sull'autore dell'articolo e le stampa a video nell'<aside>

[to-do]
handleReactions() si occupa ottenere le reazioni sull'articolo, visualizzarle, e gestire i pulsanti (dipende dall'utente)
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
    loggedUser = {};
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
      // Articolo non ristretto
      loadTags();
    }

  })
  .catch( error => console.error(error) );
  //handleReactions(id, author);
}

// Controllo se l'utente è autorizzato
function checkSubscription(user, id, author){
  let url = "../restricted/article/"+id+"/"+author+"/user/"+user;
  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json'},
  })
  .then(function(response) {
    if(response.ok){
      loadTags();
    }else{
      // Cambio il testo delll'articolo
      articolo.text = "<b>This article is restricted. Make a subscription to read it</b>";
      printArticle();
    }
  })
  .catch( error => console.log(error));
}

function loadTags(){
  console.log("Tags");
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
          if(!(tagIds.includes(data[i].id))){
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
  // Stampo le info dell'articolo
  document.getElementById("txt_title").innerHTML = articolo.title;
  document.getElementById("txt_summary").innerHTML = articolo.summary;
  document.getElementById("txt_text").innerHTML = articolo.text;
  document.getElementById("txt_date").innerHTML = articolo.date;
  // Stampo i tags
  text_tags = "";
  for( x in articolo.tags){
    text_tags += articolo.tags[x] + ", ";
  }
  document.getElementById("txt_tag").innerHTML = text_tags;
  // Procedo con l'ottenere info sull'autore dell'articolo
  getAuthorInfo(articolo.author);
}

function getAuthorInfo(author){
  return;
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

function handleReactions(id, author){
   // Load the reactions to the article
   url="../reaction/"+id+"/"+author;
   fetch(url, {
     method: 'GET',
     headers: { 'Content-Type': 'application/json' },
   })
   .then((resp) => resp.json())
   .then(function(data) {
     /*var like=data.reaction.filter(tmp=> tmp.reaction=1);
     var dislike=data.reaction.filter(tmp=> tmp.reaction=2);
     var love=data.reaction.filter(tmp=> tmp.reaction=3);
     var amazing=data.reaction.filter(tmp=> tmp.reaction=4);
     document.getElementById('1').value =like.length ;
     document.getElementById('2').value = dislike.length;
     document.getElementById('3').value= love.length;
     document.getElementById('4').value = amazing.length;*/
   })
   .catch( error => console.error(error) );
 
   if(loggedUser==null){
     document.getElementById('1').disabled=true;
     document.getElementById('2').disabled=true;
     document.getElementById('3').disabled=true;
     document.getElementById('4').disabled=true;
   }
}