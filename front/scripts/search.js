var userTagIds = [];

function applyFilter() {
	var author = document.getElementById("txt_author").value;
	var strTags = document.getElementById("txt_tags").value;
	strTags.replace(/%20/g, '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
	var tags = strTags.split(",");

	var url = '../article/filters?';
	if(author && author != ""){
		author.replace(/%20/g, '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
		url += ('author='+author);
	}
	if(tags && tags.length>0 && tags[0]!=""){
    let matched = 0;
    fetch("/tag/",{
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then((resp) => resp.json())
    .then(function (data) {
      for(x in data){
        if(tags.includes(data[x].name)){
          url += ('&tags[]='+data[x].id);
          matched++;
        }
      }
      // Se l'utente ha cercato almeno un tag  insesistente aggiungiamo la ricerca per un tag il cui id non esiste
      if(matched < tags.length){
        url += ('&tags[]=0');
      }
      advancedSearch(url);
      return;
    })   
    .catch( error => console.log(error));   
	}else{
    advancedSearch(url);
    return;
  }
}

function advancedSearch(url){
  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((resp) => resp.json())
  .then(async function(data){
    articoli = [];
    for(i=0; i<data.length; i++){
      articoli[i] = data[i];
    }
    printArticles(0);
  })
  .catch(error => console.log("errore: "+error));
}

function getTagList(isLogged){
  // Ottengo la lista dei tag
  fetch('../tag', {
    method: 'GET',
    headers:{ 'Content-Type': 'application/json' }
  })
  .then((resp) => resp.json())
  .then(function(data){
    let htmlOut = "Tag List<hr>";
    for(i in data){
        htmlOut += ( data[i].name);
        if(isLogged){ // Se l'utente è loggato aggiungo il pulsante per salvare il tag
          // Aggiungo il pulsante come hidden
          htmlOut += "<button id='btn_tag_"+data[i].id+"' onclick='saveTag("+data[i].id+")'>Save</button>";          
        }
        htmlOut += "<br>";
    }
    document.getElementById("aside_tags").innerHTML = htmlOut;  
  })
  .catch( error => console.log(error));
}

function saveTag(tag_id){
  if(sessionStorage.getItem('loggedUser') && sessionStorage.getItem('token')){
    // Aggiungo il tag ai preferiti
    fetch("../tag/user/"+sessionStorage.getItem('loggedUser'), {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': sessionStorage.getItem('token')
      },
      body: JSON.stringify({tag : tag_id}),
    })
    .then(function(data) {
      if(data.ok){
        alert("tag salvato");
        // Nascondo il pulsante salva
        document.getElementById("btn_tag_"+tag_id).style.visibility = "hidden";
      }
      else{
        data.json().then(data => {
          console.log(data.error);
        })
      }
    })
  }else{
    getTagList(false);
  }
}

function getUserTagList(){
  if(sessionStorage.getItem('loggedUser')){
    // Ottengo la lista dei tag
    fetch('../tag/user/'+sessionStorage.getItem('loggedUser'), {
      method: 'GET',
      headers:{ 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(function(data){
      userTags = [];
      if(!data.error){
        for(i in data){
          userTagIds[i] = data[i].id;
        }
      }
      getTagList(true);
    })
    .catch( error => console.log(error));
  }else{
    getTagList(false);
  }
}