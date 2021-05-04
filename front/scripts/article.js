var myStorage = window.sessionStorage;
var loggedUser= myStorage.getItem('loggedUser');

function loadArticle(){

  var id = getUrlVars()["id"];
  var author = getUrlVars()["author"];
  var url = '../article/' + id + '/' + author;    //Costruisco l'url con l'id

  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((resp) => resp.json())
  .then(function(data) {
    document.getElementById('txt_title').innerHTML = data.title;
    document.getElementById('txt_summary').innerHTML = data.summary;
    document.getElementById('txt_author').innerHTML = data.author;
    document.getElementById('txt_text').innerHTML = data.text;
    document.getElementById('txt_date').innerHTML = data.date;
    document.getElementById('txt_tag').innerHTML = data.tag;
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
        alert("Articolo creato");
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
