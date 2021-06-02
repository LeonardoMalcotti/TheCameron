const express = require('express');
const router = express.Router();
//modello mongoose
const Article = require('../models/Article');

/*
tipi di filtro:
- genere
- autore
- data
*/

router.get("/filters",async(req,res)=>{
	let art = await Article.find();

	function checkFilters(article){
		var ret = true;
		if(req.query.author && ret){
			ret = req.query.author == article.author;
		}
		if(req.query.tags && ret){
			for( t in req.query.tags ){
				if(!article.tags.includes(req.query.tags[t])){
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

// Search by title
router.get("/search/:title", async(req,res) => {
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
router.get("/search/", async(req,res) => {

	 let tmp = await Article.find();
	 let article = tmp.sort((a, b) => -(a - b));

	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary};
	}

	res.status(200).json(article.map(mapFun));

});

// user/:username GET
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

// article/:author GET
router.get("/:author",async (req,res)=>{

	let author = req.params.author;
	let allArticle = await Article.find();
	let filterArticle = allArticle.filter(x => x.author === author)

	if(filterArticle.length == 0){
		res.status(404).json({error: "Articoli o autore non presenti"});
		return;
	}

	function mapFun(art){
		return {id: art.id, author: art.author, title: art.title, summary: art.summary, text: art.text, date: art.date, tags: art.tags};
	}

	res.status(200).json(filterArticle.map(mapFun));
});


module.exports = router;
