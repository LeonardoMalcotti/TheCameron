const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const User = require('../models/User');

//Recupera le informazioni dell'articolo che ha id e autore specificati
//
router.get("/:id/:author",async (req,res)=>{

  let article = await Article.findOne({'id':req.params.id, 'author':req.params.author});

	if(!article){
		res.status(404).json({error: "Autore o id non presente"});
		return;
	}

	res.status(200).json({
		id : article.id,
  		author : article.author,
  		title : article.title,
  		summary : article.summary,
  		text : article.text,
    	date : article.date,
    	tags : article.tags,
    	restricted : article.restricted
	});

});


//Crea un nuovo articolo
//- title
//- summary
//- author
//- text
//- tags
//- restricted
//
router.post("/",async (req,res)=>{

	//controlla che tutti i dati siano stati passati

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

	if (!req.body.tags){
		res.status(400).json({ error: "Tag dell'articolo non specificati" });
		return;
	}

	if (!req.body.restricted){
		res.status(400).json({ error: "Restrizione dell'articolo non specificata" });
		return;
	}

	//creazione data
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	//crea id
	let author = req.body.author;
	let allArticle = await Article.find();
	let filterArticle = allArticle.filter(x => x.author === author)
	let id;

	if(filterArticle){
		let ids = filterArticle.map(tmp => tmp.id);
	 	id = ( filterArticle.length==0 ? 1 : Math.max(...ids) + 1);
	}

	//inserimento db
	let newArticle = new Article({
		id : id,
		author : req.body.author,
		title : req.body.title,
		summary : req.body.summary,
		text : req.body.text,
		date : mm + '/' + dd + '/' + yyyy,
		tags: req.body.tags,
		restricted : req.body.restricted
	});

	newArticle.save();

	res.location("/Article/" + newArticle.id+"/"+newArticle.author).status(201).send();

});


//Recupera le informazioni di tutti gli articoli dell'autore specificato
//
router.get("/:author",async (req,res)=>{

	let author = req.params.author;

	if(! await User.findOne({ "username":author })){
		res.status(404).json({error: "Autore non trovato"});
		return;
	}

	let allArticle = await Article.find();
	let filterArticle = allArticle.filter(x => x.author === author)

	if(filterArticle.length == 0){
		res.status(404).json({error: "Articoli non trovati"});
		return;
	}

	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary, text: art.text, date: art.date, tags: art.tags};
	}

	res.status(200).json(filterArticle.map(mapFun));
});


module.exports = router;
