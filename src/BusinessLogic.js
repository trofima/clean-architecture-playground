/** this example class covers following use cases
 * dependency usage
 * asynchronous dependencies usage
 * conditional dependencies usage
 * sequential dependencies usage
 * code reuse
 * stateful
*/

import EventEmitter from './EventEmitter'

export default class BusinessLogic extends EventEmitter {
  constructor({userStore, userCache, tokenProvider, userInfoStore, outputDevice}) {
    super()
    this.#userStore = userStore
    this.#userCache = userCache
    this.#tokenProvider = tokenProvider
    this.#userInfoStore = userInfoStore
    this.#outputDevice = outputDevice
  }

  /** Use case: Current User.
   * holds a user remembered by the system
   * */
  get user() {return this.#user}

  /** Use case: User Obtaining.
   * gets a user by id from cache by default
   * if demanded, gets a user by id from store instead of cache
   * converts user according to the contract
   * returns the converted user
   *
   * Error:
   * any step failed
   * */
  async getUser(id, cached = true) {
    try {
      const user = cached ? this.#userCache.get(id) : await this.#userStore.get(id)
      return BusinessLogic.#convertUser(user)
    } catch (error) {
      throw new Error('Can not get user', {cause: error})
    }
  }

  /** Use case: User's List Obtaining.
   * gets a list of users from cache by default
   * if demanded, gets a list of users from store instead of cache
   * converts each user according to the contract
   * returns the converted user's list
   *
   * Error:
   * any step failed
   * */
  async getList(cached = true) {
    try {
      const users = cached ? this.#userCache.get() : await this.#userStore.get()
      return users.map(BusinessLogic.#convertUser)
    } catch (error) {
      throw new Error('Can not get list', {cause: error})
    }
  }

  /** Use case: Log In.
   * get's authentication token from token provider
   * emits 'loggingIn' event
   * obtains user id from userStoreInfo by token
   * obtains user by id (User obtaining from store use case)
   * emits 'userUpdated' event with a new user
   * sets the user to state
   * returns the user
   *
   * Error:
   * any step failed
   * */
  async logIn() {
    try {
      const {token} = await this.#tokenProvider.get()
      this.emit('loggingIn')
      const {id} = await this.#userInfoStore.get(token)
      const user = await this.getUser(id, false)
      this.emit('userUpdate', user)
      this.#user = user
      return user
    } catch (error) {
      throw new Error('Can not log in', {cause: error})
    }
  }

  /** Use case: Log Out.
   * emits 'loggingOut' event
   * emits 'userUpdate' event with undefined and logged out user
   * resets the user in state
   *
   * Error:
   * any step failed
   * */
  async logOut() {
    this.emit('loggingOut')
    this.emit('userUpdate', undefined, this.#user)
    this.#user = undefined
  }

  /** Use case: Delete Account.
   * deletes current user from cache by id
   * deletes current user from store by id
   * logs out the user (Log Out use case)
   *
   * Error:
   * any step failed
   * */
  async deleteAccount() {
    try {
      const {id} = this.#user
      this.#userCache.delete(id)
      await this.#userStore.delete(id)
      this.logOut()
    } catch (error) {
      throw new Error('Can not delete account', {cause: error})
    }
  }

  /** Use case: Display User.
   * displays current user to the output device
   * indicates whether the user is cached or not
   * Error:
   * current user is not set
   * */
  async displayUser() {
    if (this.#user)
      return await this.#outputDevice.display(this.#user, Boolean(this.#userCache.get(this.#user.id)))

    throw new Error('There is no logged in user to display')
  }

  /** Use case: Search Users
   * searches user in user store
   * debounces search requests for 300ms
   * emits 'userListUpdate' event
   * updates user list state
   * * should use only the last request's result for the event emission and state update
   *
   * state userList and error
   *
  */
  async search(text) {

  }

  #user
  #userStore
  #userCache
  #tokenProvider
  #userInfoStore
  #outputDevice

  static #convertUser({id, name, age, address, profession}) {
    return {
      id, name, address,
      profession: BusinessLogic.#professionByCode[profession],
      isAdult: age >= 18,
      canBuyAlcohol: age >= 21,
    }
  }

  static #professionByCode = {
    0: 'programmer',
    1: 'qa',
    2: 'product manager',
    3: 'boss',
  }
}
