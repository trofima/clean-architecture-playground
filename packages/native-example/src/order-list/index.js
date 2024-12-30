import {BorshchComponent} from '@borshch/components'
import {Atom} from '@borshch/utilities'
import {RenderOrderList} from '@clean-architecture-playground/core'
import {renderOrderListView} from './view.js'
import {presentOrderList} from '../../../core/src/order-list/presenter.js'
import {DataStore} from '../../../core/src/dummy-dependencies/index.js'

export class OrderList extends BorshchComponent {
  render() {
    return renderOrderListView(this.#presentation.get())
  }

  onConnected() {
    super.onConnected()
    // TODO: think of a more cool way to rerender
    this.#presentation.subscribe((model) => this.host.innerHTML = renderOrderListView(presentOrderList(model)))
    this.#renderOrderList()
  }

  #presentation = Atom.of({list: []})

  #renderOrderList = RenderOrderList({
    presentation: this.#presentation,
    dataStore: new DataStore(),
  })
}

export default OrderList.define()
