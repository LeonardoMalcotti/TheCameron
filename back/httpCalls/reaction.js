const express = require('express');
const router = express.Router();
const Reaction = require('../models/Reaction');
const Article = require('../models/Article');
const User = require('../models/User');


//Aggiunge una reaction da parte di un utente ad un articolo
//
router.post("/",async (req,res)=>{

	//controlla che vengano passati tutti i dati

	if (!req.body.reaction){
		res.status(400).json({ error: "Reazione dell'articolo non specificata" });
		return;
	}

	if(req.body.reaction > 4 || req.body.reaction < 0){
		res.status(400).json({error : "Valore della reaction errato"});
		return;
	}

	if (!req.body.id){
		res.status(400).json({ error: "ID dell'articolo non specificato" });
		return;
	}

	if (!req.body.author){
		res.status(400).json({ error: "Autore dell'articolo non specificato" });
		return;
	}

	if (!req.body.username){
		res.status(400).json({ error: "Username della reaction non specificato" });
		return;
	}

	//fa controlli sul db

  	if(!await User.findOne({'username':req.body.username})){
		res.status(404).json({error:"User non trovato"});
		return;
	}

  	if(!await Article.findOne({'id':req.body.id, 'author':req.body.author})){
		res.status(404).json({error:"Articolo non trovato"});
		return;
	}

	let react = await Reaction.findOne({'id':req.body.id, 'author':req.body.author, 'username':req.body.username});

	//se la rezione esiste già allora modifica quella
  	if(react){
		
		//se la rezione passata è 0 allora la elimina
		if(req.body.reaction == 0){
			await Reaction.deleteOne({'id':req.body.id, 'author':req.body.author, 'username':req.body.username});
			res.status(204).send();
			return;
		}

		react.reaction = req.body.reaction;
		react.save();
		res.status(200).send();
		return;
	}

	//inserimento db
	let newReaction = new Reaction({
		id : req.body.id,
		author : req.body.author,
		username : req.body.username,
		reaction : req.body.reaction
	});

	newReaction.save();

	res.location("/reaction/").status(201).send();

});


//Recupera tutte le reazioni relative ad un articolo
//
router.get("/:id/:author",async (req,res)=>{

  	let article = await Article.findOne({'id':req.params.id, 'author':req.params.author});
	if(!article){
		res.status(404).json({error: "Articolo non presente"});
		return;
	}

  	let reaction = await Reaction.find({'id':req.params.id, 'author':req.params.author})
  	if(reaction.length == 0){
		res.status(404).json({error: "Reaction non presente"});
		return;
	}

	res.status(200).json(reaction);
});


//Recupera tutte le reazioni date da un utente
//
router.get("/:username",async (req,res)=>{

	if(!await User.findOne({'username':req.params.username})){
		res.status(404).json({error: "Username non presente"});
		return;
	}

  	let reaction = await Reaction.find({'username':req.params.username});

  	if(reaction.length == 0){
		res.status(404).json({error: "Reaction non presente"});
		return;
	}

	res.status(200).json(reaction);
});

module.exports = router;
