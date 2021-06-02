const express = require('express');
const router = express.Router();
//modello mongoose
const Reaction = require('../models/Reaction');
const Article = require('../models/Article');
const User = require('../models/User');

router.post("/",async (req,res)=>{
	if (!req.body.reaction){
		res.status(400).json({ error: "Reazione dell'articolo non specificata" });
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

  	let user = await User.findOne({'username':req.body.username});
  	if(!user){
		res.status(404).send();
		return;
	}
  	let article = await Article.findOne({'id':req.body.id, 'author':req.body.author});
  	if(!article){
		res.status(404).send();
		return;
	}
  	let react = await Reaction.findOne({'id':req.body.id, 'author':req.body.author, 'username':req.body.username});
  	if(react){
		res.status(403).json({ error: "Reaction già presente" });
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

// reaction/:id/:author GET
router.get("/:id/:author",async (req,res)=>{

  	let article = await Article.findOne({'id':req.params.id, 'author':req.params.author});
	if(!article){
		res.status(404).json({error: "Articolo non presente"});
		return;
	}

  	let reaction = await Reaction.findOne({'id':req.params.id, 'author':req.params.author})
  	if(!reaction){
		res.status(404).json({error: "Reaction non presente"});
		return;
	}

	res.status(200).json({
		id : reaction.id,
		author : reaction.author,
		username : reaction.username,
		reaction : reaction.reaction
	});
});

// reaction/:username GET
router.get("/:username",async (req,res)=>{

  	let user = await User.findOne({'username':req.params.username});
	if(!user){
		res.status(404).json({error: "Username non presente"});
		return;
	}

  	let reaction = await Reaction.find({'username':req.params.username})
  	if(!reaction){
		res.status(404).json({error: "Reaction non presente"});
		return;
	}

	res.status(200).json({
		id : reaction.id,
		author : reaction.author,
		username : reaction.username,
		reaction : reaction.reaction
	});
});

module.exports = router;
