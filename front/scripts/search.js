

async function applyFilter() {
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
		
    
	}
advancedSearch(url);
	
}

async function advancedSearch(url){
  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((resp) => resp.json())
  .then(async function(data){
    for(i=0; i<data.length; i++){
      articoli[i] = data[i];
    }
    //Cancelliamo la precedente ricerca
    document.getElementById("article_list").innerHTML = "";
    printArticles(0);
  })
  .catch(error => console.log("errore: "+error));
}