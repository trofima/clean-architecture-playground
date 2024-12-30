import {Atom} from '@borshch/utilities'
import {RenderOrderList, presentOrderList} from '@clean-architecture-playground/core'
import {renderOrderListView} from './view.js'
import {DataStore} from '@clean-architecture-playground/core/dummy-dependencies'

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
