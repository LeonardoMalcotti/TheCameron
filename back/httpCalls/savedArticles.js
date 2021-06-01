const express = require('express');
const router = express.Router();
//modello mongoose
const SavedArticles = require('../models/SavedArticles');
const User = require('../models/User');
const Article = require('../models/Article');

//Inserimento nuovo articolo salvato
router.post("/:username/article/:author/:id",async(req,res)=>{

    let username = req.params.username;
    let id = req.params.id;
    let author = req.params.author;

    //Controllo se esiste l'utente
    let existUser = await User.findOne({'username': username});
    if(!existUser){
        res.status(404).json({ error: "Nessun Username trovato"});
        return;
    }

    //Controllo se ha gia salvato articoli
    let savedArticles = await SavedAritcles.findOne({'username':username});
    if(!savedArticles){//se non ha salvato articoli lo creo
        let savedArticles = new SavedArticles({
          username : username,
          id :id,
          author: author
        });
    }else{//se ha gia salvato articoli
      var esiste = false;
      for(i = 0; i < savedArticles.id.length; i++){
        if(savedArticles.id[i] == id && savedArticles.author[i] == author)
          esiste = true;
      }
      if(esiste){//se l'articolo è gia stato salvato
        res.status(403).json({ error: "Articolo già salvato" });
        return;//aggiungo l'articolo alla lista
      }else{
        savedArticles.id.push(id);
        savedArticles.author.push(author);
      }
    }

    savedArticles.save();
    res.location("/savedArticles/" + username+"/article/"+article.author+"/"+article.id).status(201).send();
})

//GET articoli salvati da :username
router.get("/:username",async (req,res)=>{

    let username = req.params.username;

    //Controllo se esiste l'utente
    let existUser = await User.findOne({'username': username});
    if(!existUser){
        res.status(404).json({ error: "Nessun Username trovato"});
        return;
    }

    //Controllo se ha salvato articoli
    let savedArticles = await SavedArticles.findOne({'username': username});
    if(!(savedArticles.id.length > 0)){
        res.status(404).json({ error: "Nessun Articolo salvato"});
        return;
    }

    let art=[];
    for(i = 0; i < savedArticles.id.length; i++){
        art[i] = await Article.findOne({'id':savedArticles.id[i],'author': savedArticles.author[i]});
    }
    res.status(201).json(art);
});

//GET articolo salvato
router.get("/user/:username/article/:author/:id",async (req,res)=>{

    let username = req.params.username;
    let id = req.params.id;
    let author = req.params.author;

    //Controllo se esiste l'utente
    let existUser = await User.findOne({'username': username});
    if(!existUser){
        res.status(404).json({ error: "Nessun Username trovato"});
        return;
    }

    //Controlo se ha salvato articoli
    let savedArticles = await SavedArticles.findOne({'username' : username});
    if(!(savedArticles.id.length > 0)){
        res.status(404).json({ error: "Nessun Articolo salvato"});
        return;
    }

    //Controllo se esiste l'articolo tra i salvati
    let art;
    var esiste = false;
    for(i = 0; i < savedArticles.id.length; i++){
        if(savedArticles.id[i] == id && savedArticles.author[i] == author){
          art = await Article.findOne({'id':savedArticles.id[i],'author': savedArticles.author[i]});
          esiste = true;
        }
      }

    if(!esiste){
      res.status(404).json({ error: "Articolo non trovato"});
      return;
    }
    res.status(201).json(art);
});

router.delete("/user/:username/article/:author/:id",async (req,res)=>{

  let username = req.params.username;
  let id = req.params.id;
  let author = req.params.author;

  //Controllo se esiste l'utente
  let existUser = await User.findOne({'username': username});
  if(!existUser){
      res.status(404).json({ error: "Nessun Username trovato"});
      return;
  }

  //Controlo se ha salvato articoli
  let savedArticles = await SavedArticles.findOne({'username' : username});
  if(!(savedArticles.id.length > 0)){
      res.status(404).json({ error: "Nessun Articolo salvato"});
      return;
  }

  //Controllo se esiste l'articolo tra i salvati
  let index;
  var esiste = false;
  for(i = 0; i < savedArticles.id.length; i++){
      if(savedArticles.id[i] == id && savedArticles.author[i] == author){
        index = i;
        esiste = true;
      }
    }

  if(!esiste){
    res.status(404).json({ error: "Articolo non trovato"});
    return;
  }

  //Cancello dai preferiti l'articolo
  let ret = await Subscription.deleteOne({'username':req.params.username});

	if (ret) {
		res.status(204).send();
	} else {
		res.status(400).send();
		res.json({error: "Errore nella cancellazione dell'articolo salvato"});
	}

/*    delete saved.id[saved.id.indexOf(req.params.id)];
    delete saved.author[saved.author.indexOf(req.params.author)];
    saved.save();*/



})

module.exports = router;
