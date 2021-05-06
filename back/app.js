const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//requires vari

const article = require("./httpCalls/article.js");

const tokenChecker = require("./tokenChecker.js");

const articles = require("./httpCalls/article.js");
const users = require("./httpCalls/user.js");
const login = require("./httpCalls/login.js");
const reactions = require("./httpCalls/reaction.js");

//-------------

//punto d'entrata
app.use('/',express.static('front/pages'));
app.use(express.static('front'));

//collegamenti alle chiamate http

app.use("/article", article);

app.use("/user",users);
app.use("/article", articles);
app.use("/reaction", reactions);

//autenticazione
app.use("/login",login);

//chiamate http che hanno bisogno di un token
/*
app.use("qualcosa",tokenChecker);
*/

//-------------

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;
