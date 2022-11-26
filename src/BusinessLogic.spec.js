import {assert} from 'chai'
import BusinessLogic from './BusinessLogic'

suite('Business Logic', () => {
  suite('User Obtaining', () => {
    test('get a user from cache', async() => {
      const {businessLogic, userCache} = new TestFixtures()
        .withUserCache({id: 'id'})
        .build()

      await businessLogic.getUser('id')

      assert.deepEqual(userCache.get.argumentsAt(0), ['id'])
    })

    test('throw error when getting from cache failed', async() => {
      const {businessLogic, userCache} = new TestFixtures().build()
      const causeError = new Error('Cache is empty')
      userCache.get.fails(causeError)

      try {
        await businessLogic.getUser('id')
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Can not get user')
        assert.equal(error.cause, causeError)
        return
      }

      throw new Error('should have thrown Error')
    })

    test('get another user from cache', async() => {
      const {businessLogic, userCache} = new TestFixtures()
        .withUserCache({id: 'anotherId'})
        .build()

      await businessLogic.getUser('anotherId')

      assert.deepEqual(userCache.get.argumentsAt(0), ['anotherId'])
    })

    test('convert a user from cache', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCache({
          id: 'id',
          name: 'name',
          address: 'address',
        })
        .build()

      const user = await businessLogic.getUser('id')

      assert.include(user, {
        id: 'id',
        name: 'name',
        address: 'address',
      })
    })

    test('convert another user from cache', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCache({
          id: 'anotherId',
          name: 'another name',
          address: 'another address',
        })
        .build()

      const user = await businessLogic.getUser('anotherId')

      assert.include(user, {
        id: 'anotherId',
        name: 'another name',
        address: 'another address',
      })
    })

    test('convert a programmer', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCache({profession: 0})
        .build()

      const user = await businessLogic.getUser('id')

      assert.include(user, {profession: 'programmer'})
    })

    test('convert a qa', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCache({profession: 1})
        .build()

      const user = await businessLogic.getUser('id')

      assert.include(user, {profession: 'qa'})
    })

    test('convert a product manager', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCache({profession: 2})
        .build()

      const user = await businessLogic.getUser('id')

      assert.include(user, {profession: 'product manager'})
    })

    test('convert a boss', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCache({profession: 3})
        .build()

      const user = await businessLogic.getUser('id')

      assert.include(user, {profession: 'boss'})
    })

    test('convert not adult user', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCache({age: 17})
        .build()

      const user = await businessLogic.getUser('id')

      assert.include(user, {isAdult: false})
    })

    test('convert adult user', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCache({age: 18})
        .build()

      const user = await businessLogic.getUser('id')

      assert.include(user, {isAdult: true})
    })

    test('convert not drinking user', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCache({age: 18})
        .build()

      const user = await businessLogic.getUser('id')

      assert.include(user, {canBuyAlcohol: false})
    })

    test('convert drinking user', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCache({age: 21})
        .build()

      const user = await businessLogic.getUser('id')

      assert.include(user, {canBuyAlcohol: true})
    })

    test('get a user from store', async() => {
      const {businessLogic, userStore} = new TestFixtures().withUserStore().build()

      await businessLogic.getUser('id', false)

      assert.deepEqual(userStore.get.argumentsAt(0), ['id'])
    })

    test('throw error when getting from store failed', async() => {
      const {businessLogic, userStore} = new TestFixtures().build()
      const causeError = new Error('Offline')
      userStore.get.fails(causeError)

      try {
        await businessLogic.getUser('id', false)
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Can not get user')
        assert.equal(error.cause, causeError)
        return
      }

      throw new Error('should have thrown Error')
    })

    test('get another user from store', async() => {
      const {businessLogic, userStore} = new TestFixtures().withUserStore().build()

      await businessLogic.getUser('anotherId', false)

      assert.deepEqual(userStore.get.argumentsAt(0), ['anotherId'])
    })

    test('convert a user from store', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserStore({
          id: 'id',
          name: 'name',
          address: 'address',
          profession: 2,
          age: 22,
        })
        .build()

      const user = await businessLogic.getUser('id', false)

      assert.include(user, {
        id: 'id',
        name: 'name',
        address: 'address',
        profession: 'product manager',
        isAdult: true,
        canBuyAlcohol: true,
      })
    })
  })

  suite('User List Obtaining', () => {
    test('get a user list from cache', async() => {
      const {businessLogic, userCache} = new TestFixtures().withUserCacheList().build()

      await businessLogic.getList()

      assert(userCache.get.called, 'user cache get was not called')
    })

    test('throw error when getting from cache failed', async() => {
      const {businessLogic, userCache} = new TestFixtures().build()
      const causeError = new Error('Cache is empty')
      userCache.get.fails(causeError)

      try {
        await businessLogic.getList()
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Can not get list')
        assert.equal(error.cause, causeError)
        return
      }

      throw new Error('should have thrown Error')
    })

    test('convert a list of one user from cache', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCacheList([{
          id: 'id',
          name: 'name',
          address: 'address',
          age: 17,
          profession: 0,
        }]).build()

      const users = await businessLogic.getList()

      assert.deepEqual(users, [{
        id: 'id',
        name: 'name',
        address: 'address',
        profession: 'programmer',
        isAdult: false,
        canBuyAlcohol: false,
      }])
    })

    test('convert a list of multiple users from cache', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserCacheList([{
          id: 'id',
          name: 'name',
          address: 'address',
          age: 17,
          profession: 0,
        }, {
          id: 'anotherId',
          name: 'another name',
          address: 'another address',
          age: 21,
          profession: 1,
        }]).build()

      const users = await businessLogic.getList()

      assert.deepEqual(users, [{
        id: 'id',
        name: 'name',
        address: 'address',
        profession: 'programmer',
        isAdult: false,
        canBuyAlcohol: false,
      }, {
        id: 'anotherId',
        name: 'another name',
        address: 'another address',
        profession: 'qa',
        isAdult: true,
        canBuyAlcohol: true,
      }])
    })

    test('get a user list from store', async() => {
      const {businessLogic, userStore} = new TestFixtures()
      .withUserStoreList([{
        id: 'id',
        name: 'name',
        address: 'address',
        age: 17,
        profession: 0,
      }])
      .build()

      await businessLogic.getList(false)

      assert.deepEqual(userStore.get.argumentsAt(0), [])
    })

    test('throw error when getting from store failed', async() => {
      const {businessLogic, userStore} = new TestFixtures().build()
      const causeError = new Error('Offline')
      userStore.get.fails(causeError)

      try {
        await businessLogic.getList(false)
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Can not get list')
        assert.equal(error.cause, causeError)
        return
      }

      throw new Error('should have thrown Error')
    })

    test('convert a list of a multiple users from store', async() => {
      const {businessLogic} = new TestFixtures()
        .withUserStoreList([{
          id: 'id',
          name: 'name',
          address: 'address',
          age: 17,
          profession: 0,
        }, {
          id: 'anotherId',
          name: 'another name',
          address: 'another address',
          age: 21,
          profession: 1,
        }]).build()

      const users = await businessLogic.getList(false)

      assert.deepEqual(users, [{
        id: 'id',
        name: 'name',
        address: 'address',
        profession: 'programmer',
        isAdult: false,
        canBuyAlcohol: false,
      }, {
        id: 'anotherId',
        name: 'another name',
        address: 'another address',
        profession: 'qa',
        isAdult: true,
        canBuyAlcohol: true,
      }])
    })
  })

  suite('Log In', () => {
    test('obtain token', async() => {
      const {businessLogic, tokenProvider} = new TestFixtures()
        .withToken()
        .withUserInfo()
        .withObtainedUser()
        .build()

      await businessLogic.logIn()

      assert(tokenProvider.get.called, 'tokenProvider was not called')
    })

    test('throw error when obtaining of the token failed', async() => {
      const {businessLogic, tokenProvider} = new TestFixtures()
        .withUserInfo()
        .withObtainedUser()
        .build()
      const causeError = new Error('Cache is empty')
      tokenProvider.get.fails(causeError)

      try {
        await businessLogic.logIn()
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Can not log in')
        assert.equal(error.cause, causeError)
        return
      }

      throw new Error('should have thrown Error')
    })

    test('emit "loggingIn" event after obtaining token', async() => {
      const {businessLogic, tokenProvider} = new TestFixtures()
        .withUserInfo()
        .withObtainedUser()
        .build()
      const loggingInSpy = new Spy()
      businessLogic.on('loggingIn', loggingInSpy)
      tokenProvider.get.defer()

      const loggingIn = businessLogic.logIn()
      assert(!loggingInSpy.called, 'spy was called too early')

      tokenProvider.get.succeed(0, {token: 'token'})

      await loggingIn

      assert(loggingInSpy.called, 'spy was not called')
    })

    test('obtain user id by token', async() => {
      const {businessLogic, userInfoStore} = new TestFixtures()
        .withToken('token')
        .withUserInfo()
        .withObtainedUser()
        .build()

      await businessLogic.logIn()

      assert.deepEqual(userInfoStore.get.argumentsAt(0), ['token'])
    })

    test('obtain user id by another token', async() => {
      const {businessLogic, userInfoStore} = new TestFixtures()
        .withToken('anotherToken')
        .withUserInfo()
        .withObtainedUser()
        .build()

      await businessLogic.logIn()

      assert.deepEqual(userInfoStore.get.argumentsAt(0), ['anotherToken'])
    })

    test('obtain user data by id (User Obtaining)', async() => {
      const {businessLogic} = new TestFixtures()
        .withToken()
        .withUserInfo({id: 'id'})
        .withObtainedUser()
        .build()

      await businessLogic.logIn()

      assert.deepEqual(businessLogic.getUser.argumentsAt(0), ['id', false])
    })

    test('obtain user data by another id (User Obtaining use case)', async() => {
      const {businessLogic} = new TestFixtures()
        .withToken()
        .withUserInfo({id: 'anotherId'})
        .withObtainedUser()
        .build()

      await businessLogic.logIn()

      assert.deepEqual(businessLogic.getUser.argumentsAt(0), ['anotherId', false])
    })

    test('emit "userUpdate" event after obtaining a user', async() => {
      const {businessLogic} = new TestFixtures()
        .withToken()
        .withUserInfo()
        .withObtainedUser({
          id: 'id',
          name: 'name',
          address: 'address',
          profession: 'programmer',
          isAdult: false,
          canBuyAlcohol: false,
        })
        .build()
      const userUpdateSpy = new Spy()
      businessLogic.on('userUpdate', userUpdateSpy)

      await businessLogic.logIn()

      assert.deepEqual(userUpdateSpy.argumentsAt(0), [{
        id: 'id',
        name: 'name',
        address: 'address',
        profession: 'programmer',
        isAdult: false,
        canBuyAlcohol: false,
      }])
    })

    test('emit "userUpdate" event after obtaining another user', async() => {
      const {businessLogic} = new TestFixtures()
        .withToken()
        .withUserInfo()
        .withObtainedUser({
          id: 'anotherId',
          name: 'another name',
          address: 'another address',
          profession: 'qa',
          isAdult: true,
          canBuyAlcohol: true,
        })
        .build()
      const userUpdateSpy = new Spy()
      businessLogic.on('userUpdate', userUpdateSpy)

      await businessLogic.logIn()

      assert.deepEqual(userUpdateSpy.argumentsAt(0), [{
        id: 'anotherId',
        name: 'another name',
        address: 'another address',
        profession: 'qa',
        isAdult: true,
        canBuyAlcohol: true,
      }])
    })

    test('set a user to state', async() => {
      const {businessLogic} = new TestFixtures()
      .withToken()
      .withUserInfo()
      .withObtainedUser({
        id: 'id',
        name: 'name',
        address: 'address',
        profession: 'programmer',
        isAdult: false,
        canBuyAlcohol: false,
      })
      .build()

      await businessLogic.logIn()

      assert.deepEqual(businessLogic.user, {
        id: 'id',
        name: 'name',
        address: 'address',
        profession: 'programmer',
        isAdult: false,
        canBuyAlcohol: false,
      })
    })

    test('set another user to state', async() => {
      const {businessLogic} = new TestFixtures()
      .withToken()
      .withUserInfo()
      .withObtainedUser({
        id: 'anotherId',
        name: 'another name',
        address: 'another address',
        profession: 'qa',
        isAdult: true,
        canBuyAlcohol: true,
      })
      .build()

      await businessLogic.logIn()

      assert.deepEqual(businessLogic.user, {
        id: 'anotherId',
        name: 'another name',
        address: 'another address',
        profession: 'qa',
        isAdult: true,
        canBuyAlcohol: true,
      })
    })

    test('return a user', async() => {
      const {businessLogic} = new TestFixtures()
      .withToken()
      .withUserInfo()
      .withObtainedUser({
        id: 'id',
        name: 'name',
        address: 'address',
        profession: 'programmer',
        isAdult: false,
        canBuyAlcohol: false,
      })
      .build()

      const user = await businessLogic.logIn()

      assert.deepEqual(user, {
        id: 'id',
        name: 'name',
        address: 'address',
        profession: 'programmer',
        isAdult: false,
        canBuyAlcohol: false,
      })
    })

    test('return another user', async() => {
      const {businessLogic} = new TestFixtures()
      .withToken()
      .withUserInfo()
      .withObtainedUser({
        id: 'anotherId',
        name: 'another name',
        address: 'another address',
        profession: 'qa',
        isAdult: true,
        canBuyAlcohol: true,
      })
      .build()

      const user = await businessLogic.logIn()

      assert.deepEqual(user, {
        id: 'anotherId',
        name: 'another name',
        address: 'another address',
        profession: 'qa',
        isAdult: true,
        canBuyAlcohol: true,
      })
    })
  })

  suite('Log Out', () => {
    async function setUp() {
      const {businessLogic} = new TestFixtures()
        .withToken()
        .withUserInfo()
        .withObtainedUser()
        .build()
      await businessLogic.logIn()

      return {businessLogic}
    }

    test('emit "loggingOut" event', async() => {
      const {businessLogic} = await setUp()
      const loggingOutListener = new Spy()
      businessLogic.on('loggingOut', loggingOutListener)

      await businessLogic.logOut()

      assert(loggingOutListener.called, '"loggingOut" event listener was not called')
    })

    test('emit "userUpdate" event', async() => {
      const {businessLogic} = await setUp()
      const userUpdateListener = new Spy()
      businessLogic.on('userUpdate', userUpdateListener)

      await businessLogic.logOut()

      assert.deepEqual(
        userUpdateListener.argumentsAt(0),
        [undefined, TestFixtures.defaultConvertedUser]
      )
    })

    test('reset a user in state', async() => {
      const {businessLogic} = await setUp()

      await businessLogic.logOut()

      assert.equal(businessLogic.user, undefined)
    })
  })

  suite('Delete Account', () => {
    test('remove a user from cache', async() => {
      const {businessLogic, userCache} = await new TestFixtures()
        .withLogOut()
        .buildWithUserState({id: 'id'})

      await businessLogic.deleteAccount()

      assert.deepEqual(userCache.delete.argumentsAt(0), ['id'])
    })

    test('remove another user from cache', async() => {
      const {businessLogic, userCache} = await new TestFixtures()
        .withLogOut()
        .buildWithUserState({id: 'anotherId'})

      await businessLogic.deleteAccount()

      assert.deepEqual(userCache.delete.argumentsAt(0), ['anotherId'])
    })

    test('throw error when deleting user from cache failed', async() => {
      const {businessLogic, userCache} = await new TestFixtures()
        .withLogOut()
        .buildWithUserState()
      const causeError = new Error('Cache is empty')
      userCache.delete.fails(causeError)

      try {
        await businessLogic.deleteAccount()
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Can not delete account')
        assert.equal(error.cause, causeError)
        return
      }

      throw new Error('should have thrown Error')
    })

    test('remove a user from store', async() => {
      const {businessLogic, userStore} = await new TestFixtures().buildWithUserState({id: 'id'})

      await businessLogic.deleteAccount()

      assert.deepEqual(userStore.delete.argumentsAt(0), ['id'])
    })

    test('remove another user from store', async() => {
      const {businessLogic, userStore} = await new TestFixtures()
        .withLogOut()
        .buildWithUserState({id: 'anotherId'})

      await businessLogic.deleteAccount()

      assert.deepEqual(userStore.delete.argumentsAt(0), ['anotherId'])
    })

    test('throw error when deleting user from cache failed', async() => {
      const {businessLogic, userStore} = await new TestFixtures()
        .withLogOut()
        .buildWithUserState()
      const causeError = new Error('Account remove failed')
      userStore.delete.fails(causeError)

      try {
        await businessLogic.deleteAccount()
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Can not delete account')
        assert.equal(error.cause, causeError)
        return
      }

      throw new Error('should have thrown Error')
    })

    test('log out a user (Log Out use case)', async() => {
      const {businessLogic} = await new TestFixtures()
        .withLogOut()
        .buildWithUserState({id: 'id'})

      await businessLogic.deleteAccount()

      assert(businessLogic.logOut.called, 'logOut was not called')
    })
  })

  suite('Display User', () => {
    test('throws when there is no logged in user', async() => {
      const {businessLogic} = await new TestFixtures().build()

      try {
        await businessLogic.displayUser()
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'There is no logged in user to display')
        return
      }

      throw new Error('should have thrown Error')
    })

    test('displays a user', async() => {
      const {businessLogic, outputDevice} = await new TestFixtures()
        .buildWithUserState()

      await businessLogic.displayUser()

      assert.deepEqual(outputDevice.display.argumentsAt(0)[0], TestFixtures.defaultConvertedUser)
    })

    test('looks for a user in cache', async() => {
      const {businessLogic, userCache} = await new TestFixtures().buildWithUserState({id: 'id'})

      await businessLogic.displayUser()

      assert.deepEqual(userCache.get.argumentsAt(0), ['id'])
    })

    test('looks for another user in cache', async() => {
      const {businessLogic, userCache} = await new TestFixtures().buildWithUserState({id: 'anotherId'})

      await businessLogic.displayUser()

      assert.deepEqual(userCache.get.argumentsAt(0), ['anotherId'])
    })

    test('indicates that user is not cached', async() => {
      const {businessLogic, outputDevice, userCache} = await new TestFixtures().buildWithUserState()
      userCache.get.returns(undefined)

      await businessLogic.displayUser()

      assert.equal(outputDevice.display.argumentsAt(0)[1], false)
    })

    test('indicates that user is cached', async() => {
      const {businessLogic, outputDevice} = await new TestFixtures()
        .withUserCache()
        .buildWithUserState()

      await businessLogic.displayUser()

      assert.equal(outputDevice.display.argumentsAt(0)[1], true)
    })
  })
})

class TestFixtures {
  static defaultUser = {
    id: 'someId',
    name: 'some name',
    address: 'some address',
    age: 17,
    profession: 0,
  }

  static defaultConvertedUser = {
    id: 'someId',
    name: 'some name',
    address: 'some address',
    profession: 'programmer',
    isAdult: false,
    canBuyAlcohol: false,
  }

  withUserCache(partialUser = {}) {
    this.#userCache.get.returns({
      ...TestFixtures.defaultUser,
      ...partialUser,
    })
    return this
  }

  withUserCacheList(list = [TestFixtures.defaultUser]) {
    this.#userCache.get.returns(list)
    return this
  }

  withUserStore(partialUser = {}) {
    this.#userStore.get.returns({
      ...TestFixtures.defaultUser,
      ...partialUser,
    })
    return this
  }

  withUserStoreList(list = [TestFixtures.defaultUser]) {
    this.#userStore.get.returns(list)
    return this
  }

  withToken(token = 'token') {
    this.#tokenProvider.get.returns({token})
    return this
  }

  withUserInfo(info = {id: 'someId'}) {
    this.#userInfoStore.get.returns(info)
    return this
  }

  withObtainedUser(partialUser = {}) {
    const getUser = new AsyncSpy()

    getUser.returns({
      ...TestFixtures.defaultConvertedUser,
      ...partialUser,
    })
    this.#BusinessLogic = class extends this.#BusinessLogic {
      getUser = getUser
    }
    return this
  }

  withLogOut() {
    this.#BusinessLogic = class extends this.#BusinessLogic {
      logOut = new AsyncSpy()
    }
    return this
  }

  build() {
    const dependencies = {
      userStore: this.#userStore,
      userCache: this.#userCache,
      userInfoStore: this.#userInfoStore,
      tokenProvider: this.#tokenProvider,
      outputDevice: this.#outputDevice,
    }
    const businessLogic = new this.#BusinessLogic(dependencies)

    return {businessLogic, ...dependencies}
  }

  async buildWithUserState(partialUser = {}) {
    const fixtures =  this
      .withToken()
      .withUserInfo()
      .withObtainedUser(partialUser)
      .build()

    await fixtures.businessLogic.logIn()

    return fixtures
  }

  #userCache = new UserCacheMock()
  #userStore = new UserStoreMock()
  #userInfoStore = new UserInfoStoreMock()
  #tokenProvider = new TokenProviderMock()
  #outputDevice = new OutputDeviceMock()
  #BusinessLogic = BusinessLogic
}

class UserStoreMock {
  get = new AsyncSpy()
  delete = new AsyncSpy()
}

class UserCacheMock {
  get = new Spy()
  delete = new Spy()
}
class TokenProviderMock {
  get = new AsyncSpy()
}

class UserInfoStoreMock {
  get = new AsyncSpy()
}

class OutputDeviceMock {
  display = new AsyncSpy()
}

class Deferred {
  constructor () {
    this.#state = 'initialized'
    this.#promise = new Promise((resolve, reject) => {
      this.#state = 'pending'
      this.#resolve = value => ((resolve(value), this.#state = 'resolved', this.#promise))
      this.#reject = error => ((reject(error), this.#state = 'rejected', this.#promise))
    })
  }

  get promise() {return this.#promise}
  get resolve() {return this.#resolve}
  get reject() {return this.#reject}
  get state() {return this.#state}

  #promise = null
  #resolve = null
  #reject = null
  #state = 'notInitialized'
}

class ExtensibleFunction extends Function {
  constructor(func) {
    return Object.setPrototypeOf(func, new.target.prototype)
  }
}

class SpyContext {
  callArguments = []
  callCount = 0
  defaultReturn = undefined
  defaultError = undefined

  addCall(args) {
    this.callCount++
    this.callArguments.push(args)
  }
}

class AsyncSpyContext extends SpyContext {
  deferred = false
  deferredCalls = []
}

class BaseSpy extends ExtensibleFunction {
  constructor(spy, context) {
    super(spy)

    this.#context = context
  }

  get called() {return Boolean(this.#context.callCount)}
  get callCount() {return this.#context.callCount}

  returns(value) {
    this.#context.defaultReturn = value
  }

  fails(error) {
    this.#context.defaultError = error
  }

  argumentsAt(index) {
    return this.#context.callArguments[index]
  }

  #context
}
class Spy extends BaseSpy {
  constructor() {
    const context = new SpyContext()

    function spy(...args) {
      context.addCall(args)

      if (context.defaultError)
        throw context.defaultError
      return context.defaultReturn
    }

    super(spy, context)
  }
}

class AsyncSpy extends BaseSpy {
  constructor() {
    const context = new AsyncSpyContext()

    function spy(...args) {
      context.addCall(args)

      const deferred = new Deferred()
      if (context.deferred)
        context.deferredCalls.push(deferred)
      else if (context.defaultError)
        deferred.reject(context.defaultError)
      else
        deferred.resolve(context.defaultReturn)
      return deferred.promise
    }

    super(spy, context)

    this.#context = context
  }

  defer() {
    this.#context.deferred = true
  }

  async fail(index, error) {
    const deferredFail = new Deferred()
    setImmediate(() => {
      const deferredCall = this.#context.deferredCalls[index]
      if (!deferredCall)
        throw new Error(`Function was not called at ${index}`)
      deferredCall.reject(error)
    })
    return deferredFail.promise
  }

  async succeed(index, ...args) {
    const deferredSucceed = new Deferred()
    setImmediate(() => {
      const deferredCall = this.#context.deferredCalls[index]
      if (!deferredCall)
        throw new Error(`Function was not called at ${index}`)
      deferredCall.resolve(...args)
      deferredSucceed.resolve()
    })
    return deferredSucceed.promise
  }

  #context
}
