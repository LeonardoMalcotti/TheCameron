const express = require('express');
const router = express.Router();
//modello mongoose
const Users = require('../models/Users');
const Subscription = require('../models/Subscription');


// user/:username/subscription POST
router.post("/:username/subscription",async(req,res)=>{

	let user = await User.find({'username':req.params.username}).exec();

	if(!user){
		res.status(404).send();
		return;
	}

  if (!req.body.email){
		res.status(400).json({ error: "Email dell' utente non specificata" });
		return;
	}

  if (!req.body.dateSubscription){
		res.status(400).json({ error: "Data dell' iscrizione non specificata" });
		return;
	}

  let subscription = await Subscription.find({'username':req.params.username}).exec();

  if (subscription.length != 0){
		res.status(403).json({ error: "Iscrizione già presente" });
		return;
	}

	let sub = new Subscription({
		username : req.params.username,
    email : req.body.email,
    dateSubscription : req.body.dateSubscription
	});

	sub.save();

	res.location("/users/" + user.username + "/subscription").status(201).send();
})

// user/:username/subscription GET
router.get("/:username/subscription",async (req,res)=>{

  let subscription = await Subscription.find({'username':req.params.username}).exec();

	if(!subscription){
		res.status(404).send();
		return;
	}

	if(subscription.stats.length == 0){
		res.status(404).json({errore: "Nessun abbonamento trovato"});
		return;
	}

	let ret = {
		email : subscription.email,
		dateSubscription : subscription.dateSubscription
	}

	res.status(200).json(ret);

})

// user/:username/subscription DELETE
router.delete("/:username/subscription",async (req,res)=>{

  let subscription = await Subscription.find({'username':req.params.username}).exec();

	if(!subscription){
		res.status(404).send();
		return;
	}

	let ret = await Subscription.delete(req.params.username);

	if (ret) {
		res.status(204).send();
	} else {
		res.status(400).send();
		res.json({error: "Errore nella cancellazione dell'abbonamento"});
	}
});


module.exports = router;
