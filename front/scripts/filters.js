

function applyFilter() {
	var author = document.getElementById("txt_author").value;
	var strTags = document.getElementById("txt_tags").value;
	strTags.replace(/%20/g, '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
	var tags = strTags.split(",");
	console.dir(tags);

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
		for(let i=0; i<tags.length; i++){
			url += ('&tags[]='+tags[i]);
		}
	}

	fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then((resp) => resp.json())
	.then(async function(data){
		for(i in data){
			art = i.json();
			console.log(art);
		}
	})
    .catch(error => console.log("errore"));
}