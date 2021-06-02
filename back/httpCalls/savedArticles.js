const express = require('express');
const router = express.Router();
//modello mongoose
const SavedArticles = require('../models/SavedArticles');
const User = require('../models/User');
const Article = require('../models/Article');

//Inserimento nuovo articolo salvato
router.post("/",async(req,res)=>{

	let username = req.body.username;
	let id = req.body.id;
	let author = req.body.author;

	// Controllo di aver ricevuto tutti i dati
	if(!username || !id || !author){
		res.status(404).json({error: "missing parameter(s) in body"});
	  	return;
	}

	// Controllo se esiste l'utente
	let existUser = await User.findOne({'username': username});
	if(!existUser){
		res.status(404).json({ error: "Nessun utente trovato"});
		return;
	}
	// Controllo se esiste l'articolo
	let existArticle = await Article.findOne({'id':id, 'author':author})
	if(!existArticle){
	  	res.status(404).json({error: "Dati articolo non esistenti"});
	  	return;
	}

	//Controllo se ha gia salvato articoli
	let savedArticles = await SavedArticles.findOne({'username':username});
	if(!savedArticles){
	  	// se non ha salvato articoli lo creo
	  	let newArticle = new SavedArticles({
			'username' : username,
			'id': [id],
			'author': [author]
	  	});
	  	newArticle.save();
	  	res.status(200).send();
	  	return;
	} else {
	  	// se ha gia salvato articoli
	  	// scorro la lista e verifico che l'articolo "nuovo" non sia presente
	  	var esiste = false;
	  	for(i = 0; i < savedArticles.id.length; i++){
			if(savedArticles.id[i] == id && savedArticles.author[i] == author)
		 	esiste = true;
	  	}

	  	if(esiste){

			//se l'articolo è gia stato salvato
			res.status(403).json({ error: "Articolo già salvato" });
			return;

	  	} else {

			//aggiungo l'articolo alla lista
			savedArticles.id.push(id);
			savedArticles.author.push(author);

	  	}
	}

	// Salviamo il record modificato, viene automaticamente svolta una update
	savedArticles.save();
	res.status(201).send();
});

//GET articoli salvati da :username
router.get("/:username",async (req,res)=>{

	let username = req.params.username;

	//Controllo se esiste l'utente
	let existUser = await User.findOne({'username': username});
	if(!existUser){
		res.status(404).json({ error: "Nessun Username trovato"});
		return;
	}

	//Controllo se ha salvato articoli
	let savedArticles = await SavedArticles.findOne({'username': username});
	// Gestiamo sia il caso sia undefined, sia il caso in cui esista ma non abbia articoli salvati
	if(!savedArticles || savedArticles.id.length == 0  ){
	  	res.status(404).json({ error: "Nessun Articolo salvato"});
	  	return;
	}

	let art=[];
	for(i = 0; i < savedArticles.id.length; i++){
		art[i] = {'id':savedArticles.id[i],'author': savedArticles.author[i]};
	}

	res.status(201).json(art);
});

router.delete("/",async (req,res)=>{

  	let username = req.body.username;
  	let id = req.body.id;
  	let author = req.body.author;

 	//Controllo se esiste l'utente
  	if(! await User.findOne({' username' : username })){
	  	res.status(404).json({ error: "Nessun Username trovato"});
	  	return;
  	}

  	//Controlo se ha salvato articoli
  	if(( await SavedArticles.findOne({'username' : username}) ).id.length == 0){
	  	res.status(404).json({ error: "Nessun Articolo salvato"});
	  	return;
  	}

  	//Controllo se esiste l'articolo tra i salvati
  	let index = -1;
  	var esiste = false;
  	for(i = 0; i < savedArticles.id.length; i++){
	  	if(savedArticles.id[i] == id && savedArticles.author[i] == author){
			index = i;
			esiste = true;
	  	}
	}
	

  	if(!esiste || index < 0){
		// L'articolo non è salvato
		res.status(404).json({ error: "Articolo non trovato"});
		return;
  	} 
	
  	// Rimuoviamo l'articolo dalle liste
	savedArticles.id.splice(index, 1);
	savedArticles.author.splice(index, 1);

	savedArticles.save();
	
	res.status(204).send();

});

module.exports = router;
