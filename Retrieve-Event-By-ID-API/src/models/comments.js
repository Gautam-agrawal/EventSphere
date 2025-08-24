const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: String,
    createdAt: {
		type: Date,
		default: Date.now
	},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Comment", commentSchema);