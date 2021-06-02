//var myStorage = window.sessionStorage;
// Funzione chiamata dalll'evento onclick del pulsante di LogOut
function logOut(){
    // Stringa token ricevuta in fase di LogIn
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loggedUser');
    loggedUser = {};
       
    // Ricarico la pagina
    location.reload(); // Questo potrebbe non ottenere l'effetto desiderato, forse tornare al Login/Home è meglio
}