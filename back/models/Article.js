var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("Article", new Schema({
	id : {type: Number, required: true },
	author : {type: String, required: true},
	title : {type: String, required: true},
	summary : {type: String, required: true},
	text : {type: String, required: true},
  	date : {type: Date, required: true},
  	tags : {type: [String], required: true},
}));

