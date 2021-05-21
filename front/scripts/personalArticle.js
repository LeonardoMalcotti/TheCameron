function loadArticle(){

    let htmlOutput = "";
    var author = getUrlVars()["author"];
    let url = '../article/'+author;
    fetch(url, {
        method: 'GET',
        headers:{ 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json())
    .then(async function(data){
        for(let i=0; i<data.length; i++){
            console.log(data[i]);
            htmlOutput += "<p>"+ data[i].title + " - del " + data[i].date+ "</p><hr>";
            htmlOutput += "<p>"+ data[i].summary + "</p><hr>";
            htmlOutput += "<p>"+ data[i].text + "</p><hr>";
            htmlOutput += "<p>"+ data[i].tag + "</p><hr>";
        }
        document.getElementById("result").innerHTML = htmlOutput;
        return;
    })
}
