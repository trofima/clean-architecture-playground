import {CommonScreen} from '../common/common-screen';
import {InMemoryDataStore} from '../dependencies/data-store';
import {OrderListView} from './view';
import {OpenOrder, RenderOrderList, RemoveOrderFromList, UpdateOrderList} from '@clean-architecture-playground/core'

const dataStore = new InMemoryDataStore() //TODO: put to context or make it singleton
const notifier = {showNotification: ({message}) => alert(message)}

export class OrderList extends CommonScreen {
  static getOptions() {
    return {
      title: 'Orders'
    }
  }
  
  View = OrderListView
  controller = {
    initialize: () => this.#useCases.renderOrderList(),
    refresh: () => this.#useCases.updateOrderList({refresh: true}),
    loadMore: () => this.#useCases.updateOrderList(),
    remove: (id) => this.#useCases.removeOrderFromList(id),
    openOrder: (id) => this.#useCases.openOrder(id),
  }

  #updateOrderList = UpdateOrderList({
    dataStore, notifier,
    presentation: this.presentation,
  })

  #useCases = {
    updateOrderList: this.#updateOrderList,
    renderOrderList: RenderOrderList({
      presentation: this.presentation, 
      updateOrderList: this.#updateOrderList,
    }),
    removeOrderFromList: RemoveOrderFromList({
      dataStore, notifier,
      presentation: this.presentation,
    }),
    openOrder: OpenOrder({
      notifier,
      presentation: this.presentation,
      navigator: this.props.navigator,
    })
  }
}