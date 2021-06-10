const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subscription = require('../models/Subscription');


//Crea un nuovo utente
//
router.post("/",async (req,res)=>{
	
	//controlla che tutti i dati siano specificati

	if (!req.body.name){
		res.status(400).json({ error: "Nome dell' utente non specificato" });
		return;
	}

	if (!req.body.surname){
		res.status(400).json({ error: "Cognome dell' utente non specificato" });
		return;
	}

	if (!req.body.username){
		res.status(400).json({ error: "Username dell' utente non specificato" });
		return;
	}

	if (!req.body.password){
		res.status(400).json({ error: "Password dell' utente non specificata" });
		return;
	}

	if (!req.body.email){
		res.status(400).json({ error: "Email dell' utente non specificata" });
		return;
	}

	//inserimento db

	//controlla che non ci sia un altro utente con lo stesso username
	if (await User.findOne({'username':req.body.username})){
		res.status(403).json({ error: "Username già presente" });
		return;
	}

	let user = new User({
		name : req.body.name,
		surname : req.body.surname,
		username : req.body.username,
		password : req.body.password,
		email : req.body.email
	});

	user.save();

	res.location("/user/" + user.username).status(201).send();
});


//Recupera le informazioni di un utente specificato per username
//
router.get("/:username",async (req,res)=>{

  	let user = await User.findOne({'username':req.params.username});

	if(!user){
		res.status(404).send();
		return;
	}

	res.status(200).json({
		name : user.name,
		surname : user.surname,
		username : user.username,
		email : user.email
	});

});


//Subscription --------------------------------------------------------------------

//Crea una subscription per un dato utente
//
router.post("/:username/subscription",async(req,res)=>{

	let user = await User.findOne({'username':req.params.username});
  	let subscription = await Subscription.findOne({'username':req.params.username});

  	if(!user){
		res.status(404).json({errore:"Utente non presente"});
		return;
	}

  	if (!req.body.dateSubscription){
		res.status(400).json({ error: "Data dell' iscrizione non specificata" });
		return;
	}

  	if(subscription){
		res.status(404).json({errore:"Sei gia abbonato"});
		return;
 	}

	let sub = new Subscription({
		username : req.params.username,
   		dateSubscription : req.body.dateSubscription
	});

	sub.save();

	res.location("/users/" + user.username + "/subscription").status(201).send();
});


//Recupera la subscripton di un dato utente
//
router.get("/:username/subscription",async (req,res)=>{

  	let subscription = await Subscription.findOne({'username':req.params.username});

	if(!subscription){
		res.status(404).json({errore:"Non presente"});
		return;
	}

	if(subscription.dateSubscription == ""){
		res.status(404).json({errore: "Nessun abbonamento trovato"});
		return;
	}

	res.status(200).json({username : subscription.username, dateSubscription : subscription.dateSubscription});
});


//Elimina la subscription di un utente
//
router.delete("/:username/subscription",async (req,res)=>{

  	let subscription = await Subscription.findOne({'username':req.params.username});

	if(!subscription){
		res.status(404).send();
		return;
	}

	let ret = await Subscription.deleteOne({'username':req.params.username});

	if (!ret) {
		res.status(400).send();
		res.json({error: "Errore nella cancellazione dell'abbonamento"});
	} 

	res.status(204).send();
});

module.exports = router;
