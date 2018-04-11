const assert = require('assert');
const User = require('../src/user');

describe('Subdocuments', () => {

  it('can create a subdocument', done => {
    const joe = new User({ 
      name: 'Joe', 
      posts: [{ title: 'PostTitle' }] 
    });

    joe.save()
      .then(() => User.findOne({ name: 'Joe' }))
      .then(doc => {
        assert(doc.posts[0].title === 'PostTitle');
        done();
      })
      .catch(e => console.log(e));
  });

  it('can add subdocuments to an existing record', done => {
    const joe = new User({ 
      name: 'Joe', 
      posts: [{ title: 'PostTitle' }] 
    });

    joe.save()
      .then(() => User.findOne({ name: 'Joe' }))
      .then(doc => {
        doc.posts.push({ title: 'PostTitle2' });
        return doc.save();
      })
      .then(() => User.findOne({ name: 'Joe' }))
      .then(doc => {
        assert(doc.posts[1].title === 'PostTitle2');
        done();
      })
      .catch(e => console.log(e));
  });

  it('can remove an existing subdocument', done => {
    const joe = new User({ 
      name: 'Joe', 
      posts: [{ title: 'PostTitle' }, { title: 'PostTitle2'} ] 
    });

    joe.save()
      .then(() => User.findOne({ name: 'Joe' }))
      .then(doc => {
        const post = doc.posts[1];
        post.remove();  // the remove() method if provide by Mongoose
        // after remove sub-doc, we have to call save()
        return doc.save();
      })
      .then(() => User.findOne({ name: 'Joe' }))
      .then(doc => {
        assert(doc.posts.length === 1);
        assert(doc.posts[0].title === 'PostTitle');
        done();
      })
      .catch(e => console.log(e));
  });
});