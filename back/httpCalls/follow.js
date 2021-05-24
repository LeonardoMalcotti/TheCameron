const express = require('express');
const router = express.Router();
//modello mongoose
const Follow = require("../models/Follow");


/* API order: (username = id)
* new user-target follow
* remove a user-target follow
* get id of the targets followed by the user
* get id of users that follow a given username
*/

// Set the user to follow another one (passed in post body as target)
// followers/follow POST  
router.post("/follow", async (req,res)=>{
	if(!req.body.target && !req.body.user){
		res.status(400).json({ error: "Utente da seguire non specificato" });
		return;
	}

    let follow = await Follow.find({'user':req.body.user});

	if(!follow){
		// Creating the follow link
		let newFollow = new Follow({
			'user': req.body.user,
			'target': req.body.target,
		});
		newFollow.save();
		res.status(200).send();
	}
    else{
        // Adding the target
        follow = await Follow.updateOne({'user':req.body.user}, {$addToSet: {'target': req.body.target}});
            
        res.status(204).send();
    }
	return;
})


// followers/unfollow POST
router.post("/unfollow",async (req,res)=>{

	if(!req.body.target && !req.body.user){
		res.status(400).json({ error: "Utente da seguire non specificato" });
		return;
	}

	let link = await Follow.findOne({'user':req.body.user});
	
	if(!link){
		res.status(404).send();
		return;
	}else{
		let tmp = link.target;
		let index = tmp.indexOf(req.body.target);
		if(index>=0){
			tmp.splice(index, 1)
		}
		let newRecord = new Follow({
			'user': req.body.user,
			'target': tmp,
		});
		// Delete not working
		Follow.deleteOne({'_id':link.id});
		newRecord.save();
		res.status(204).send();
	}
	return;
});

// ! retuning 404

// GET the usernames of the users that are followed by the given one
// followers/user/:username/following GET
router.get("user/:username/following",async (req,res)=>{
	
	/*function mapFun(art){
		return {'usernames': [art.target]};
	}*/

	let following = await Follow.findOne({'username': req.params.username});
	
	if(!following){
		res.status(404).send();
		return;
	}

	res.status(200).json(following.target);

})

// ! returning 404

// GET the users that follow the given user
// followers/user/:username/followers GET
router.get("user/:username/followers",async (req,res)=>{
	
	function mapFun(art){
		return {'username': art.user}
	}

	let followers = await Follow.find({'target': {$all: req.params.username}});
	
	if(!followers){
		res.status(404).send();
		return;
	}

	res.status(200).json(followers.map(mapFun));

})

module.exports = router;