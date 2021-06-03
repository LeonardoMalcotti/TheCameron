var myStorage = window.sessionStorage;
var loggedUser= myStorage.getItem('loggedUser');
var articoli = [];

function loadSave()
{
    if(loggedUser.username){

        var url = '../savedArticles/' + loggedUser.username;
        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            })
            .then((resp) => resp.json())
            .then(function(data)
            {
              // Facciamo la chiamata
                  for(let i=0; i<data.length; i++){
                      articoli[i] = data[i];
                  }
                  printArticles();
              })
            .catch( error => console.log(error));
              return;
            });
    }
}

function printArticles(){
    let htmlOut = "";
        for(i = 0; i < articoli.length; i++){
            htmlOut += '<article onclick="openArticle(' + articoli[i].id + "," + articoli[i].author + ')">';
            htmlOut += '<h2>' + articoli[i].title + '</h2>';
            htmlOut += '<em> di ' + articoli[i].author + '</em>'
            htmlOut += '</article>';
        }
    }
    // Inseriamo gli articoli a schermo
    document.getElementById("article_list").innerHTML += htmlOut;
}

function Save(id, author){

    let url = "../savedArticles/";

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            id : id,
            author : author
        }),
    })
    .then(function(response) {
        if(response.ok){
            alert("Articolo salvato");
        }
        else {
          response.json().then(data => {
              alert(data.error)
          })
        }
    })
    .catch( error => console.log(error));
    return;
}

function openArticle( id, author){
    window.open("..readArticle.html?id="+id+"&author="+author);
}

function deleteArticle(id, author){
    var url = '../savedArticles/';
    fetch(url, {
        method: 'DELETE',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id : id,
            author : author
        }),
    })
    .then((response) => response.json())
    .then(function(response) {
        if(response.ok){
            alert("Articolo eliminato dagli articoli salvati");
        }
        else {
          response.json().then(data => {
              alert(data.error)
          })
        }
    })
    .catch( error => console.log(error));
    return;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function checkSave(){
    if(loggedUser.id){
        var html="<button type='button' onclick='Save("+loggedUser.id+","+document.getElementById('author').value+") class='btnSalv'>Salva tra i preferiti</button>";
        document.getElementById("saveIfLogged").innerHTML=html;
    }
}