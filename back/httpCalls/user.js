const express = require('express');
const router = express.Router();
//modello mongoose
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// user/:username GET
router.get("/:username",async (req,res)=>{

  let user = await User.findOne({'username':req.params.username});

	if(!user){
		res.status(404).send();
		return;
	}
	console.log(user);
	/*
	if(user.length == 0){
		res.status(404).json({errore: "Nessun user trovato"});
		return;
	}*/

	res.status(200).json({
		name : user.name,
		surname : user.surname,
		username : user.username,
		password : user.password,
		email : user.email
	});

});

// user/:username/subscription POST
router.post("/:username/subscription",async(req,res)=>{

	let user = await User.findOne({'username':req.params.username});
  let subscription = await Subscription.findOne({'username':req.params.username});

  if(!user){
		res.status(404).json({errore:"Non presente utente"});
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
})

// user/:username/subscription GET
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

	res.status(200).json({username : subscription.username,
                        dateSubscription : subscription.dateSubscription
                      });

})

// user/:username/subscription DELETE
router.delete("/:username/subscription",async (req,res)=>{

  let subscription = await Subscription.findOne({'username':req.params.username});

	if(!subscription){
		res.status(404).send();
		return;
	}

	let ret = await Subscription.deleteOne({'username':req.params.username});

	if (ret) {
		res.status(204).send();
	} else {
		res.status(400).send();
		res.json({error: "Errore nella cancellazione dell'abbonamento"});
	}
});


module.exports = router;
