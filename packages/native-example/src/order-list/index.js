import {Atom} from '@borshch/utilities'
import {RenderOrderList, UpdateOrderList, presentOrderList} from '@clean-architecture-playground/core'
import {renderOrderListView} from './view.js'
import {DataStore, Notifier} from '@clean-architecture-playground/core/dummy-dependencies'

export class OrderList extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'})
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
    this.shadowRoot.innerHTML = renderOrderListView(viewModel)
  }
}

customElements.define('order-list', OrderList)

export default OrderList
