import {ChangeOrderField, CloseOrder, RenderOrder, SaveOrder, UpdateOrderInList} from '@clean-architecture-playground/core'
import {CommonScreen} from '../common/common-screen'
import {OrderView, OrderSaveButton} from './view'
import {SaveOrderAndUpdateList} from './use-cases/save-order-and-update-list'

export class Order extends CommonScreen {
  static getOptions({route: {params: {queryParams: {id}}}}, presentation, controller) {
    return {
      title: `Order ${id}`,
      headerRight: OrderSaveButton(presentation, controller),
    }
  }

  View = OrderView

  controller = {
    initialize: () => this.#useCases.renderOrder(this.props.route.params.queryParams.id),
    change: (name, value) => this.#useCases.changeOrderField(name, value),
    save:() => this.#useCases.saveOrderAndUpdateList(),
    close: () => this.#useCases.closeOrder(),
  }

  componentDidMount() {
    super.componentDidMount()
    this.props.navigator.onClose(this.controller.close)
  }

  componentDidUpdate() {
    this.props.navigator.setOptions({headerRight: OrderSaveButton(this.presentation.get(), this.controller)})
  }

   #useCases = {
    renderOrder: RenderOrder({
      presentation: this.presentation, 
      dataStore: this.context.dataStore,
    }),
    changeOrderField: ChangeOrderField({
      presentation: this.presentation,
    }),
    saveOrderAndUpdateList: SaveOrderAndUpdateList({
      presentation: this.presentation,
      updateOrderInList: UpdateOrderInList({presentation: this.props.route.params.context.orderList}),
      saveOrder: SaveOrder({
        presentation: this.presentation,
        dataStore: this.context.dataStore,
        navigator: this.props.navigator,
        notifier: this.context.notifier,
      }),
    }),
    closeOrder: CloseOrder({
      presentation: this.presentation,
      navigator: this.props.navigator,
      notifier: this.context.notifier,
    })
  }
}