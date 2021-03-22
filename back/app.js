const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//requires vari

const users = require("./httpCalls/user.js");

//-------------

//punto d'entrata
app.use('/',express.static('front/pages'));

//collegamenti alle chiamate http

app.use("/users",users);

//-------------

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;