class BusinessLogic {
  constructor({userStore, userCache}) {
    this.#userStore = userStore
    this.#userCache = userCache
  }

  static convertUser({id, name, age}) {
    return {id, name, isAdult: age >= 18, canBuyAlcohol: age >= 21}
  }

  async getUser(id, cached = true) {
    const user = cached ? await this.#userCache.get(id) : await this.#userStore.get(id)
    
    return this.#convert(user)
  }

  async getList(cached = true) {
    const users = cached ? await this.#userCache.get() : await this.#userStore.get()
    
    return users.map(BusinessLogic.convertUser)
  }

  #userStore
  #userCache
}
