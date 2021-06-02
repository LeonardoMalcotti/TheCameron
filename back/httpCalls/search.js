const express = require('express');
const router = express.Router();
const Article = require('../models/Article');


// Search by title
router.get("/:title", async(req,res) => {

	// Filtering function
	function inc(info){
		let regexp = new RegExp(req.params.title, "i");
		return regexp.test(info.title);
	}

	// Get all the articles
	let tmp = await Article.find();
	let allArticles = tmp.sort((a, b) => -(a - b));

	// Filter them
	let resArticles = allArticles.filter(inc);

	// Mapping the output
	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary};
	}

	res.status(200).json(resArticles.map(mapFun));

});

// Get last 50 articles
router.get("/", async(req,res) => {

	let tmp = await Article.find();
	let article = tmp.sort((a, b) => -(a - b));

	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary};
	}

	res.status(200).json(article.map(mapFun));

});

module.exports = router;