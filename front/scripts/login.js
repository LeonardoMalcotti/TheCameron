//var myStorage = window.sessionStorage;
loggedUser = {};

if(sessionStorage.getItem('loggedUser') && sessionStorage.getItem('token')){
  alert("Logged in");
  redirectHome();
}

async function LogInUser(){
  doLogin();  
}

async function doLogin(){
  var myusername = document.getElementById("txt_username").value;
  var mypassword = document.getElementById("txt_password").value;
  await fetch('../login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
    username : myusername,
    password : mypassword,
      }),
  })
  .then(response => {
    response.json().then(json =>{
      if(response.status == 400){
        //manca un parametro
        alert(json.error);
      }
      if(response.status == 403){
        //user non trovato o psw sbagliata
        alert(json.message);
      }
      if(response.status == 200){
        if(json.success == true){
          loggedUser.username = myusername;
          loggedUser.token = json.token;
          sessionStorage.setItem('loggedUser', myusername);
          sessionStorage.setItem('token', json.token);
          location.reload();
        }
      }
    });
  });
}

function redirectHome(){
  window.location.href = "index.html";
}