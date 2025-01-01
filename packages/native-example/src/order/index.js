import {Atom} from '@borshch/utilities'
import {dataStore} from '@clean-architecture-playground/core/dummy-dependencies'
import {presentOrder, RenderOrder} from '@clean-architecture-playground/core'
import {renderOrderLoadingErrorView, renderOrderLoadingView, renderOrderView} from './view.js'

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
    dataStore,
    presentation: this.#presentation,
  })

  #renderHtml = (presentationModel) => {
    const {loading, error} = presentationModel
    this.shadowRoot.innerHTML = loading
      ? renderOrderLoadingView()
      : error
        ? renderOrderLoadingErrorView(error)
        : renderOrderView(presentOrder(presentationModel).order)
  }
}

customElements.define('app-order', Order)

export default Order
