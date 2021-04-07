function newArticle(){
	var title = document.getElementById("title").value;
    var summary = document.getElementById("summary").value;
    var text = document.getElementById("text").value;
    var tag = document.getElementById("tag").value;
	var author = document.getElementById("author").value;

    fetch('../article', {
    	method: 'POST',
    	headers: { 'Content-Type': 'application/json' },
    	body: JSON.stringify({ 
			title,
			summary,
			author,
			text,
			tag
        }),
    })
    .then(response => {
    	response.json().then(json =>{
	    	if(response.status == 400){
	    		//Elemento non specificato
	    		alert(json.error);
	    	}
    	});
    });
}