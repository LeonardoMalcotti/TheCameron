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
      console.log(data[i]);
      articoli[i] = data[i];
    }
    printArticles(0);
  })
  .catch(error => console.log("errore: "+error));
}