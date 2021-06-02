//myStorage = window.sessionStorage;
loggedUser = {};
var articoli = [];

function setup_homepage(){
    // Se non è settato imposto i campi vuoti in modo che non dia errori
    if(sessionStorage.getItem('loggedUser')){
        loggedUser.username = sessionStorage.getItem('loggedUser');
        loggedUser.token = sessionStorage.getItem('token');
        document.getElementById("header_profile").innerHTML = loggedUser.username + "'s profile";
        document.getElementById("header_unlogged").hidden = true;
        document.getElementById("header_logged").hidden = false;
    }else{
        loggedUser = {};
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
    if(n>0){
        // Se la chiamata proviene da pulsante "Carica altri" rimuoviamo il pulsante
        document.getElementById("btn_loadMore").remove();
    }
    let htmlOut = "";
    if(n < articoli.length){
        for(i=n; i<n+10 && i<articoli.length; i++){
            htmlOut += '<article onclick="openArticle(' + i + ')">';
            htmlOut += '<h2>' + articoli[i].title + '</h2>';
            htmlOut += '<em> di ' + articoli[i].author + '</em>'
            htmlOut += '</article>';    
        }
        // Se rimangono articoli da stampare aggiungiamo il pulsante
        if(n+10 < articoli.length){
            htmlOut += '<button id="btn_loadMore" onclick="printArticles(' + n+10 + ')"></button>'
        }
    }
    // Inseriamo gli articoli a schermo
    document.getElementById("article_list").innerHTML += htmlOut;
}


// Con questa funzione effettuiamo la chiamata http e salviamo gli articoli 
function loadArticles(){
    // Facciamo la chiamata
    fetch('../article/search/', {
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
            htmlOut += '<em> Scritto da ' + data.author + ' - il ' + data.date + '</em>';
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