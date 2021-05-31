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

    let spl = req.body.tags.split(",");

    for( t in spl ){
      let temp = await Tag.findOne({'name' : spl[t]})
      if(temp){
        tags = tags.concat(temp.id);
      }
    }

    if(!tags){
      res.status(404).json({ error: "Nessun Tag corrispondente"});
      return;
    }

    let favoriteTags = await FavoriteTags.findOne({'username':req.params.username});

    if(!favoriteTags){
        favoriteTags = new FavoriteTags({
         username : username,
         id : [tag.id]
       });
    } else {
        favoriteTags.id.push(tag.id)
    }


    /*
    for( t in tags ){
     tags = tags.concat(temp.id);
     favoriteTags.id = favoriteTags.id.concat(tags[t]);
    }*/


    favoriteTags.save();

    res.location("/tag/" + username).status(201).send();
})

router.post("/user/:username",async(req,res)=>{

    let username = req.params.username;
    let tags = [];

    let existUser = await User.findOne({'username': username});
    if(!existUser){
        res.status(404).json({ error: "Nessun Username trovato"});
        return;
    }

    let spl = req.body.tags.split(",");
console.log(req.body.tags);
    for( t in spl ){
      console.log(spl[t]);
      let temp = await Tag.findOne({'name' : spl[t]})
      if(temp){
        tags = tags.concat(temp.id);
        console.log(temp.id);
      }
    }

    if(!tags){
      res.status(404).json({ error: "Nessun Tag corrispondente"});
      return;
    }

    let favoriteTags = await FavoriteTags.findOne({'username':req.params.username});

    console.log(username);
    console.log(tags);
    if(!favoriteTags){
      let fav = new FavoriteTags({
        username : username,
        id : tags
      });
      fav.save();
      res.location("/tag/" + username).status(201).send();

    }else{//se esiste gia
      for( t in tags ){
        favoriteTags.id[favoriteTags.id.length] = tags[t];
      }
    }

    favoriteTags.save();


})

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

})

router.get("/user/:username",async (req,res)=>{

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

router.get("/",async (req,res)=>{

    let tagName = await Tag.find();
    if(!tagName){
        res.status(404).send();
        return;
    }
    res.status(201).json(tagName);
});

router.delete("/user/:username/favorite/:id",async (req,res)=>{

    let tag = await FavoriteTags.findOne({'username':req.params.username});

    if(!tag){
        res.status(404).send();
		res.json({error: "Username errato o nessun preferito"});
    }

    if(tag.id.length()==0){

        res.status(404).send();
        res.json({error: "Nessun preferito"});
    }

    delete tag.id[tag.id.indexOf(req.params.id)];
    tag.save();

    if (ret) {
		res.status(204).send();
	} else {
		res.status(400).send();
        res.json({error: "Errore nella cancellazione del tag preferito"});
        return;
	}

})

module.exports = router;