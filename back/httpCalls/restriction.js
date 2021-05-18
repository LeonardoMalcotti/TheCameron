const express = require('express');
const router = express.Router();
//modello mongoose
const Article = require('../models/Article');
const Subscription = require('..models/Subscription');
const User = require('..models/User');

router.get("",async (req,res)=>{

	//conrtollo dei dati

	let article = await Article.findOne({'id':req.params.id, 'author':req.params.author});

	if(!article){
		res.status(404).json({error: "Autore o id non presente"});
		return;
	}

	let user = await User.findOne({'username':req.params.username});

	if(!user){
		res.status(404).json({error: "User non esiste"});
		return;
	}

	//controllo sulla restrizione

	let sub = await Subscription.findOne({'username':req.params.username});

	//se l'articolo è ristretto e l'utente non ha un abbonamento restituisce forbidden
	if(!sub && article.isRestricted){
		res.status(403).send();
		return;
	}

	//se l'utente ha un abbonamento allora ritorna un successo senza contenuto
	res.status(204).send();
})

module.exports = router;