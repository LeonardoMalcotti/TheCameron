var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model("Tag", new Schema({
    id : {type: Number, required: true},
    name : {type: String, required: true}
}));
