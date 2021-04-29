function loadArticle(){

  var id = getUrlVars()["id"];
  var author = getUrlVars()["author"];
  var url = '../article/' + id + '/' + author;    //Costruisco l'url con l'id

  fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  .then((resp) => resp.json())
  .then(function(data) {
    document.getElementById('txt_title').innerHTML = data.title;
    document.getElementById('txt_summary').innerHTML = data.summary;
    document.getElementById('txt_author').innerHTML = data.author;
    document.getElementById('txt_text').innerHTML = data.text;
    document.getElementById('txt_date').innerHTML = data.date;
    document.getElementById('txt_tag').innerHTML = data.tag;
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
