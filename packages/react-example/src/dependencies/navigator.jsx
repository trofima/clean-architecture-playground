class AppNavigator {
  use(router) {
    this.#router = router
    this.#history.push(router.state.location.path)
  }

  open(path) {
    this.#assertRouterSupplied()
    this.#router.navigate(path)
    this.#history.push(path)
  }

  close() {
    this.#assertRouterSupplied()
    if (this.#history.length > 1) this.#router.navigate(-1)
    else this.open('/')
  }

  #history = []
  #router

  #assertRouterSupplied() {
    if (!this.#router) throw new Error('Navigator: router is not supplied')
  }
}

export const appNavigator = new AppNavigator()
