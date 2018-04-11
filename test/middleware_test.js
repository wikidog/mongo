const mongoose = require('mongoose');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');
// const Comment = require('../src/comment');
const assert = require('assert');

describe('Middleware', () => {

  let joe, blogPost;

  beforeEach(done => {

    joe = new User({ name: 'Joe' });

    blogPost = new BlogPost({ 
      title: 'JS is Great',
      content: 'Yes it really is!'
    });

    // set up association
    //
    // we set up association by simply pushing the whole blogPost object
    // mongoose will figure our which field to save
    //
    joe.blogPosts.push(blogPost); 

    Promise.all([joe.save(), blogPost.save()])
      .then(() => done())
      .catch(e => console.log(e));
  });

  // it.only()        <--- only run this test, ignore all other tests
  //
  it('users clean up dangling blogposts on remove', done => {
    joe.remove()
      .then(() => BlogPost.count())
      .then(count => {
        // console.log(doc);
        assert(count === 0);
        done();
      })
      .catch(e => console.log(e));
  });
});