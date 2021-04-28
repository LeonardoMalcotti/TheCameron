function newArticle(){
	var url = '../article';
	//var date = new Date().toLocaleDateString("it-IT");
	//var data = new Date(year, month, day, hours, minutes, seconds, milliseconds).toLocaleDateString("it-IT");
	var title = document.getElementById("title").value;
  var summary = document.getElementById("summary").value;
  var text = document.getElementById("text").value;
  var tag = document.getElementById("tag").value;
	var author = document.getElementById("author").value;

	fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title : title,
				summary : summary,
				author : author,
				text : text,
				tag : tag,
			}),
	})
	.then(function(response) {
        //la risposta è un successo
        if(response.ok){
            alert("Articolo creato");
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
