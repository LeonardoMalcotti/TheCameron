const express = require('express');
const router = express.Router();
//modello mongoose
const Article = require('../models/Article');

// Search by title
router.get("/search/:title", async(req,res) => {

	let regex = req.params.title;
	regex.replace(' ','.*');
	regex += "/i"

	let article = await Article.find({'title': {$regex: regex, $options: 'i'}}).limit(50);

	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary};
	}

	res.status(200).json(article.map(mapFun));
	
});

// Get last 50 articles
router.get("/search/:title", async(req,res) => {

	let article = await Article.find().sort({"date":-1, "id": 1}).limit(50);

	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary};
	}

	res.status(200).json(article.map(mapFun));
	
});


module.exports = router;