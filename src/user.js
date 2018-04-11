const mongoose = require('mongoose');
const PostSchema = require('./post_sub-doc');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    validate: {
      validator: name => name.length > 2,
      message: 'Name must be longer than 2 characters.'
    },
  },
  posts: [PostSchema],            // nested resources (sub-documents)
  likes: Number,
  blogPosts: [{                   // association with other resource
    type: Schema.Types.ObjectId,
    ref: 'BlogPost'
  }]
});

// Virtual Type
//
// We use ES6 getter feature
// when we reference joe.postCount, the getter function will run
// 
// fat arrow function binds this to this whole file
// we have to use the normal function definition here!!!!
// this will bind to the runtime context, which is 
//   the instance of the model  
//
UserSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

// Middleware
//
UserSchema.pre('remove', function(next) {  // we have to use keyword function
  //
  // use mongoose helper function to avoid loading another module
  //   for this whole module, which may cause "cyclic requires"
  // we only load the module for this specific function
  //
  const BlogPost = mongoose.model('BlogPost');

  // use Mongoose operator to instruct Mongoose
  //   to delete an array of posts at the same time
  //
  BlogPost.remove({ 
    _id: {
      $in: this.blogPosts   // this is the array contains all the post ids
                            // we want to remove
    }
  })
    .then(() => next())     // middleware has to call next() function
    .catch(e => console.log(e));
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
