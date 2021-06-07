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
const filters = require("./httpCalls/filter.js");
const search = require("./httpCalls/search.js");
const favoriteTags = require("./httpCalls/favoriteTags.js");

//-------------

//punto d'entrata
app.use('/',express.static('front/pages'));
app.use(express.static('front'));

//autenticazione
app.use("/login", login);


//collegamenti alle chiamate http

app.use("/followers", follow);
app.use("/user", users);

//assolutamente da mettere in questo ordine
app.use("/article/filters", filters);
app.use("/article/search", search);
app.use("/article", articles);

app.use("/reaction", reactions);
app.use("/savedArticle", savedArticle);

app.use("/tag/user",favoriteTags);
app.use("/tag", tags);

app.use("/restricted/article",restriction);

//chiamate protette da token checker
app.use("/restricted/article/:id/:author/user/:username",tokenChecker);
app.use("/article",tokenChecker);
app.use("/tag/user/:username",tokenChecker);
app.use("followers/follow",tokenChecker);
app.use("followers/unfollow",tokenChecker);

//-------------

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Call not found' });
});

module.exports = app;
