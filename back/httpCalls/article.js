const express = require('express');
const router = express.Router();
//modello mongoose
const Article = require('../models/Article');

// Search by title
router.get("/search/:title", async(req,res) => {

	let regexp = req.params.title;
	regexp.replace(' ','/.*/');

	let allArticles = await Article.find({'title': {$regex: regexp, $options: 'i'}});

	let article = allArticles.slice(0,50);

	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary};
	}

	res.status(200).json(article.map(mapFun));
	
});

// Get last 50 articles
router.get("/search/", async(req,res) => {

	let article = await Article.find().sort({"date":-1, "id": 1}).limit(50);

	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary};
	}

	res.status(200).json(article.map(mapFun));
	
});


module.exports = router;