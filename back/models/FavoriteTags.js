var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("FavoriteTags", new Schema({
	username : {type: String, required: true},
	id : {type: [Number], required: true},
}));
