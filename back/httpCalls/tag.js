const express = require('express');
const router = express.Router();
//modello mongoose
const Tag = require('../models/Tag');
const FavoriteTags = require('../models/FavoriteTags');
const User = require('../models/User');

router.post("/user/:username",async(req,res)=>{

    let username = req.params.username;
    let tags = req.body.tags;

    if(!username){
        res.status(404).json({errore:"Utente non presente"});
        return;
    }

    let existUser = await User.findOne({'username': username});
    if(!existUser){
        res.status(404).json({ error: "Nessun Username trovato"});
        return;
    }


    let favoriteTags = await FavoriteTags.find({'username':req.params.username});
    favoriteTags.id.push(tags.id);

    favoriteTags.save();

    res.location("/tag/" + username).status(201).send();
})

router.get("/user/:username",async (req,res)=>{

    let favoriteTags = await FavoriteTags.findOne({'username':req.params.username});
    if(favoriteTags.id.length<=0){
        res.status(404).send();
        return;
    }
    let tagName = await Tag.find();
    let final = tagName.filter(x=> favoriteTags.id.includes(x.id));
    
    res.status(201).json(
       final
    );
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