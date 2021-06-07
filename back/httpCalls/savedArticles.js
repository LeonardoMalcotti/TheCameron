const express = require('express');
const router = express.Router();
const SavedArticles = require('../models/SavedArticles');
const User = require('../models/User');
const Article = require('../models/Article');


//Inserimento nuovo articolo salvato
//
router.post("/:username",async(req,res)=>{

	// Controllo di aver ricevuto tutti i dati
	if(!req.params.username){
		res.status(400).json({error: "Username non specificato"});
	  	return;
	}

	if(!req.body.id){
		res.status(400).json({error: "Id non specificato"});
	  	return;
	}

	if(!req.body.author){
		res.status(400).json({error: "Author non specificato"});
	  	return;
	}

	let username = req.params.username;
	let id = req.body.id;
	let author = req.body.author;

	// Controllo se esiste l'utente
	if(! await User.findOne({'username': username})){
		res.status(404).json({ error: "Utente non trovato"});
		return;
	}

	// Controllo se esiste l'articolo
	if(! await Article.findOne({'id':id, 'author':author})){
	  	res.status(404).json({error: "Articolo non trovato"});
	  	return;
	}

	let savedArticles = await SavedArticles.findOne({'username':username});
	
	if(!savedArticles){

	  	// se non ha salvato articoli lo creo
	  	let newArticle = new SavedArticles({
			'username' : username,
			'articles' : [{
				'id': id,
				'author': author
			}]
	  	});

	  	newArticle.save();
	  	res.status(200).send();
	  	return;

	} else {

		//controlla se l'articolo è già stato salvato
	  	if(savedArticles.articles.find(x => x.id == id && x.author == author)){
			res.status(403).json({ error: "Articolo già salvato" });
			return;

	  	} 
		
		savedArticles.articles.push({'id':id,'author':author})
	  	
	}

	savedArticles.save();

	res.status(201).send();
});


//Recupera gli articoli salvati di un utente
//
router.get("/:username",async (req,res)=>{

	// Controllo di aver ricevuto tutti i dati
	if(!req.params.username){
		res.status(400).json({error: "Username non specificato"});
	  	return;
	}

	let username = req.params.username;

	//Controllo se esiste l'utente
	if(! await User.findOne({'username': username})){
		res.status(404).json({ error: "Nessun Username trovato"});
		return;
	}

	//Controllo se ha salvato articoli
	let savedArticles = await SavedArticles.findOne({'username': username});
	
	if(!savedArticles || savedArticles.articles.length == 0 ){
	  	res.status(404).json({ error: "Nessun Articolo salvato"});
	  	return;
	}

	res.status(200).json(savedArticles.articles);
});

//Rimuove un articolo salvato di un utente
//
router.delete("/",async (req,res)=>{

	// Controllo di aver ricevuto tutti i dati
	if(!req.body.username){
		res.status(400).json({error: "Username non specificato"});
	  	return;
	}

	if(!req.body.id){
		res.status(400).json({error: "Id non specificato"});
	  	return;
	}

	if(!req.body.author){
		res.status(400).json({error: "Author non specificato"});
	  	return;
	}

  	let username = req.body.username;
  	let id = req.body.id;
  	let author = req.body.author;

 	//Controllo se esiste l'utente
  	if(! await User.findOne({'username' : username })){
	  	res.status(404).json({ error: "Nessun Username trovato"});
	  	return;
  	}

  	let savedArticles = await SavedArticles.findOne({'username' : username});

  	//Controlo se ha salvato articoli
  	if(!savedArticles || savedArticles.articles.length == 0){
	  	res.status(404).json({ error: "Nessun Articolo salvato"});
	  	return;
  	}

  	//Controllo se esiste l'articolo tra i salvati
  	if(!savedArticles.articles.find(x => x.id == id && x.author == author)){
		res.status(404).json({ error: "Articolo non trovato"});
		return;
  	} 
	
	savedArticles.articles.splice(savedArticles.articles.indexOf({'id':id,'author':author}),1);
	savedArticles.save();

	res.status(204).send();

});


module.exports = router;
