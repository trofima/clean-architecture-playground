import {assert} from 'chai'

suite('Business Logic', () => {
  test('dummy fail', async () => {
    assert(false, 'it is ok');
  })

  test('dummy pass', async () => {
    assert(true);
  })
});

class TestFixtures {
  constructor() {
    new BusinessLogic({userStore: new UserStoreMock(), userCache: new UserCacheMock()})
  }
}

class UserStoreMock {
  get() {}
}

class UserCacheMock {
  get() {}
}