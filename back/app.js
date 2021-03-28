const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//requires vari
const tokenChecker = require("./tokenChecker.js");

const users = require("./httpCalls/user.js");
const login = require("./httpCalls/login.js");
//-------------

//punto d'entrata
app.use('/',express.static('front/pages'));
app.use(express.static('front'));

//autenticazione
app.use("/login",login);

//chiamate http che hanno bisogno di un token
/*
app.use("qualcosa",tokenChecker);
*/

//collegamenti alle chiamate http

app.use("/user",users);

//-------------

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;