import {Atom} from '@borshch/utilities'
import {RenderOrderList} from '@clean-architecture-playground/core'
import {renderOrderListView} from './view.js'
import {presentOrderList} from '../../../core/src/order-list/presenter.js'
import {DataStore} from '../../../core/src/dummy-dependencies/index.js'

export class OrderList extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'})
    this.#presentation.subscribe((model) => this.#renderHtml(model))
    this.#renderOrderList()
  }

  #presentation = Atom.of({list: []})

  #renderOrderList = RenderOrderList({
    presentation: this.#presentation,
    dataStore: new DataStore(),
  })

  #renderHtml(presentation) {
    this.shadowRoot.innerHTML = renderOrderListView(presentOrderList(presentation))
  }
}

customElements.define('order-list', OrderList)

export default OrderList
