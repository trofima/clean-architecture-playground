import {Atom} from '@borshch/utilities'
import {OpenOrder, RenderOrderList, RemoveOrderFromList, UpdateOrderList} from '@clean-architecture-playground/core'
import {renderEmptyOrderItem, renderErrorView, renderOrderItem, renderOrderListView} from './view.js'
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../dependencies/navigator.js'
import {presentOrderList} from './presenter.js'

export class OrderList extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = renderOrderListView()
    this.#bind('#load-more', 'click', () => this.#controller.updateOrderList())
    this.#bind('#refresh', 'click', () => this.#controller.updateOrderList({refresh: true}))
    this.#presentation.subscribe(this.#renderHtml)
    this.#controller.renderOrderList()
  }

  disconnectedCallback() {
    this.#presentation.unsubscribe(this.#renderHtml)
  }

  #presentation = new Atom()

  #updateOrderList = UpdateOrderList({
    dataStore, notifier,
    presentation: this.#presentation,
  })

  #controller = {
    renderOrderList: RenderOrderList({
      presentation: this.#presentation,
      updateOrderList: this.#updateOrderList,
    }),
    updateOrderList: this.#updateOrderList,
    removeOrderFromList: RemoveOrderFromList({
      dataStore, notifier,
      presentation: this.#presentation,
    }),
    openOrder: OpenOrder({
      notifier,
      navigator: appNavigator,
      presentation: this.#presentation,
    }),
  }

  #renderHtml = (presentationModel) => {
    const viewModel = presentOrderList(presentationModel)
    const firstLoading = viewModel.loading && !viewModel.list.length
    const listContent = viewModel.error
      ? renderErrorView(viewModel.error)
      : this.#getOrderList(firstLoading, viewModel.list).map(renderOrderItem).join('')

    this.#setContent('#total-count', viewModel.total)
    this.#setContent('#list', listContent)
    this.#updateLoadMoreButton(presentationModel)

    if (!firstLoading) {
      this.#bindAll('click', '.order-item', ({currentTarget}) =>
        this.#controller.openOrder(currentTarget.dataset.orderId))

      this.#bindAll('click', '.order-item > .delete-button > button', (event) => {
        event.stopPropagation()
        this.#controller.removeOrderFromList(event.currentTarget.dataset.orderId)
      })
    }
  }

  #getOrderList = (firstLoading, list) => firstLoading
    ? Array(3).fill(renderEmptyOrderItem())
    : list

  #updateLoadMoreButton = (presentationModel) => {
    const loadMoreButton = this.shadowRoot.querySelector('#load-more')
    const hasMoreToLoad = presentationModel.total > presentationModel.list.length
    loadMoreButton.style.setProperty('display', hasMoreToLoad ? 'block' : 'none')
    loadMoreButton.innerText = presentationModel.loading ? '...' : 'Load more'
    if (presentationModel.loading) loadMoreButton.setAttribute('disabled', '')
    else loadMoreButton.removeAttribute('disabled')
  }

  #bind(selector, event, handler) {
    this.shadowRoot.querySelector(selector).addEventListener(event, handler)
  }

  #bindAll(event, selector, handler) {
    this.shadowRoot.querySelectorAll(selector)
      .forEach(element => element.addEventListener(event, handler))
  }

  #setContent(selector, content) {
    this.shadowRoot.querySelector(selector).innerHTML = content
  }
}

customElements.define('app-order-list', OrderList)

export default OrderList
