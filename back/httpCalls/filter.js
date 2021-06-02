const express = require('express');
const router = express.Router();
const Article = require('../models/Article');


router.get("/",async(req,res)=>{
	
	let art = await Article.find();

	function checkFilters(article){
		var ret = true;

		if(req.query.author && ret){
			ret = req.query.author == article.author;
		}

		if(req.query.tags && ret){

			for( t in req.query.tags ){
				
				//moltiplicare per un intero una stringa la converte in intero
				if(!article.tags.includes(req.query.tags[t]*1)){
					ret = false;
				}
			}

		}

		return ret;
	}

	function mapFun(article){
		return {id: article.id, author: article.author, title: article.title, summary: article.summary};
	}

	let risp = art.filter(checkFilters).map(mapFun);

	res.status(201).json(risp);

});

module.exports = router;