const mongoose = require('mongoose');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');
const Comment = require('../src/comment');
const assert = require('assert');

describe('Associations', () => {

  let joe, blogPost, comment;

  beforeEach(done => {

    joe = new User({ name: 'Joe' });

    blogPost = new BlogPost({ 
      title: 'JS is Great',
      content: 'Yes it really is!'
    });

    comment = new Comment({ content: 'Congrats on great post' });

    // set up association
    //
    // we set up association by simply pushing the whole blogPost object
    // mongoose will figure our which field to save
    //
    joe.blogPosts.push(blogPost); 
    blogPost.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), blogPost.save(),  comment.save()])
      .then(() => done())
      .catch(e => console.log(e));
  });

  // it.only()        <--- only run this test, ignore all other tests
  //
  it('saves a relation between a user and a blogpost', done => {
    User.findOne({ name: 'Joe' })
      .populate('blogPosts')
      .then(doc => {
        // console.log(doc);
        assert(doc.blogPosts[0].title === 'JS is Great');
        done();
      })
      .catch(e => console.log(e));
  });
  
  it('saves a full relation graph of a user, a blogpost, and a commnet', done => {
    User.findOne({ name: 'Joe' })
      .populate({
        path: 'blogPosts',
        populate: {         // further populate the comments under a blogPost
          path: 'comments',
          model: 'Comment', // have to specify the model for further populate
          populate: {       // further populate the user under a comment
                            // we can go as deep as we want
            path: 'user',
            model: 'User'
          }
        }
      })
      .then(doc => {
        // console.log(doc);
        // console.log(doc.blogPosts[0]);
        assert(doc.name === 'Joe');
        assert(doc.blogPosts[0].title === 'JS is Great');
        assert(doc.blogPosts[0].comments[0].content === 'Congrats on great post');
        assert(doc.blogPosts[0].comments[0].user.name === 'Joe');
        done();
      })
      .catch(e => console.log(e));
  });

});