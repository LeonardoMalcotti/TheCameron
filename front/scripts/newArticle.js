loggedUser = {};

function setup_newArt(){
  if(sessionStorage.getItem('loggedUser') && sessionStorage.getItem('token')){
    loggedUser = {
      username: sessionStorage.getItem('loggedUser'),
      token: sessionStorage.getItem('token')
    };
    document.getElementById("header_profile").innerHTML = loggedUser.username + "'s profile";
  }else{
    loggedUser = {};
    document.location.href = "./index.html";
  }
}

function newArticle(){
  if(confirm("Sicuro di voler inviare?")){
   
    var strTags = document.getElementById("tag").value;
    
    strTags.replace(/%20/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\s/g, '');
	  var tags = [];
    tags = strTags.split(",");
    tagIds = [];
    // Se ci sono tag ne ottengo gli id 
    if(tags && tags.length>0 && tags[0]!=""){
      fetch("/tag/",{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      .then((resp) => resp.json())
      .then(function (data) {
        for(x in data){
          if(tags.includes(data[x].name)){
            tagIds.push(data[x].id);
            tags.splice(tags.indexOf(data[x].name), 1);
          } 
        }
        // Aggiungiamo al db i tag nuovi
        addTagRec(tags,0);
        // lanciamo la funzione per la creazione dell'articolo 
        sendArticle(tagIds);
        return;
      })      
      .catch( error => console.log(error));
    }
  }
}

function addTagRec(tags, i){
  if(i>=tags.length){
    return;
  }else{
    fetch("/tag/"+tags[i], {
      method:"POST",
    })
    .then(function(response) {
      if(!response.ok){
        console.log(tagName + " non aggiunto");
      }
      addTagRec(tags, i+1);
      return;
    })
    .catch( error => console.log(error));
  }
}


function sendArticle(tags){
	var url = '../article';
  var title = document.getElementById("title").value;
  var summary = document.getElementById("summary").value;
  var text = document.getElementById("text").value;
  var author = loggedUser.username;
  var restriction = document.getElementById("restriction").checked;
  // Sanificazione input
  title.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  summary.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  
	// Aggiunta articolo
  if(restriction){
    restriction = 'true';
  }else{
    restriction = 'false';
  }
    fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title : title,
				summary : summary,
				author : author,
				text : text,
				tags : tags,
				restricted : restriction
			}),
	})
	.then(function(response) {
    //la risposta è un successo
    if(response.ok){
      confirm("Articolo creato");
      window.location.href = "index.html";  
    }
    //Da una spiegazione nel caso di fallimento
    else {
      response.json().then(data => {
        alert(data.error)
      })
      }
    })
	.catch( error => console.log(error));

	return;
}
