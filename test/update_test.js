const assert = require('assert');
const User = require('../src/user');

describe('Updating records', () => {

  let joe;

  beforeEach(done => {
    joe = new User({ name: 'Joe', likes: 2 });
    joe.save()
      .then(() => done())
      .catch(e => console.log(e));
  });

  function assertName(doc, done) {
    doc
      .then(() => User.find())
      .then(users => {
        assert(users.length === 1);
        assert(users[0].name === 'Alex');
        done();
      })
      .catch(e => console.log(e));
  }

  it('model instance set and save', done => {
    joe.set('name', 'Alex');
    assertName(joe.save(), done);
  });

  it('model instance update', done => {
    assertName(joe.update({ name: 'Alex' }), done);
  });

  it('class method update', done => {
    assertName(User.update({ name: 'Joe'}, { name: 'Alex' }), done);
  });

  it('class method findOneAndUpdate', done => {
    assertName(User.findOneAndUpdate({ name: 'Joe'}, { name: 'Alex' }), done);
  });

  it('class method findByIdAndUpdate', done => {
    assertName(User.findByIdAndUpdate(joe._id, { name: 'Alex' }), done);
  });

  // xit: omit this test
  it('Users can have their likes incremented by 1', done => {
    //
    // we only send instruction to MongoDB; MongoDB will update the records
    //   Mongodb operators
    //
    User.update(
      { name: 'Joe' }, 
      { $inc: 
        { likes: 1 }
      })
        .then(() => User.findOne({ name: 'Joe' }))
        .then(doc => {
          assert(doc.likes === joe.likes + 1);
          done();
        })
        .catch(e => console.log(e));
  });

});