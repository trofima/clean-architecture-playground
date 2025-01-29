import {DataStoreError} from '../dependencies/index.js'

export const dummyData = {
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

export class DataStore {
  get(key, options) {
    return this.#entityToStore[key].get(options)
  }

  set(key, data) {
    return this.#entityToStore[key].set(data)
  }

  remove(key, data) {
    return this.#entityToStore[key].remove(data)
  }

  getFromStorage(_key) {
    throw new Error('DataStore: derived class have to implement this method')
  }

  setToStorage(_key, _entities) {
    throw new Error('DataStore: derived class have to implement this method')
  }

  #entityToStore = {
    orders: {
      get: ({offset, limit}) => new Promise((resolve) => {
        const orders = this.getFromStorage('orders')
        const orderSlice = orders.slice(offset, offset + limit)
        const orderList = {
          total: orders.length,
          list: orderSlice,
        }
        setTimeout(() => resolve(orderList), 1000)
      }),

      set: async () => {
        throw new DataStoreError('Impossible to set order list. This is nonsense')
      },

      remove: async () => {
        throw new DataStoreError('Impossible to remove order list. This is nonsense')
      },
    },

    order: {
      get: ({id}) => new Promise((resolve) => {
        const orders = this.getFromStorage('orders')
        const order = orders.find(({id: orderId}) => orderId === id)
        setTimeout(() => resolve(order), 1000)
      }),

      set: (order) => new Promise((resolve) => {
        this.#update('orders', order)
        setTimeout(() => resolve(order), 1000)
      }),

      remove: (id) => new Promise((resolve) => {
        this.#remove('orders', id)
        setTimeout(() => resolve(id), 1000)
      }),
    },

    users: {
      get: (ids) => new Promise((resolve) => {
        const users = this.getFromStorage('users')
        setTimeout(() => resolve(ids ? users.filter(({id}) => ids.includes(id)) : users), 100)
      }),

      set: async () => {
        throw new DataStoreError('Impossible to set user list. This is nonsense')
      },
    },

    user: {
      get: (id) => new Promise((resolve) => {
        const users = this.getFromStorage('users')
        const user = users.find(({id: orderId}) => orderId === id)
        setTimeout(() => resolve(user), 100)
      }),
    },
  }

  #update(key, updatedEntity) {
    const entities = this.getFromStorage(key)
    const updatedEntities = updatedEntity.id
      ? entities.map((entity) => entity.id === updatedEntity.id ? updatedEntity : entity)
      : [...entities, {...updatedEntity, id: (Number(entities.at(-1).id) + 1).toString()}]
    this.setToStorage(key, updatedEntities)
  }

  #remove(key, id) {
    const entities = this.getFromStorage(key)
    const updatedEntities = entities.filter((entity) => entity.id !== id)
    this.setToStorage(key, updatedEntities)
  }
}

export class InMemoryDataStore extends DataStore {
  getFromStorage(key) {
    return this.#data[key]
  }

  setToStorage(key, entities) {
    this.#data[key] = entities
  }

  #data = {...dummyData}
}

export class Notifier {
  async showNotification({type, message}) {
    window.alert(`${type}: ${message}`)
  }

  async confirm(message, {type: _}) {
    return window.confirm(message)
  }
}

export const dataStore = new InMemoryDataStore()
export const notifier = new Notifier()
