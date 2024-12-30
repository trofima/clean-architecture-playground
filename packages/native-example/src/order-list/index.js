import {BorshchComponent} from '@borshch/components'
import {Atom, Deferred} from '@borshch/utilities'
import {RenderOrderList} from '@clean-architecture-playground/core'
import {renderOrderListView} from './view.js'
import {presentOrderList} from '../../../core/src/order-list/presenter.js'

class DataStore { // TODO: move out
  async get(entity, options) {
    return await this.#entityToStore[entity](options)
  }

  #entityToStore = {
    orders: async () => {
      const waiting = new Deferred()
      setTimeout(() => {
        waiting.resolve({ // TODO: move dummy data to core or other place from which it can be shared
          list: [{
            id: '1',
            createdDate: '2023-11-12T08:12:01.010Z',
            updatedDate: '2024-12-24T17:57:03.444Z',
            user: '1',
            sum: 0.5,
            paymentStatus: 'unpaid',
            fulfillmentStatus: 'pending',
          }, {
            id: '2',
            createdDate: '2024-07-10T11:85:20.390Z',
            updatedDate: '2024-10-30T24:48:15.555Z',
            user: '2',
            sum: 5.6,
            paymentStatus: 'paid',
            fulfillmentStatus: 'fulfilled',
          }, {
            id: '3',
            createdDate: '2023-11-12T08:12:01.010Z',
            updatedDate: '2024-12-24T17:57:03.444Z',
            user: '1',
            sum: 10,
            paymentStatus: 'unpaid',
            fulfillmentStatus: 'pending',
          }],
          offset: 3,
          total: 3,
        })
      }, 1000)
      return waiting.promise
    },

    users: async (ids) => {
      const data = [
        {id: '1', name: 'Punjk Srenjk'},
        {id: '2', name: 'Chmykh Zhvykh'},
      ]
      return ids ? data.filter(({id}) => ids.includes(id)) : data
    },
  }
}
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
