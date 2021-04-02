function searchArticles(){

    var text = document.getElementById("txt_search").value;

    if(text && text != ""){
        // Sanificazione dell'input
        text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        fetch('../article/search/'+text, {
            method: 'GET',
            headers:{ 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(async function(data){
            let htmlOutput = "";
            for(let i=0; i<data.length; i++){
                htmlOutput += "<p>"+ data[i] +"</p><hr>";
            }
            document.getElementById("searchResults") = htmlOutput;
        })
    }
    else{
        fetch('../article/search/', {
            method: 'GET',
            headers:{ 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(async function(data){
            let htmlOutput = "";
            for(let i=0; i<data.length; i++){
                htmlOutput += "<p>"+ data[i] +"</p><hr>";
            }
            document.getElementById("searchResults") = htmlOutput;
        })
    }
}