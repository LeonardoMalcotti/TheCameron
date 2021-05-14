function loadArticles(n){

    // Non possiamo caricare più di 50 elementi
    if(n>5){
        window.alert("Impossibile caricare più di 50 articoli");
    }
    else{
        // Facciamo la chiamata
        fetch('../article/search/', {
            method: 'GET',
            headers:{ 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
        .then(function(data){
            let htmlOutput = "";
            // n ci indica la decina da mostrare, se n=1 dovviamo andare dalla posizione 10 a 19
            for(let i=n*10; i<(n+1)*10 && i<data.length; i++){
                htmlOutput += "<article><h4>" + data[i].title + " - di " + data[i].author;
                htmlOutput += "<p>" + data[i].summary + "</p></article>";
                let url = 'readarticle.html?id=' + data[i].id + '&author=' + data[i].author;
                htmlOutput += '<a href =' +url +'>';
                htmlOutput += "Leggi </a>";

            }
            document.getElementById("articles").innerHTML += htmlOutput;
            // Ed infine il pulsante per caricarne altri
            // (se ci sono)
            if(n+1<data.length/10){
                //Settiamo il prossimo n nelle chiamate a n+1
                htmlOutput = '<button type="button" class="btn btn-light"';
                htmlOutput += 'onclick="loadMore(' + n+1 + ')">Guarda altri articoli</button>';
                document.getElementById("articles").innerHTML += htmlOutput;
            }

            return;
        })
    }
}

/* for Mozilla/Opera9 */
//if (document.addEventListener) {
//    document.addEventListener("DOMContentLoaded", loadArticles(0), false);
//}

/* for other browsers */
//window.onload = loadArticles(0);



function Ricerca(){

}
