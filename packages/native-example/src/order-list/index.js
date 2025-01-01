import {Atom} from '@borshch/utilities'
import {RenderOrderList, UpdateOrderList, presentOrderList} from '@clean-architecture-playground/core'
import {renderEmptyOrderItem, renderErrorView, renderOrderItem, renderOrderListView} from './view.js'
import {DataStore, Notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../dependencies/index.js'

export class OrderList extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = renderOrderListView()
    this.#presentation.subscribe(this.#renderHtml)
    this.#renderOrderList()
  }

  disconnectedCallback() {
    this.#presentation.unsubscribe(this.#renderHtml)
  }

  #presentation = Atom.of({})

  #renderOrderList = RenderOrderList({
    presentation: this.#presentation,
    updateOrderList: UpdateOrderList({
      presentation: this.#presentation,
      dataStore: new DataStore(),
      notifier: new Notifier(),
    }),
  })

  #renderHtml = (presentationModel) => {
    const viewModel = presentOrderList(presentationModel)
    const {shadowRoot} = this
    shadowRoot.querySelector('#total-count').innerHTML = viewModel.total
    shadowRoot.querySelector('#list').innerHTML = viewModel.error
      ? renderErrorView(viewModel.error)
      : this.#getOrderList(viewModel).map(renderOrderItem).join('')

    shadowRoot.querySelectorAll('.order-item').forEach(element =>
      element.addEventListener('click', ({currentTarget}) =>
        appNavigator.open(`/order?id=${currentTarget.dataset.orderId}`)))
  }

  #getOrderList = ({loading, list}) => loading && !list.length
    ? Array(3).fill(renderEmptyOrderItem())
    : list
}

customElements.define('app-order-list', OrderList)

export default OrderList
