var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("Reaction", new Schema({
	id : {type: Number, required: true },
	author : {type: String, required: true},
	username : {type: String, required: true},
	reaction : {type: Number, required: true}
}));
