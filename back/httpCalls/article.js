const express = require('express');
const router = express.Router();
//modello mongoose
const Article = require('../models/Article');

// Search by title
router.get("/search/:title", async(req,res) => {
	// Filtering function
	function inc(info){
		let regexp = new RegExp(req.params.title, "i");
		return regexp.test(info.title);
	}
	// Get all the articles
	let allArticles = await Article.find().sort({"date":-1});
	// Filter them
	let resArticles = allArticles.filter(inc);
	// Mapping the output 
	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary};
	}

	res.status(200).json(resArticles.map(mapFun));
	
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