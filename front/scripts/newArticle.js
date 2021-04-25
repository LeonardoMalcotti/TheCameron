function newArticle(){
	var url = '../article/';
	//var date = new Date().toLocaleDateString("it-IT");
	var date = new Date(year, month, day, hours, minutes, seconds, milliseconds).toLocaleDateString("it-IT");
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
				date : "20/04/2021"
			}),
	})
	.then((resp) => resp.json())
	.then(function(data) {
			console.log(data);
			console.log(date);
			alert("dati inviati");
	})
	.catch( error => console.error(error));

	return;
}
