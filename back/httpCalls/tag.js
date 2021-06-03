const express = require('express');
const router = express.Router();
//modello mongoose
const Tag = require('../models/Tag');
const FavoriteTags = require('../models/FavoriteTags');
const User = require('../models/User');


router.post("/user/:username",async(req,res)=>{

	let username = req.params.username;
	let tags = req.body.tags;

	let existUser = await User.findOne({'username': username});
	if(!existUser){
		res.status(404).json({ error: "Nessun Username trovato"});
		return;
	}

	let existTag = await Tag.findOne({'id' : tags});
	if(!existTag){
		res.status(404).json({ error: "Nessun tag trovato"});
		return;
	}

	let favoriteTags = await FavoriteTags.findOne({'username':req.params.username});
	if(!favoriteTags){
		favoriteTags = new FavoriteTags({
		 username : username,
		 id : tags
	   });
	} else {
	  	if(!favoriteTags.id.includes(tags)){
		favoriteTags.id.push(tags)
	  	} else {
			res.status(404).json({ error: "Tag gia inserito"});
			return;
	  	}
	}

	favoriteTags.save();

	res.location("/tag/" + username).status(201).send();
});


router.post("/:name",async(req,res)=>{

	let name = req.params.name;

	//recupero tutti i tag sul db e calcolo un nuovo id
	let allTag = await Tag.find();
	let ids = allTag.map(tmp => tmp.id);
	let id = ( allTag.length==0 ? 1 : Math.max(...ids) + 1);
	

	//let existTag = await Tag.findOne({'name': name});
	//nel caso il nuovo tag esista già nel db ritorno errore
	if(allTag.map(tmp => tmp.name).includes(name)){
		res.status(404).json({ error: "Tag gia presente"});
		return;
	}

	let newTag = new Tag({
	  	id : id,
	  	name : name
	});
	
	newTag.save();
	res.status(201).send();

});


router.get("/user/:username",async (req,res)=>{

  let username = req.params.username;

  if(!await User.findOne({'username': username})){
		res.status(404).json({ error: "User non trovato"});
		return;
  }

  let favoriteTags = await FavoriteTags.findOne({'username':req.params.username});

  //se l'utente non ha tag favoriti si ritorna errore
  if(favoriteTags.id.length<=0){
		res.status(404).send({ error : "User non ha tag favoriti"});
		return;
  }

  let tagName = await Tag.find();
  let final = tagName.filter(x => favoriteTags.id.includes(x.id));


  res.status(200).json(final);

});


router.get("/:name",async (req,res)=>{

	let tagName = await Tag.findOne({'name': req.params.name});
	if(!tagName){
		res.status(404).send();
		return;
	}

	res.status(200).json(tagName);

});


router.get("/id/:id",async (req,res)=>{

	let tagName = await Tag.findOne({'id': req.params.id});
	if(!tagName){
		res.status(404).send();
		return;
	}

	res.status(200).json(tagName);

});


router.get("/",async (req,res)=>{

	let tagName = await Tag.find();
	if(!tagName){
		res.status(404).send();
		return;
	}

	res.status(200).json(tagName);

});

module.exports = router;
