const express = require('express');
const router = express.Router();
//modello mongoose
const SavedArticles = require('../models/SavedArticles');
const User = require('../models/User');
const Article = require('../models/Article');

router.post("/user/:username",async(req,res)=>{

    let username = req.params.username;
    let article= req.body.article.id;

    if(!username){
        res.status(404).json({errore:"Utente non presente"});
        return;
    }

    let existUser = await User.findOne({'username': username});
    if(!existUser){
        res.status(404).json({ error: "Nessun Username trovato"});
        return;
    }


    let savedArticles = await SavedAritcles.find({'username':username});
    if(!savedArticles){
        let save= new SavedArticles({
          username : username,
          id :[article.id],
          author: [article.author]
        });
    }
    else
    {//se esiste gia
    savedArticles.id[savedArticles.id.length] = article.id;
    savedArticles.author[savedArticles.author.length] = article.author;
    }
  
    savedArticles.save();
    res.location("/savedArticles/" + username+"/article/"+article.author+"/"+article.id).status(201).send();
})

router.get("/user/:username",async (req,res)=>{
    let i=0;
    let art=[];
    let savedArticles = await SavedArticles.findOne({'username':req.params.username});
    if(savedArticles.id.length<=0){
        res.status(404).send();
        return;
    }
    for(i=0;i<savedArticles.id.length;i++){
        art[i] = await Article.findOne({'id':savedArticles.id[i],'author': savedArticles.author[i]})
    }
    res.status(201).json(art);
});

router.get("/user/:username/article/:author/:id",async (req,res)=>{

    let saved = await SavedArticles.findOne({'username':req.params.username});
    if(!savedArticles.id.length<=0){
        res.status(404).send();
        return;
    }
    let article = await Article.findOne({'id':req.params.id,'author':req.params.author});
    if(!article)
    {
        res.status(404).send();
        return;
    }
    res.status(201).json(savedArticles);
});

router.delete("/user/:username/article/:author/:id",async (req,res)=>{
    
    let saved = await SavedArticles.findOne({'username':req.params.username});

    if(!saved){
        res.status(404).send();
		res.json({error: "Username errato o nessun preferito"});
    }

    if(saved.id.length()==0){

        res.status(404).send();
        res.json({error: "Nessun preferito"});
    }

    delete saved.id[saved.id.indexOf(req.params.id)];
    delete saved.author[saved.author.indexOf(req.params.author)];
    saved.save();

    if (ret) {
		res.status(204).send();
	} else {
		res.status(400).send();
        res.json({error: "Errore nella cancellazione dell'articolo salvato"});
        return;
	}

})

module.exports = router;