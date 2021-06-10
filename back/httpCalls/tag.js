const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const FavoriteTags = require('../models/FavoriteTags');
const User = require('../models/User');


//Crea un nuovo tag con il nome passato come parametro
//
router.post("/:name",async(req,res)=>{

	let name = req.params.name;

	//recupero tutti i tag sul db e calcolo un nuovo id
	let allTag = await Tag.find();
	let ids = allTag.map(tmp => tmp.id);
	let id = ( allTag.length==0 ? 1 : Math.max(...ids) + 1);
	

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


//Recupera tutte le coppie id-nome dei tag sul db
//
router.get("/",async (req,res)=>{

	let tagName = await Tag.find();
	if(!tagName){
		res.status(404).send();
		return;
	}

	res.status(200).json(tagName);

});

//Recupera la coppia id-nome del tag specificato dal nome passato per parametro
//
router.get("/:name",async (req,res)=>{

	let tagName = await Tag.findOne({'name': req.params.name});
	if(!tagName){
		res.status(404).send();
		return;
	}

	res.status(200).json(tagName);

});


//Recupera la coppia id-nome del tag specificato dall'id passato per parametro
//
router.get("/id/:id",async (req,res)=>{

	let tagName = await Tag.findOne({'id': req.params.id});
	if(!tagName){
		res.status(404).send();
		return;
	}

	res.status(200).json(tagName);

});



module.exports = router;
