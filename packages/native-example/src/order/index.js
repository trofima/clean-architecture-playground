import {Atom} from '@borshch/utilities'
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {ChangeOrderField, CloseOrder, presentOrder, RenderOrder, SaveOrder} from '@clean-architecture-playground/core'
import {renderOrderDataView, renderOrderLoadingErrorView, renderOrderLoadingView, renderOrderView} from './view.js'
import {appNavigator} from '../dependencies/index.js'

export class Order extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = renderOrderView()
    this.#bind('#back', 'click', () => this.#controller.closeOrder())
    this.#bind('#save', 'click', () => this.#controller.saveOrder())
    this.#presentation.subscribe(this.#renderHtml)
    this.#controller.renderOrder(this.getAttribute('id'))
  }

  disconnectedCallback() {
    this.#presentation.unsubscribe(this.#renderHtml)
  }

  #presentation = new Atom()

  #controller = {
    renderOrder: RenderOrder({
      dataStore,
      presentation: this.#presentation,
    }),
    closeOrder: CloseOrder({
      notifier,
      navigator: appNavigator,
      presentation: this.#presentation,
    }),
    saveOrder: SaveOrder({
      dataStore, notifier,
      navigator: appNavigator,
      presentation: this.#presentation,
    }),
    changeOrderField: ChangeOrderField({
      presentation: this.#presentation,
    }),
  }

  #isRenderingDataForTheFirstTime = true

  get #dataContainer() {
    return this.shadowRoot.querySelector('#order-data')
  }

  get #backButton() {
    return this.shadowRoot.querySelector('#back')
  }

  get #saveButton() {
    return this.shadowRoot.querySelector('#save')
  }

  #renderHtml = (presentationModel) => {
    const {loading, error, data} = presentationModel
    const isEmpty = Object.keys(data).length === 0

    if (loading) this.#backButton.setAttribute('disabled', '')
    else this.#backButton.removeAttribute('disabled')

    if (isEmpty) {
      if (loading) this.#dataContainer.innerHTML = renderOrderLoadingView()
      else if (error) this.#dataContainer.innerHTML = renderOrderLoadingErrorView(error)
    } else this.#renderOrderDataView(presentationModel)
  }

  #renderOrderDataView(presentationModel) {
    const viewModel = presentOrder(presentationModel)

    if (this.#isRenderingDataForTheFirstTime) {
      this.#dataContainer.innerHTML = renderOrderDataView(viewModel)
      this.#bindAll('input', '[editable]', ({currentTarget}) =>
        this.#controller.changeOrderField(currentTarget.dataset.bindTo, currentTarget.value))
      this.#isRenderingDataForTheFirstTime = false
    }

    if (viewModel.hasChanges) this.#saveButton.removeAttribute('disabled')
    else this.#saveButton.setAttribute('disabled', '')
  }

  #bind(selector, event, handler) {
    this.shadowRoot.querySelector(selector).addEventListener(event, handler)
  }

  #bindAll(event, selector, handler) {
    this.shadowRoot.querySelectorAll(selector)
      .forEach(element => element.addEventListener(event, handler))
  }
}

customElements.define('app-order', Order)

export default Order
