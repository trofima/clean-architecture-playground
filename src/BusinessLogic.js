class BusinessLogic {
  constructor({userStore, userCache, tokenStore, infoStore}) {
    this.#userStore = userStore
    this.#userCache = userCache
    this.#tokenStore = tokenStore
    this.#infoStore = infoStore
  }

  static convertUser({id, name, age}) {
    return {id, name, isAdult: age >= 18, canBuyAlcohol: age >= 21}
  }

  async getUser(id, cached = true) {
    const user = cached ? await this.#userCache.get(id) : await this.#userStore.get(id)
    return BusinessLogic.convertUser(user)
  }

  async getList(cached = true) {
    const users = cached ? await this.#userCache.get() : await this.#userStore.get()
    return users.map(BusinessLogic.convertUser)
  }

  getInfo(id) {
    const {token} = this.#tokenStore.get(id)
    const {age, address} = this.#infoStore.get(token)
    return {address, canDrink: age >= 21};
  }

  #userStore
  #userCache
  #tokenStore
  #infoStore
}
