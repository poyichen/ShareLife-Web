var mongoose   = require("mongoose"),
    comment    = require("./comment");
// SCHEMA SETUP
var photoSchema = new mongoose.Schema({
    title: String,
    image: String,
    date: String,
    description: String,
    createAt:{
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" 
        },
        username: String
    },
    comments: [
      {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
      }
   ]
});


photoSchema.pre('remove', async function() {
	await comment.remove({
		_id: {
			$in: this.comments
		}
	});
});

module.exports = mongoose.model("Photo", photoSchema);