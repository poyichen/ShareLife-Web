var mongoose   = require("mongoose");
var passwordLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passwordLocalMongoose);

module.exports = mongoose.model("User", UserSchema);