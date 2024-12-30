import {Deferred} from '@borshch/utilities'
import {DataStoreError} from '../dependencies/index.js'

export class DataStore {
  constructor() {
    for (const [key, data] of Object.entries(dummyData))
      localStorage.setItem(key, JSON.stringify(data))
  }

  get(key, options) {
    return this.#entityToStore[key].get(options)
  }

  set(key, data) {
    return this.#entityToStore[key].set(data)
  }

  #entityToStore = {
    orders: {
      get: async ({offset, limit}) => {
        const request = new Deferred()
        const orders = this.#get('orders')
        const orderSlice = orders.slice(offset, limit)

        const orderList = {
          total: orders.length,
          list: orderSlice,
        }

        setTimeout(() => request.resolve(orderList), 1000)
        return request.promise
      },

      set: async () => {
        throw new DataStoreError('Impossible to set order list. This is nonsense')
      },
    },

    order: {
      get: ({id}) => {
        const orders = this.#get('orders')
        const order = orders.find(({id: orderId}) => orderId === id)
        return order
      },

      set: (order) => {
        this.#update('orders', order)
      },
    },

    users: {
      get: async (ids) => {
        const users = this.#get('users')
        return ids ? users.filter(({id}) => ids.includes(id)) : users
      },

      set: async () => {
        throw new DataStoreError('Impossible to set user list. This is nonsense')
      }
    },
  }

  #get(key) {
    const dataString = localStorage.getItem(key)
    const data = JSON.parse(dataString)
    return data
  }

  #update(key, updatedEntity) {
    const entities = this.#get(key)
    const updatedEntities = updatedEntity.id
      ? entities.map((entity) => entity.id === updatedEntity.id ? updatedEntity : entity)
      : [...entities, {...updatedEntity, id: (Number(entities.id) + 1).toString()}]
    const updatedEntitiesString = JSON.stringify(updatedEntities)
    localStorage.setItem(key, updatedEntitiesString)
  }
}

const dummyData = {
  orders: [{
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
  }, {
    id: '4',
    createdDate: '2024-12-12T07:12:01.010Z',
    updatedDate: '2024-12-24T30:57:03.444Z',
    user: '3',
    sum: 100.234,
    paymentStatus: 'paid',
    fulfillmentStatus: 'pending',
  }
],
  users: [
    {id: '1', name: 'Punjk Srenjk'},
    {id: '2', name: 'Chmykh Zhvykh'},
    {id: '3', name: 'Chvjak Pjak'},
  ],
}
