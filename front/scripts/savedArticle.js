var myStorage = window.sessionStorage;
var loggedUser= myStorage.getItem('loggedUser');
function loadSave()
{
    if(loggedUser.username){
        var id = getUrlVars()["id"];
        var author = getUrlVars()["author"];
        var url = '../savedArticles/user/' + loggedUser.username + '/author/' + author+"/id"+id; 
        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            })
            .then((resp) => resp.json())
            .then(function(data) 
            {
                if(data){
                    document.getElementById("saveIfLogged").innerHTML= "<input type='button onclick='Save()' id='save'>";
                }
            });
    }
}

function Save(){
    let url = "../savedArticles/user/"+loggedUser.username;
    var id = getUrlVars()["id"];
    var author = getUrlVars()["author"];
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            id,
            author,
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

function getArticles(){
    let url = "../savedArticle/user/"+loggedUser.username;
    var i;
    var htmlOut="";
    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        })
        .then((resp) => resp.json())
        .then(function(data) 
        {
            for( i=0;i<data.id.lenght;i++){
                htmlOut+="<input type='button' onClick='operArticle("+data[i].id+","+data[i].author")'><span>Title: "+data[i].title+"</span><br><span>Author :"+data[i].author+"
                </span><br><input type='button' onclick='deleteArticle("+data[i].id+","+data[i].author")'>Cancella</input></input><br>"
            }
        });
        .catch( error => console.log(error));
    document.getElementById("savedArticles").innerHTML=htmlOut;
    return;
}

function openArticle(var id, var author){
    window.open("../pages/article?id="+id+"&author="+author);
}

function deleteArticle(var id, var author){
    var url = '../savedArticles/user/' + loggedUser.username + '/author/' + author+"/id"+id; 
    fetch(url, {
        method: 'DELETE',
        headers:{ 'Content-Type': 'application/json' }
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

