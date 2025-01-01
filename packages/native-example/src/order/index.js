import {Atom} from '@borshch/utilities'

export class Order extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'})
    this.#presentation.subscribe(this.#renderHtml)
    this.#renderOrder()
  }

  disconnectedCallback() {
    this.#presentation.unsubscribe(this.#renderHtml)
  }

  #presentation = Atom.of({})

  #renderOrder = () => {console.log('Use case is not implemented yet')}

  #renderHtml = (presentationModel) => {
    // const viewModel = presentOrderList(presentationModel)
    // this.shadowRoot.innerHTML = renderOrderListView(viewModel)
  }
}

customElements.define('app-order', Order)

export default Order
