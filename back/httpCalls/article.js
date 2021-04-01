const express = require('express');
const router = express.Router();
//modello mongoose
const Article = require('../models/Article');

// Search by title
router.get("/search/:title", async(req,res) => {

	let regex = req.param.title;
	regex.replace(' ','.*');

	let article = await Article.find({'title':regex});

	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary};
	}

	res.status(200).json(article.map(mapFun));
	
});

module.exports = router;