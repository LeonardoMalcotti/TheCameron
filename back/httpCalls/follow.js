const express = require('express');
const router = express.Router();
//modello mongoose
const Follow = require("../models/Follow");

/* API order: (username = id)
* new user-target follow
* delete a user-target follow
* get id of the targets followed by the user
* get id of users that follow a given username
*/

// Set the user to follow another one (passed in post body as target)
// /follow POST  
router.post("/follow", async (req,res)=>{
	if(!req.body.target && !req.body.user){
		res.status(400).json({ error: "Utente da seguire non specificato" });
		return;
	}

    let follow = await Follow.find({'user':req.body.user});

	if(!follow){
		// Creating the follow link
		let newFollow = new Follow({
			user: req.body.user,
			target: req.body.target,
		});
		newFollow.save();
	}
    else{
        // Check if already following
        follow = await Follow.find({'user':req.body.user})
            .update({ $addToSet: {'target': req.body.target}});
        
    }

	res.status(204);
})


// /unfollow POST
router.post("/unfollow",async (req,res)=>{

	if(!req.body.target && !req.body.user){
		res.status(400).json({ error: "Utente da seguire non specificato" });
		return;
	}

	let link = await Follow.findOne({'user':req.body.user, 'target':req.body.target});

	if(!link){
		res.status(404).send();
		return;
	}

    link.update({$pull: {'target':req.body.target}});
	

	res.status(204).send();
	
});


// GET the usernames of the users that are followed by the given one
// /:username/following GET
router.get("/:username/following",async (req,res)=>{
	
	function mapFun(art){
		return {username: art.target}
	}

	let following = await Follow.find({'user':req.params.username});
	
	if(!following){
		res.status(404).send();
		return;
	}

	res.status(200).json(following.map(mapFun));

})

// GET the users that follow the given user
// /:username/followers GET
router.get("/:username/followers",async (req,res)=>{
	
	function mapFun(art){
		return {username: art.user}
	}

	let followers = await Follow.find({'target':req.params.username});
	
	if(!followers){
		res.status(404).send();
		return;
	}

	res.status(200).json(followers.map(mapFun));

})

module.exports = router;