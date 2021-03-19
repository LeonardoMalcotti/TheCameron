var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("Model", new Schema({
	id : {type: Number, required: true}
}));