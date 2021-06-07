const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

//controlla se un utente registrato può accedere ad un articolo
//
router.get("/:id/:author/user/:username",async (req,res)=>{

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
	if(!sub && article.restricted){
		res.status(403).send();
		return;
	}
	
	res.status(204).send();
});


//controlla se un utente non registrato può accedere all'articolo
//
router.get("/:id/:author",async(req,res)=>{

	//conrtollo dei dati

	let article = await Article.findOne({'id':req.params.id, 'author':req.params.author});

	if(!article){
		res.status(404).json({error: "Autore o id non presente"});
		return;
	}

	if(article.restricted){
		res.status(403).send();
		return;
	}
	
	res.status(204).send();

});

module.exports = router;
