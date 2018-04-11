const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of the database', () => {

  let joe, maria, alex, zach;

  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    maria = new User({ name: 'Maria' });
    alex = new User({ name: 'Alex' });
    zach = new User({ name: 'Zach' });

    Promise.all([joe.save(), maria.save(), alex.save(), zach.save()])
      .then(() => done())
      .catch(e => console.log(e));
  });

  it('finds all users with name of joe', done => {
    User.find({ name: 'Joe' })
      .then((docs) => {
        //console.log(docs);
        assert(docs[0]._id.toString() === joe._id.toString());
        done();
      })
      .catch(e => console.warn('Error: ', e));
  });

  it('find a user with a particular id', done => {
    User.findOne({ _id: joe._id })
      .then((doc) => {
        //console.log(docs);
        assert(doc.name === 'Joe');
        done();
      })
      .catch(e => console.warn('Error: ', e));
  });

  it('can skip and limit the result set', done => {
    User.find({})
      .sort({ name: 1 })   // 1: asc   -1: desc
      .skip(1)
      .limit(2)
      .then(users => {
        // console.log(users);
        assert(users.length === 2);
        assert(users[0].name === 'Joe');
        assert(users[1].name === 'Maria');
        done();
      })
      .catch(e => console.warn(e));
  });

});