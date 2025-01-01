import {Atom} from '@borshch/utilities'
import {DataStore} from '@clean-architecture-playground/core/dummy-dependencies'
import {RenderOrder} from '@clean-architecture-playground/core'

export class Order extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'})
    this.#presentation.subscribe(this.#renderHtml)
    this.#renderOrder(this.getAttribute('id'))
  }

  disconnectedCallback() {
    this.#presentation.unsubscribe(this.#renderHtml)
  }

  #presentation = Atom.of({})

  #renderOrder = RenderOrder({
    presentation: this.#presentation,
    dataStore: new DataStore(),
  })

  #renderHtml = (presentationModel) => {
    this.shadowRoot.innerHTML = `<div>Order page, ${presentationModel.order?.id}</div>`
  }
}

customElements.define('app-order', Order)

export default Order
