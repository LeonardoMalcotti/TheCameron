const express = require('express');
const router = express.Router();
//modello mongoose
const User = require('../models/User');

router.post("/",async (req,res)=>{
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
	let us = await User.find({'username':req.body.username});
	if (us.length != 0){
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



module.exports = router;