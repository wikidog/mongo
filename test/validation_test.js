const assert = require('assert');
const User = require('../src/user');

describe('Validating records', () => {

  it('requires a user name', () => {

    // we can do "new User({})"
    // the following way is for documnetation purpose
    // we specifically want the name to be undefined
    //
    const user = new User({ name: undefined });

    // validation can take time; for that kind of situation,
    // we will use the async version, which if validate() method
    const validationResult = user.validateSync();

    const { message } = validationResult.errors.name;

    assert(message === 'Name is required.');

  });

  it('requires user name longer than 2 characters', () => {

    const user = new User({ name: 'ab' });

    const validationResult = user.validateSync();

    const { message } = validationResult.errors.name;

    assert(message === 'Name must be longer than 2 characters.');
  });

  it('disallows invalid records from being saved', done => {

    const user = new User({ name: 'ab' });
    user.save()
      .then()
      .catch(validationResult => {
        const { message } = validationResult.errors.name;
        assert(message === 'Name must be longer than 2 characters.');
        done();
      });
  });

});