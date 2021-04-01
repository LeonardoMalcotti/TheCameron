const express = require('express');
const router = express.Router();

const Article = require('../models/Article');


router.get("/article/search/:title", async(req,res) => {

	let regex = req.param.title;
	regex.replace(' ','.*');

	let article = await Article.find({'title':regex});

	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary};
	}

	res.status(200).json(article.map(mapFun));
	
});