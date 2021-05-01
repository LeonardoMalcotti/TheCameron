const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
const user = require('../models/User');

router.post('', async function(req, res) {

	if (!req.body.username){
		res.status(400).json({ error: "Username dell' utente non specificato" });
		return;
	}

	if (!req.body.password){
		res.status(400).json({ error: "Password dell' utente non specificata" });
		return;
	}

	let us = await user.findOne({'username':req.body.username});
	if(!us){
		res.status(403).json({ success: false, message: "user not found" });
		return;
	}

	if(req.body.password != us.password){
		res.status(403).json({ success: false, message: "wrong password" });
		return;
	}

	var payload = {
		username: us.username,
		email: us.email
	};

	var options = {
		expiresIn: 86400 
	};

	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.status(200).json({
		success: true,
		message: 'Token created',
		token: token
	});

});

module.exports = router;