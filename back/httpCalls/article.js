const express = require('express');
const router = express.Router();
//modello mongoose
const Article = require('../models/Article');

router.post("/",async (req,res)=>{
	if (!req.body.title){
		res.status(400).json({ error: "Titolo dell'articolo non specificato" });
		return;
	}

	if (!req.body.summary){
		res.status(400).json({ error: "Sottotitolo dell'articolo non specificato" });
		return;
	}

	if (!req.body.author){
		res.status(400).json({ error: "Autore dell'articolo non specificato" });
		return;
	}

	if (!req.body.text){
		res.status(400).json({ error: "Testo dell'articolo non specificato" });
		return;
	}

	if (!req.body.date){
		res.status(400).json({ error: "Data dell'articolo non specificata" });
		return;
	}

	if (!req.body.tag){
		res.status(400).json({ error: "Tag dell'articolo non specificati" });
		return;
	}

	//inserimento db
	let allArticle = await Article.find({}).exec();
	let ids = allArticle.map(tmp => tmp.id);
	let id = ( allArticle.length==0 ? 1 : Math.max(...ids) + 1);
	let newArticle = new Article({
		id : id,
		author : req.body.author,
		title : req.body.title,
		summary : req.body.summary,
		text : req.body.text,
		date : req.body.date,
		tag: req.body.tag.split(","),
	});
	newArticle.save();

	res.location("/Article/" + newArticle.id+"/"+newArticle.author).status(201).send();
});



module.exports = router;
