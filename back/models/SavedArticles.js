var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("savedArticles", new Schema({
	username : {type: String, required: true},
	articles : {type: [ {id:Number, author:String} ], required: true},
	//id : {type: [Number], required: true},
	//author: {type: [String], required: true},
}));
