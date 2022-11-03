import {assert} from 'chai'
import BusinessLogic from './BusinessLogic'

suite('Business Logic', () => {
  test('dummy fail', async () => {
    assert(false, 'it is ok, it should fail')
  })

  test('dummy pass', async () => {
    assert(true)
  })
});

class TestFixtures {
  build() {
    const businessLogic = new BusinessLogic({
      userStore: new UserStoreMock(),
      userCache: new UserCacheMock(),
      userInfoStore: new UserInfoStoreMock(),
      tokenProvider: new TokenProviderMock(),
      eventEmitter: new EventEmitterMock(),
      outputDevice: new OutputDeviceMock(),
    })

    return {businessLogic}
  }
}

class UserStoreMock {
  get() {}
}

class UserCacheMock {
  get() {}
}
class TokenProviderMock {
  get() {}
}

class UserInfoStoreMock {
  get() {}
}

class EventEmitterMock {
  emit() {}
}

class OutputDeviceMock {
  display() {}
}
