// Funzione che viene chiamata successivamente al caricamento della pagina
window.addEventListener("load", (event) =>{
    // Se il token esiste allora mostro il pulsante
    // da verificare se il token viene correttamente rilevato 
    if(!loggedUser || typeof(loggedUser.token) === 'undefined' || loggedUser.token === null){
        // token null o undefined: nascondo il pulsante logout (dovrei mostrare quello login?)
        document.getElementById("btn_logOut").style.visibility = "hidden";
    }else{
        // token valido: mostro il pulsante logout
        document.getElementById("btn_logOut").style.visibility = "visible";
    }
});

// Funzione chiamata dalll'evento onclick del pulsante di LogOut
function logOut(){
    // Stringa token ricevuta in fase di LogIn
    loggedUser.token = null;     
    // Nascondo il pulsante
    document.getElementById("btn_logOut").style.visibility = "hidden";
    // Ricarico la pagina
    location.reload(); // Questo potrebbe non ottenere l'effetto desiderato, forse tornare al Login/Home è meglio
}