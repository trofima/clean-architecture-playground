import {CommonScreen} from '../common/common-screen';
import {InMemoryDataStore} from '../dependencies/data-store';
import {OrderListView} from './view';
import {OpenOrder, RenderOrderList, RemoveOrderFromList, UpdateOrderList} from '@clean-architecture-playground/core'

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
    presentation: this.presentation,
    dataStore: this.context.dataStore,
    notifier: this.context.notifier,
  })

  #useCases = {
    updateOrderList: this.#updateOrderList,
    renderOrderList: RenderOrderList({
      presentation: this.presentation, 
      updateOrderList: this.#updateOrderList,
    }),
    removeOrderFromList: RemoveOrderFromList({
      presentation: this.presentation,
      dataStore: this.context.dataStore,
      notifier: this.context.notifier,
    }),
    openOrder: OpenOrder({
      presentation: this.presentation,
      notifier: this.context.notifier,
      navigator: this.props.navigator,
    })
  }
}
