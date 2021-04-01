const express = require('express');
const router = express.Router();
//modello mongoose
const Article = require('../models/Article');

// user/:username GET
router.get("/:id/:author",async (req,res)=>{

  let article = await Article.findOne({'id':req.params.id, 'author':req.params.author});

	if(!article){
		res.status(404).json({error: "Autore o id non presente"});
		return;
	}
	console.log(article);

	res.status(200).json({
    id : article.id,
  	author : article.author,
  	title : article.title,
  	summary : article.summary,
  	text : article.text,
    date : article.date,
    tag : article.tag
	});

});




module.exports = router;
