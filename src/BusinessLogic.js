/** this example class covers following use cases
 * dependency usage
 * asynchronous dependencies usage
 * conditional dependencies usage
 * sequential dependencies usage
 * code reuse
 * stateful
*/


export default class BusinessLogic {
  constructor({userStore, userCache, tokenProvider, userInfoStore, eventEmitter, outputDevice}) {
    this.#userStore = userStore
    this.#userCache = userCache
    this.#tokenProvider = tokenProvider
    this.#userInfoStore = userInfoStore
    this.#eventEmitter = eventEmitter
    this.#outputDevice = outputDevice
  }

  /** contains current user remembered by the system */
  get user() {return this.#user}

  /** gets a user by id either from cache or store depending on cached flag value */
  async getUser(id, cached = true) {
    try {
      const user = cached ? this.#userCache.get(id) : await this.#userStore.get(id)
      return BusinessLogic.#convertUser(user)
    } catch (error) {
      throw new Error('Can not get user', {cause: error})
    }
  }

  /** gets a list of users either from cache or store depending on cached flag value */
  async getList(cached = true) {
    try {
      const users = cached ? this.#userCache.get() : await this.#userStore.get()
      return users.map(BusinessLogic.#convertUser)
    } catch (error) {
      throw new Error('Can not get list', {cause: error})
    }
  }

  /** logs in a user by third party token,
   * emits loggingIn event obtains id from dependency,
   * obtains user data by id and saves it to state,
   * emits userUpdated
   * returns the user */
  async logIn() {
    try {
      const {token} = await this.#tokenProvider.get()
      this.#eventEmitter.emit('loggingIn')
      const {id} = await this.#userInfoStore.get(token)
      const {name, address, profession} = await this.getUser(id)
      const updatedUser = {id, name, address, profession};
      this.#eventEmitter.emit('userUpdate', updatedUser, this.#user)
      this.#user = updatedUser
      return this.#user
    } catch (error) {
      throw new Error('Can not log in', {cause: error})
    }
  }

  async logOut() {
    this.#eventEmitter.emit('loggingOut')
    this.#eventEmitter.emit('userUpdate', undefined, this.#user)
    this.#user = undefined
  }

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

  /** displays saved user on output device if there is saved one */
  async displayUser() {
    if (this.#user)
      await this.#outputDevice.display(this.#user)

    throw new Error('There is no remembered user to display')
  }

  #user
  #userStore
  #userCache
  #tokenProvider
  #userInfoStore
  #eventEmitter
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
