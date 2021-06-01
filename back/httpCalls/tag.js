const express = require('express');
const router = express.Router();
//modello mongoose
const Tag = require('../models/Tag');
const FavoriteTags = require('../models/FavoriteTags');
const User = require('../models/User');

router.post("/user/:username",async(req,res)=>{

    let username = req.params.username;
    let tag = req.body.tag;

    let existUser = await User.findOne({'username': username});
    if(!existUser){
        res.status(404).json({ error: "Nessun Username trovato"});
        return;
    }

    let existTag = await Tag.findOne({'id' : tag});
    if(!existTag){
        res.status(404).json({ error: "Nessun tag trovato"});
        return;
    }

    let favoriteTags = await FavoriteTags.findOne({'username':req.params.username});
    if(!favoriteTags){
        favoriteTags = new FavoriteTags({
         username : username,
         id : tag
       });
    } else {
      if(!favoriteTags.id.includes(tag)){
        favoriteTags.id.push(tag)
      }else{
        res.status(404).json({ error: "Tag gia inserito"});
        return;
      }
    }

    favoriteTags.save();

    res.location("/tag/" + username).status(201).send();
});

router.post("/:name",async(req,res)=>{

    let name = req.params.name;

    let allTag = await Tag.find();
  	let id;
    if(allTag){
  		let ids = allTag.map(tmp => tmp.id);
  	 	id = ( allTag.length==0 ? 1 : Math.max(...ids) + 1);
  	}

    let existTag = await Tag.findOne({'name': name});
    if(!existTag){
        let tag = new Tag({
          id : id,
          name : name
        })
        tag.save();
        res.status(201).send();
    }else{
      res.status(404).json({ error: "Tag gia presente"});
    }

});

router.get("/user/:username",async (req,res)=>{

  let existUser = await User.findOne({'username': username});
  if(!existUser){
      res.status(404).json({ error: "Nessun Username trovato"});
      return;
  }

    let favoriteTags = await FavoriteTags.findOne({'username':req.params.username});
    if(favoriteTags.id.length<=0){
        res.status(404).send();
        return;
    }
    let tagName = await Tag.find();
    let final = tagName.filter(x=> favoriteTags.id.includes(x.id));

    res.status(201).json(final);
});

router.get("/:name",async (req,res)=>{

    let tagName = await Tag.findOne({'name': req.params.name});
    if(!tagName){
        res.status(404).send();
        return;
    }
    res.status(201).json(tagName);
});

router.get("/id/:id",async (req,res)=>{

    let tagName = await Tag.findOne({'id': req.params.id});
    if(!tagName){
        res.status(404).send();
        return;
    }
    res.status(201).json(tagName);
});

router.get("/",async (req,res)=>{

    let tagName = await Tag.find();
    if(!tagName){
        res.status(404).send();
        return;
    }
    res.status(201).json(tagName);
});

module.exports = router;
