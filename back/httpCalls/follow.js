const express = require('express');
const router = express.Router();
//modello mongoose
const Follow = require("../models/Follow");
const User = require("../models/User");

/* API order: (username = id)
* new user-target follow
* remove a user-target follow
* get id of the targets followed by the user
* get id of users that follow a given username
*/

// Set the user to follow another one (passed in post body as target)
// followers/follow POST
// il body deve essere formato da
//	{
//		user : string,
//		target : string;
//	}
router.post("/follow", async (req,res)=>{

	if(!req.body.target){
		res.status(400).json({ error: "Utente da seguire non specificato" });
		return;
	}

	if(!req.body.user){
		res.status(400).json({error: "Utente non specificato"});
		return;
	}

	if(! await User.findOne({'username':req.body.user})){
		res.status(404).json({error:"Utente specificato non esistente"});
		return;
	}

	if(! await User.findOne({'username':req.body.target})){
		res.status(404).json({error:"Utente da seguire non esistente"});
		return;
	}

	if(req.body.user == req.body.target){
		res.status(400).json({error:"Un utente non può seguire se stesso"});
		return;
	}

    	let follow = await Follow.findOne({'user':req.body.user});

	//nel caso non esista già una entry per il dato utente ne crea una
	if(!follow){
		// Creating the follow link
		let newFollow = new Follow({
			'user': req.body.user,
			'target': [req.body.target],
		});
		newFollow.save();
		res.status(200).send();
	}

	if(follow.target.includes(req.body.target)){
		res.status(400).json({error:"L'utente segue già questo utente"});
		return;
	}

        // Adding the target
        follow.target.push(req.body.target);
        follow.save();

        res.status(204).send();

})


// followers/unfollow POST
router.post("/unfollow",async (req,res)=>{

	if(!req.body.target){
		res.status(400).json({ error: "Utente da seguire non specificato" });
		return;
	}

	if(!req.body.user){
		res.status(400).json({error: "Utente non specificato"});
		return;
	}

	if(! await User.findOne({'username':req.body.user})){
		res.status(404).json({error:"Utente specificato non esistente"});
		return;
	}

	if(! await User.findOne({'username':req.body.target})){
		res.status(404).json({error:"Utente da seguire non esistente"});
		return;
	}

	let link = await Follow.findOne({'user':req.body.user});

	if(!link || link.target.length == 0){
		res.status(404).json({error:"L'utente non ha followed"});
		return;
	}

	if(!link.target.includes(req.body.target)){
		res.status(400).json({error:"L'utente non segue questo target"});
		return;
	}

	link.target.splice(link.target.indexOf(req.body.target),1);
	link.save();
	res.status(204).send();
});

// ! retuning 404

// GET the usernames of the users that are followed by the given one
// followers/user/:username/following GET
router.get("/user/:username/following",async (req,res)=>{

	if(! await User.findOne({'username':req.params.username})){
		res.status(404).json({error:"Utente non esistente"});
		return;
	}

	let following = await Follow.findOne({'user': req.params.username});

	if(!following || following.target.length == 0){
		res.status(404).json({error:"L'utente non segue nessuno"});
		return;
	}

	res.status(200).json({"users":following.target});

});

// ! returning 404

// GET the users that follow the given user
// followers/user/:username/followers GET
router.get("/user/:username/followers",async (req,res)=>{

	if(! await User.findOne({'username':req.params.username})){
		res.status(404).json({error:"Utente non esistente"});
		return;
	}

	let fll = await Follow.find({});
	if (fll.length == 0){
		res.status(404).json({error:"Non c'è nessun utente che segue un altro utente"});
		return;
	}

	let ret = [];

	for(var i=0;i<fll.length;i++){
		if(fll[i].target.includes(req.params.username)){
			ret.push(req.params.username);
		}
	}

	if(ret.length == 0){
		res.status(400).json({error: "Nessuno segue questo utente"});
		return;
	}


	res.status(200).json({"users":ret});

});

module.exports = router;
