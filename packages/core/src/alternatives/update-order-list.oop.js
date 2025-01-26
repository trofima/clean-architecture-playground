/* eslint-disable no-unused-vars */
/**
 * Here you can find more classical example with all common CA abstractions,
 * like UseCase, Entity, Presenter, Controller
 */

/**
 * UseCase OOP example
 * It implements pattern Command.
 */
export class UpdateOrderList {
  constructor({params, state, presenter, dataStore, notifier}) {
    this.#params = params
    this.#state = state
    this.#presenter = presenter
    this.#dataStore = dataStore
    this.#notifier = notifier
  }

  async execute() {
    this.#presenter.orderListLoadingStarted()
    const {orderListPresentation} = this.#state.get()
    try {
      const {refresh} = this.#params
      orderListPresentation.setRefreshingMode(refresh)
      const readOptions = orderListPresentation.readOptions()
      const {list, total} = await this.#dataStore.get('orders', readOptions)
      orderListPresentation.updateListing({list, total})

      const users = list.length ? await this.#dataStore.get('users', orderListPresentation.userIds) : []
      orderListPresentation.setUsers(users)

      this.#presenter.orderListLoadingSucceeded(orderListPresentation.listing)
    } catch (error) {
      orderListPresentation.setError(error)
      this.#presenter.orderListLoadingFailed(error)

      if (orderListPresentation.orderCount) this.#notifier.showNotification({type: 'error', message: error.message})
    }
  }

  #params
  #state
  #presenter
  #dataStore
  #notifier
}

/**
 * Entities OOP example
 */
class OrderListPresentation {
  constructor({loading = false, error = undefined, list = [], offset = 0, limit = 0, total = 0} = {}) {
    this.#orderListData = {loading, error, list, offset, limit, total}
  }

  get readOptions() {
    const {offset, limit} = this.#orderListData
    return this.#refresh ? {offset: 0, limit: offset} : {offset, limit}
  }

  get orderCount() {
    return this.#orderListData.list.length
  }

  get listing() {
    let updatedList = []

    for (const [orderData] of this.#orderListData.list) {
      const userData = this.#users.find(({id: userId}) => userId === orderData.user)
      const orderPresentation = new OrderPresentation(orderData, userData)
      updatedList.push(orderPresentation.order)
    }

    return {
      list: updatedList,
      offset: this.#orderListData.offset,
      limit: this.#orderListData.limit,
      total: this.#orderListData.total,
    }
  }

  get userIds() {
    const uniqueUserIds = new Set(this.#orderListData.list.map(({user}) => user))
    return Array.from(uniqueUserIds)
  }

  setUsers(users) {
    this.#users = users
  }

  setRefreshingMode(refresh) {
    this.#refresh = refresh
  }

  updateListing({list, total}) {
    this.#orderListData = {
      ...this.#orderListData,
      total,
      loading: false,
      offset: this.#refresh ? this.#orderListData.offset : this.#orderListData.offset + list.length,
      list: this.#refresh ? list : [...this.#orderListData.list, ...list],
    }

    this.#refresh = false
  }

  setError() {
    this.#refresh = false
  }

  #orderListData
  #refresh = false
  #users = []
}

class OrderPresentation {
  constructor({id, createdDate, user, sum, paymentStatus, fulfillmentStatus, updating = false} = {}, userData) {
    this.#orderData = {id, createdDate, user, sum, paymentStatus, fulfillmentStatus, updating}
    this.#userData = userData
  }

  get order() {
    return {
      ...this.#orderData,
      user: this.#userData.name,
    }
  }

  #orderData
  #userData
}

/**
 * Presenter
 */
class Presenter {
  constructor(viewModel) {
    this.#viewModel = viewModel
  }

  orderListLoadingStarted() {
    this.#viewModel.update((model) => ({...model, loading: true}))
  }

  orderListLoadingSucceeded({list, limit, offset, total}) {
    this.#viewModel.update((model) => ({
      ...model,
      list, total,
      pageCount: Math.ceil(total / limit),
      currentPage: offset ? Math.ceil(offset / limit) : 1,
    }))
  }

  orderListLoadingFailed({message, code}) {
    if (!this.#viewModel.get().list.length)
      this.#viewModel.update((model) => ({
        ...model,
        error: {message, code},
      }))

  }

  #viewModel
}

/**
 * Controller
 */
class Controller {
  constructor({state, presenter, dataStore, notifier}) {
    this.#state = state
    this.#presenter = presenter
    this.#dataStore = dataStore
    this.#notifier = notifier
  }

  updateOrderList(refresh) {
    const updateOrderList = new UpdateOrderList({
      params: {refresh},
      state: this.#state,
      presenter: this.#presenter,
      dataStore: this.#dataStore,
      notifier: this.#notifier,
    })

    this.#history.push(updateOrderList)
    updateOrderList.execute()
  }

  #state
  #presenter
  #dataStore
  #notifier
  #history = []
}
