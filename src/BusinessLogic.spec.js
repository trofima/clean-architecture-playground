import {assert} from 'chai'
import BusinessLogic from './BusinessLogic'

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
    new BusinessLogic({
      userStore: new UserStoreMock(),
      userCache: new UserCacheMock(),
      tokenStore: new TokenStoreMock(),
      infoStore: new InfoStoreMock(),
    })
  }
}

class UserStoreMock {
  get() {}
}

class UserCacheMock {
  get() {}
}
class TokenStoreMock {
  get() {}
}

class InfoStoreMock {
  get() {}
}
