const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'                  // this is the model name
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;