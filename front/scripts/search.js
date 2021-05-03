function searchArticles(){

    var text = document.getElementById("txt_search").value;
    let htmlOutput = "";

    if(text && text != ""){
        // Sanificazione dell'input
        text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

        fetch('../article/search/'+text, {
            method: 'GET',
            headers:{ 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(async function(data){
            for(let i=0; i<data.length; i++){
                console.log(data[i]);
                htmlOutput += "<p>"+ data[i].title + " - di " + data[i].author+ "</p><hr>";
            }
            document.getElementById("searchResults").innerHTML = htmlOutput;
            return;
        })
    }
    else{
        console.log("vuoto\n");
        fetch('../article/search/', {
            method: 'GET',
            headers:{ 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(async function(data){
            for(let i=0; i<data.length; i++){
                console.log(data[i]);
                htmlOutput += "<p>"+ data[i].title + " - di " + data[i].author+ "</p><hr>";
            }
            document.getElementById("searchResults").innerHTML = htmlOutput;
            return;
        })
    }
    
}