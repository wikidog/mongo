const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbName = 'users_test';

// tell mongoose which promise libariry to use
mongoose.Promise = global.Promise;

before(done => {
  mongoose.connect(`${url}/${dbName}`)
    .then(() => {
      // console.log('Good to go!');
      done();
    })
    .catch(e => console.warn('Error: ', e));
});

//module.exports = { mongoose };

beforeEach(done => {
  const { users, blogposts, comments } = mongoose.connection.collections;
  //
  // in MongoDB, we cannot drop multiple collections at the same time
  // we have to drop the them one by one
  //
  users.drop(() => {
    // ready to run the next test!
    // console.log('collection dropped!!');
    blogposts.drop(() => {
      comments.drop(() => {
        done();
      });
    });
  });
});
