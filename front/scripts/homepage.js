//myStorage = window.sessionStorage;
loggedUser = {};
var articoli = [];

function setup_homepage(){
    // Se non è settato imposto i campi vuoti in modo che non dia errori
    if(sessionStorage.getItem('loggedUser') && sessionStorage.getItem('token')){
      getTagList(true);
      loggedUser = {
        username: sessionStorage.getItem('loggedUser'),
        token: sessionStorage.getItem('token')
      }
        document.getElementById("header_profile").innerHTML = loggedUser.username + "'s profile";
        document.getElementById("header_unlogged").hidden = true;
        document.getElementById("header_logged").hidden = false;
    }else{
        loggedUser = {};
        getTagList(false);
    }
    loadArticles();
    
}


/*
Una breve preview delgli articoli viene stampata nel div con id main_content
La forma è questa:

<article onclick="openArticle(" + indice_articolo + ")">
    <h2> Titolo articolo </h2>
    <em> Autore - Data </em>
</article>

Stampiamo 10 preview alla volta, fino ad un massimo di 50 (massimo ricevuto dalla chiamata)
Al termine dei 10 articoli stampiamo un pulsante che (se ci sono) permette di caricarne altri

Il parametro n è l'indice in articoli del prossimo elemento da stampare

*/

function printArticles(n){
  // Torno alla lista articoli
  backToList();
  if(n>0){
    // Se la chiamata proviene da pulsante "Carica altri" rimuoviamo il pulsante
    document.getElementById("btn_loadMore").remove();
  }else{
    //Cancelliamo la precedente ricerca
    document.getElementById("article_list").innerHTML = "";
  }
  let htmlOut = "";
  if(articoli.length==0){
    htmlOut = "<article> <h4>No article available</h4></article>";
  }
  
  if(n < articoli.length){
    for(i=n; i<n+10 && i<articoli.length; i++){
        htmlOut += '<article onclick="openArticle(' + i + ')">';
        htmlOut += '<h2>' + articoli[i].title + '</h2>';
        htmlOut += '<em> di ' + articoli[i].author + '</em>'
        htmlOut += '</article>';    
    }
    // Se rimangono articoli da stampare aggiungiamo il pulsante
    if(n+10 < articoli.length){
        htmlOut += '<button id="btn_loadMore" onclick="printArticles(' + n+10 + ')">Carica altri articoli</button>'
    }
  }
  // Inseriamo gli articoli a schermo
  document.getElementById("article_list").innerHTML += htmlOut;
}


// Con questa funzione effettuiamo la chiamata http e salviamo gli articoli 
function loadArticles(){
  // Torno alla lista articoli
  backToList();
  // Pulisco la lista
  document.getElementById("article_list").innerHTML = "";
  articoli = [];
  var text = document.getElementById("txt_search").value;
  if(text && text != ""){
      // Sanificazione dell'input
      text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }else{
      text="";
  }
  // Facciamo la chiamata
  fetch('../article/search/'+text, {
      method: 'GET',
      headers:{ 'Content-Type': 'application/json' }
  })
  .then((resp) => resp.json())
  .then(function(data){
      for(let i=0; i<data.length; i++){
          articoli[i] = data[i];
      }
      printArticles(0);
  })
.catch( error => console.log(error));
  return;
}

// Funzione per il click su un articolo
function openArticle(index){
  if(!articoli[index]){
      // Se l'articolo risulta mancate segnaliamo l'errore
      alert("Qualcosa è andato storto... prova a ricaricare la pagina");
  }else{
      // Otteniamo e info dell'articolo
      // fetch su articolo
      /*
          Stampiamo l'articolo selezionato in questo formato

          <button id="btn_backToList" onclick="backToList()">Torna a tutti gli articoli</button>
          <hr>
          <em> Scritto da [Autore] - il [Data]</em>
          <h2>Titolo</h2>
          <p>Summary</p>
          <br>
          <a>Leggi tutto</a>   
          
          A differenza di article_list nel momento in cui inseriamo l'innerHTML non facciamo += ma solo =, 
          così da sovrascrivere eventuali precedenti articoli
      */
      let htmlOut = '<button id="btn_backToList" onclick="backToList()">Torna a tutti gli articoli</button><hr>';
      url = '../article/'+ articoli[index].id + '/' + articoli[index].author;
      fetch(url, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
      })
      .then((resp) => resp.json())
      .then(function(data){
          htmlOut += '<em> Scritto da ' + data.author + ' - il ' + prettyTimeDate(data.date) + '</em>';
          htmlOut += '<h2>' + data.title + '</h2>';
          htmlOut += '<p>' + data.summary + '</p>';
          htmlOut += '<br><a href="readArticle.html?id=' + data.id + '&author=' + data.author + '">Leggi tutto</a>'; 
          document.getElementById('article_show').innerHTML= htmlOut;
      })
      .catch(error => console.error(error));
      
      // Scambiamo elementi da mostrare
      document.getElementById("article_list").hidden = true;
      document.getElementById("article_show").hidden = false;
  }
}
// Funzione per tornare alla lista degli articoli
// non serve rimuovere il contenuto dell'articolo, verrà sovrascritto
function backToList(){
  // Scambiamo elementi da mostrare
  document.getElementById("article_list").hidden = false;
  document.getElementById("article_show").hidden = true;
}


// Log out 
function logOut(){
    // "dimentico" l'utente
    loggedUser = {username: "", token: ""};    
    // Ricarico la pagina
    location.reload();
}

function prettyTimeDate(datetime){
  // Date
  let date = datetime.split("T")[0];
  let ymd = date.split("-");

  // Time
  let timez = datetime.split("T")[1];
  let time = timez.split(".")[0];

  return (time + " - " + ymd[2]+"/"+ymd[1]+"/"+ymd[0]);
}
