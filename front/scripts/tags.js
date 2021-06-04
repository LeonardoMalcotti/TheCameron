var myStorage = window.sessionStorage;
var loggedUser= myStorage.getItem('loggedUser');
var user;

function loadTag(){

  var user = getUrlVars()["user"];
  var tag = "";
  var htmlOutput = "";
  var tagFav;
  //ottengo i tag dell'utente, se esistono
  fetch('../tag/user/' + user , {
      method: 'GET',
      headers:{ 'Content-Type': 'application/json' }
  })
  .then((resp) => resp.json())
  .then(function(data){
    console.log(data);
      tagFav = data;
      for(i = 0; i < data.id.length; i++){
        tag += find(data.id[i]) + " - ";
      }
      document.getElementById('txt_tag').innerHTML = tag;
  })
  .catch( error => console.log(error));

  fetch('../tag', {
      method: 'GET',
      headers:{ 'Content-Type': 'application/json' }
  })
  .then((resp) => resp.json())
  .then(function(data){
      for(i = 0; i < data.length; i++){
        if(!tagFav.id.includes(data[i].id)){
          htmlOutput += '<button type="button" id="' + data[i].id + '" name="' + data[i].name + '" onclick="addTag()"';
        }
      }
  })
  .catch( error => console.log(error));
}

function find(id){
  fetch('../tag/id/' + id, {
      method: 'GET',
      headers:{ 'Content-Type': 'application/json' }
  })
  .then((resp) => resp.json())
  .then(function(data){
    if(data.length > 0)
      return data.name;
  })
  .catch( error => console.log(error));
}

function addTag(){
    var addid =  event.target.id;
    var user = loggedUser.username;

    fetch('..tag/user/' + user, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        id : addid,
        username : user
      }),
    })
    .then(function(response) {
      if(response.ok){
          alert("Tag aggiunto");
      }
      else {
        response.json().then(data => {
            alert(data.error)
        })
      }
    })
    .catch( error => console.log(error));
    loadTag();
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
