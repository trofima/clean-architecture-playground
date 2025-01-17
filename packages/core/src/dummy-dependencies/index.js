import {Deferred} from '@borshch/utilities'
import {DataStoreError} from '../dependencies/index.js'

const dummyData = {
  orders: [{
    id: '1',
    createdDate: '2023-11-12T08:12:01.010Z',
    updatedDate: '2024-12-24T17:57:03.444Z',
    user: '1',
    sum: 0.5,
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'pending',
    shippingAddress: 'Ukraine, Sevastopol, Kvitucha St, 48',
  }, {
    id: '2',
    createdDate: '2024-07-10T11:55:20.390Z',
    updatedDate: '2024-10-30T23:48:15.555Z',
    user: '2',
    sum: 5.6,
    paymentStatus: 'paid',
    fulfillmentStatus: 'fulfilled',
    shippingAddress: 'Ukraine, Donetsk, Lisnyi blvd, 1',
  }, {
    id: '3',
    createdDate: '2023-11-12T08:12:01.010Z',
    updatedDate: '2024-12-24T17:57:03.444Z',
    user: '1',
    sum: 10,
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'pending',
    shippingAddress: 'Ukraine, Luhansk, Naberezhna Ave, 15',
  }, {
    id: '4',
    createdDate: '2024-12-12T07:12:01.010Z',
    updatedDate: '2024-12-24T30:57:03.444Z',
    user: '3',
    sum: 100.234,
    paymentStatus: 'paid',
    fulfillmentStatus: 'pending',
    shippingAddress: 'Ukraine, Sevastopol, Kvitucha St, 48',
  }, {
    id: '5',
    createdDate: '2024-12-12T07:12:01.010Z',
    updatedDate: '2024-12-24T30:57:03.444Z',
    user: '2',
    sum: 1100.234,
    paymentStatus: 'paid',
    fulfillmentStatus: 'pending',
    shippingAddress: 'Ukraine, Luhansk, Naberezhna Ave, 15',
  }, {
    id: '6',
    createdDate: '2023-11-12T08:12:01.010Z',
    updatedDate: '2024-12-24T17:57:03.444Z',
    user: '1',
    sum: 0.785,
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'fulfilled',
    shippingAddress: 'Ukraine, Sevastopol, Kvitucha St, 48',
  }, {
    id: '7',
    createdDate: '2024-07-10T11:55:20.390Z',
    updatedDate: '2024-10-30T23:48:15.555Z',
    user: '2',
    sum: 8.7,
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'fulfilled',
    shippingAddress: 'Ukraine, Donetsk, Lisnyi blvd, 1',
  }, {
    id: '8',
    createdDate: '2023-11-12T08:12:01.010Z',
    updatedDate: '2024-12-24T17:57:03.444Z',
    user: '1',
    sum: 1230,
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'pending',
    shippingAddress: 'Ukraine, Luhansk, Naberezhna Ave, 15',
  }, {
    id: '9',
    createdDate: '2024-12-12T07:12:01.010Z',
    updatedDate: '2024-12-24T30:57:03.444Z',
    user: '3',
    sum: 100.234,
    paymentStatus: 'paid',
    fulfillmentStatus: 'fulfilled',
    shippingAddress: 'Ukraine, Sevastopol, Kvitucha St, 48',
  }, {
    id: '10',
    createdDate: '2024-12-12T07:12:01.010Z',
    updatedDate: '2024-12-24T30:57:03.444Z',
    user: '2',
    sum: 2300.123,
    paymentStatus: 'paid',
    fulfillmentStatus: 'fulfilled',
    shippingAddress: 'Ukraine, Luhansk, Naberezhna Ave, 15',
  }, {
    id: '11',
    createdDate: '2023-11-12T08:12:01.010Z',
    updatedDate: '2024-12-24T17:57:03.444Z',
    user: '1',
    sum: 30.5,
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'pending',
    shippingAddress: 'Ukraine, Sevastopol, Kvitucha St, 48',
  }, {
    id: '12',
    createdDate: '2024-07-10T11:55:20.390Z',
    updatedDate: '2024-10-30T23:48:15.555Z',
    user: '2',
    sum: 50.6,
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'fulfilled',
    shippingAddress: 'Ukraine, Donetsk, Lisnyi blvd, 1',
  }, {
    id: '13',
    createdDate: '2023-11-12T08:12:01.010Z',
    updatedDate: '2024-12-24T17:57:03.444Z',
    user: '1',
    sum: 100,
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'pending',
    shippingAddress: 'Ukraine, Luhansk, Naberezhna Ave, 15',
  }],
  users: [
    {id: '1', name: 'Punjk Srenjk', billingAddress: 'Ukraine, Sevastopol, Kvitucha St, 48'},
    {id: '2', name: 'Chmykh Zhvykh', billingAddress: 'Ukraine, Donetsk, Lisnyi blvd, 1'},
    {id: '3', name: 'Chvjak Pjak', billingAddress: 'Ukraine, Luhansk, Naberezhna Ave, 15'},
  ],
}

class DataStore {
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

  remove(key, data) {
    return this.#entityToStore[key].remove(data)
  }

  #entityToStore = {
    orders: {
      get: async ({offset, limit}) => {
        const request = new Deferred()
        const orders = this.#get('orders')
        const orderSlice = orders.slice(offset, offset + limit)

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

      remove: async () => {
        throw new DataStoreError('Impossible to remove order list. This is nonsense')
      },
    },

    order: {
      get: ({id}) => {
        const request = new Deferred()
        const orders = this.#get('orders')
        const order = orders.find(({id: orderId}) => orderId === id)

        setTimeout(() => request.resolve(order), 2000)
        return request.promise
      },

      set: (order) => {
        this.#update('orders', order)
      },

      remove: async (id) => {
        const request = new Deferred()
        this.#remove('orders', id)
        setTimeout(() => request.resolve(), 1000)

        return request.promise
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

    user: {
      get: (id) => {
        const users = this.#get('users')
        const user = users.find(({id: orderId}) => orderId === id)
        return user
      },
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

  #remove(key, id) {
    const entities = this.#get(key)
    const updatedEntities = entities.filter((entity) => entity.id !== id)
    const updatedEntitiesString = JSON.stringify(updatedEntities)
    localStorage.setItem(key, updatedEntitiesString)
  }
}

class Notifier {
  async showNotification({type, message}) {
    window.alert(`${type}: ${message}`)
  }

  async confirm(message, {type}) {
    return window.confirm(message)
  }
}

export const dataStore = new DataStore()
export const notifier = new Notifier()
