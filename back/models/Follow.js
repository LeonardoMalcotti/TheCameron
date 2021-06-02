var mongoose = require("mongoose");
var Schema = mongoose.Schema;


module.exports = mongoose.model("Follow", new Schema({
	user: {type: String, required: true},
	target: {type: [String], required: false},
}));