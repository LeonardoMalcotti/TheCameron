const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const FavoriteTags = require('../models/FavoriteTags');
const User = require('../models/User');


//Aggiunge un tag tra i favoriti di un utente
//
router.post("/:username",async(req,res)=>{

	if(!req.body.tag){
		res.status(400).json({error:"Parametro tag non specificato"});
		return;
	}

	let username = req.params.username;
	let tag = req.body.tag;

	if(! await User.findOne({'username': username})){
		res.status(404).json({ error: "Nessun Username trovato"});
		return;
	}

	if(! await Tag.findOne({'id' : tag})){
		res.status(404).json({ error: "Nessun tag trovato"});
		return;
	}

	let favoriteTags = await FavoriteTags.findOne({'username':username});

	//se non esiste una entry dei favoriti per questo utente la crea
	if(!favoriteTags){

		favoriteTags = new FavoriteTags({
			username : username,
			id : []
		});
	}

	//se il tag specificato è già un favorito si ritorna errore
	if(favoriteTags.id.includes(tags)){
		res.status(400).json({ error: "Tag gia inserito"});
		return;
	}

	favoriteTags.id.push(tags)

	favoriteTags.save();

	res.location("/tag/" + username).status(201).send();
});

//Recupera i tag favoriti di un utente
//
router.get("/:username",async (req,res)=>{

	let username = req.params.username;

	if(!await User.findOne({'username': username})){
		res.status(404).json({ error: "User non trovato"});
		return;
	}

	let favoriteTags = await FavoriteTags.findOne({'username':username});

  	//se l'utente non ha tag favoriti si ritorna errore
  	if(!favoriteTags || favoriteTags.id.length<=0){
  		res.status(404).send({ error : "User non ha tag favoriti"});
  		return;
  	}

  	let tagName = await Tag.find();
  	let final = tagName.filter(x => favoriteTags.id.includes(x.id));


  	res.status(200).json(final);
});


module.exports = router;