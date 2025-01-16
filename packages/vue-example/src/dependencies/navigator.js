class AppNavigator {
  use(router) {
    this.#router = router
    this.#history.push(router.options.history.location)
  }

  open(path) {
    this.#assertRouterSupplied()
    this.#router.push(path)
    this.#history.push(path)
  }

  close() {
    this.#assertRouterSupplied()
    if (this.#history.length > 1) this.#router.back()
    else this.open('/')
  }

  #history = []
  #router

  #assertRouterSupplied() {
    if (!this.#router) throw new Error('Navigator: router is not supplied')
  }
}

export const appNavigator = new AppNavigator()
