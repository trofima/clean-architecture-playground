import {Atom} from '@borshch/utilities'
import {RenderOrderList, UpdateOrderList, presentOrderList} from '@clean-architecture-playground/core'
import {renderEmptyOrderItem, renderErrorView, renderOrderItem, renderOrderListView} from './view.js'
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../dependencies/index.js'

export class OrderList extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = renderOrderListView()
    this.#loadMoreButton.addEventListener('click', () => this.#updateOrderList())
    this.#presentation.subscribe(this.#renderHtml)
    this.#controller.renderOrderList()
  }

  disconnectedCallback() {
    this.#presentation.unsubscribe(this.#renderHtml)
  }

  #presentation = Atom.of({})

  #updateOrderList = UpdateOrderList({
    dataStore,
    notifier,
    presentation: this.#presentation,
  })

  #controller = {
    renderOrderList: RenderOrderList({
      presentation: this.#presentation,
      updateOrderList: this.#updateOrderList,
    }),
    updateOrderList: this.#updateOrderList,
  }

  #renderHtml = (presentationModel) => {
    const viewModel = presentOrderList(presentationModel)
    const {shadowRoot} = this
    shadowRoot.querySelector('#total-count').innerHTML = viewModel.total
    shadowRoot.querySelector('#list').innerHTML = viewModel.error
      ? renderErrorView(viewModel.error)
      : this.#getOrderList(viewModel).map(renderOrderItem).join('')
    this.#updateLoadMoreButton(presentationModel)

    shadowRoot.querySelectorAll('.order-item').forEach(element =>
      element.addEventListener('click', ({currentTarget}) =>
        appNavigator.open(`/order?id=${currentTarget.dataset.orderId}`)))
  }

  get #loadMoreButton() {
    return this.shadowRoot.querySelector('#load-more')
  }

  #getOrderList = ({loading, list}) => loading && !list.length
    ? Array(3).fill(renderEmptyOrderItem())
    : list

  #updateLoadMoreButton = (presentationModel) => {
    const hasMoreToLoad = presentationModel.total > presentationModel.list.length
    this.#loadMoreButton.style
      .setProperty('display', hasMoreToLoad ? 'block' : 'none')
    this.#loadMoreButton.innerText = presentationModel.loading ? '...' : 'Load more'
    if (presentationModel.loading) this.#loadMoreButton.setAttribute('disabled', '')
    else this.#loadMoreButton.removeAttribute('disabled')
  }
}

customElements.define('app-order-list', OrderList)

export default OrderList
