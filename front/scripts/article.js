function loadArticle(){

  var id = getUrlVars()["id"];
  var author = getUrlVars()["author"];
  var url = '../article/' + id + '/' + author;    //Costruisco l'url con l'id
  console.log("id: "+id);

  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((resp) => resp.json()) // Transform the data into json
  .then(function(data) { // Here you get the data to modify as you please
    document.getElementById('txt_title').innerHTML = data.title;
    document.getElementById('txt_summary').innerHTML = data.summary;
    document.getElementById('txt_author').innerHTML = data.author;
    document.getElementById('txt_text').innerHTML = data.text;
    document.getElementById('txt_date').innerHTML = data.date;
  })
  .catch( error => console.error(error) );
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
