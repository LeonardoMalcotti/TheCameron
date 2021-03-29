var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("User", new Schema({
	name : {type: String, required: true},
	surname : {type: String, required: true},
	username : {type: String, required: true},
	password : {type: String, required: true},
	email : {type: String, required: true},
}));
