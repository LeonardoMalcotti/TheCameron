const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//requires vari

const tokenChecker = require("./tokenChecker.js");

const articles = require("./httpCalls/article.js");
const users = require("./httpCalls/user.js");
const login = require("./httpCalls/login.js");
const reactions = require("./httpCalls/reaction.js");
const savedArticle = require("./httpCalls/savedArticles.js");
const follow = require("./httpCalls/follow.js");
const tags = require("./httpCalls/tag.js");
const restriction = require("./httpCalls/restriction.js");

//-------------

const filters = require("./httpCalls/filters.js");
const search = require("./httpCalls/search.js");

//punto d'entrata
app.use('/',express.static('front/pages'));
app.use(express.static('front'));

//collegamenti alle chiamate http

app.use("/article", articles);
app.use("/followers", follow);
app.use("/user", users);

app.use("/article", articles);
app.use("/article", filters);
app.use("/article", search);

app.use("/reaction", reactions);
app.use("/savedArticle", savedArticle);
app.use("/tag", tags);

//autenticazione
app.use("/login", login);

//chiamate http che hanno bisogno di un token
/*
app.use("qualcosa",tokenChecker);
*/
//app.use("/followers", tokenChecker);

//è da aggiungere una chiamata a restriction per gli utenti non registrati
//app.use("/restricted/article/:id/:author/user/:username",tokenChecker);
app.use("/restricted/article",restriction);

//-------------

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;
