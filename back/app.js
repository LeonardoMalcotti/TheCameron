const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//requires vari

const users = require("./httpCalls/user.js");
const articles = require("./httpCalls/article.js");

//-------------

//punto d'entrata
app.use('/',express.static('front/pages'));
app.use(express.static('front'));

//collegamenti alle chiamate http

app.use("/user",users);
app.use("/article",articles);
//-------------

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;