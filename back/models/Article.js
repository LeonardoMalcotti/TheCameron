var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("Article", new Schema({
	author : {type: String, required: true},
	title : {type: String, required: true},
	summary : {type: String, required: true},
	text : {type: String, required: true},
	date : {type: Date, required: true},
	tag: {type: [String], required: true}
}));
