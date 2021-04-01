function searchTitle(){
    var text = document.getElementById("txt_search");
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    fetch('../article/search/'+text, {
        method: GET,
        headers:{ 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(async function(data){
        let htmlOutput = "";
        for(let i=0; i<data.length; i++){
            htmlOutput += "<p>"+ data[i] +"</p><hr>";
        }
        document.getElementById("searchResults")
    })
}