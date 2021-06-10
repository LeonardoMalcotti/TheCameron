var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("Subscription", new Schema({
	username : {type: String, required: true},
  	dateSubscription : {type: Date, required: true}
}));
