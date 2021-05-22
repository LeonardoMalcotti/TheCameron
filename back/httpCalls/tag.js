const express = require('express');
const router = express.Router();
//modello mongoose
const Tag = require('../models/Tag');
const FavoriteTags = require('../models/FavoriteTags');

router.post("/:username",async(req,res)=>{

    let username = req.params.username;
    let tags = req.body.tags;

    if(!username){
        res.status(404).json({errore:"Utente non presente"});
        return;
    }

    if (tags.length<=0){
        res.status(400).json({ error: "Nessun tag selezionato" });
        return;
    }

    let favorite = new FavoriteTags({
        username,
        id : tags,
    });

    favorite.save();

    res.location("/tag/" + username).status(201).send();
})

router.get("/:username",async (req,res)=>{

    let favoriteTags = await FavoriteTags.find({'username':req.params.username});
    if(favoriteTags.length<=0){
        res.status(404).send();
        return;
    }
    let tagName = await Tag.find({'id':favoriteTags.id});
    res.status(200).json({
        id : tagName.id,
        name : tagName.name,
    });
});

module.exports = router;