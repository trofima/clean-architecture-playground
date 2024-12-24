import {assert} from 'chai'
import {AsyncFunctionSpy, Atom} from '@borshch/utilities'
import {RenderOrderList} from './render-order-list.js'

suite('Render order list', () => {
  test('present empty listing', async () => {
    const {renderOrderList, presentation, dataStore} = setup()
    dataStore.get.defer()

    const listing = renderOrderList()
    assert.deepEqual(presentation.get(), {listing: true, list: [], error: undefined})

    await dataStore.get.return(0, [])
    await listing
    assert.deepEqual(presentation.get(), {listing: false, list: [], error: undefined})
  })

  test('present error, when data getting failed', async () => {
    const {renderOrderList, presentation, dataStore} = setup()

    dataStore.get.fails(new DataStoreError('Oj vej', {code: '001'}))
    await renderOrderList()
    assert.deepInclude(presentation.get(), {
      listing: false,
      list: [],
      error: {
        message: 'Oj vej',
        code: '001',
      },
    })

    dataStore.get.fails(new DataStoreError('Oj vavoj', {code: '100'}))
    await renderOrderList()
    assert.deepInclude(presentation.get(), {
      listing: false,
      list: [],
      error: {
        message: 'Oj vavoj',
        code: '100',
      },
    })
  })

  test('request first page of orders from store', async () => {
    const {renderOrderList, dataStore} = setup()

    await renderOrderList()

    assert.deepEqual(dataStore.get.calls.at(0), ['orders', {offset: 0, limit: 20}])
  })

  test('present an order data', async () => {
    const {renderOrderList, presentation, dataStore} = setup()

    dataStore.get.for('orders', {offset: 0, limit: 20}).returns([{
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      updatedDate: '2024-12-24T17:57:03.444Z',
      user: 'userId',
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
    }])
    dataStore.get.for('users', ['userId']).returns([{id: 'userId', name: 'name'}])

    await renderOrderList()

    assert.deepEqual(presentation.get().list, [{
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      updatedDate: '2024-12-24T17:57:03.444Z',
      user: {id: 'userId', name: 'name'},
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
    }])
  })

  test('present another order data', async () => {
    const {renderOrderList, presentation, dataStore} = setup()

    dataStore.get.for('orders', {offset: 0, limit: 20}).returns([{
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      updatedDate: '2024-10-30T24:48:15.555Z',
      user: 'anotherUserId',
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    }])
    dataStore.get.for('users', ['anotherUserId']).returns([{id: 'anotherUserId', name: 'another name'}])

    await renderOrderList()

    assert.deepEqual(presentation.get().list, [{
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      updatedDate: '2024-10-30T24:48:15.555Z',
      user: {id: 'anotherUserId', name: 'another name'},
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    }])
  })

  test('present all orders data', async () => {
    const {renderOrderList, presentation, dataStore} = setup()

    dataStore.get.for('orders', {offset: 0, limit: 20}).returns([{
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      updatedDate: '2024-12-24T17:57:03.444Z',
      user: 'userId',
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
    }, {
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      updatedDate: '2024-10-30T24:48:15.555Z',
      user: 'anotherUserId',
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    }])
    dataStore.get
      .for('users', ['userId', 'anotherUserId'])
      .returns([{id: 'userId', name: 'name'}, {id: 'anotherUserId', name: 'another name'}])

    await renderOrderList()

    assert.deepEqual(presentation.get().list, [{
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      updatedDate: '2024-12-24T17:57:03.444Z',
      user: {id: 'userId', name: 'name'},
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
    }, {
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      updatedDate: '2024-10-30T24:48:15.555Z',
      user: {id: 'anotherUserId', name: 'another name'},
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    }])
  })

  test('present orders of the same user', async () => {
    const {renderOrderList, presentation, dataStore} = setup()

    dataStore.get.for('orders', {offset: 0, limit: 20}).returns([{
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      updatedDate: '2024-12-24T17:57:03.444Z',
      user: 'userId',
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
    }, {
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      updatedDate: '2024-10-30T24:48:15.555Z',
      user: 'userId',
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    }])
    dataStore.get.for('users', ['userId']).returns([{id: 'userId', name: 'name'}])

    await renderOrderList()

    assert.deepEqual(presentation.get().list.at(0).user, {id: 'userId', name: 'name'})
    assert.deepEqual(presentation.get().list.at(1).user, {id: 'userId', name: 'name'})
    assert.deepEqual(dataStore.get.lastCall, ['users', ['userId']])
    assert.deepEqual(dataStore.get.callCount, 2)
  })
})

const setup = () => {
  const presentation = Atom.of({})
  const dataStore = new DataStoreMock()
  return {
    presentation, dataStore,
    renderOrderList: RenderOrderList({presentation, dataStore})
  }
}

class DataStoreMock {
  get = new AsyncFunctionSpy()
}

class DataStoreError extends Error {
  constructor(message, {code, cause}) {
    super(message, {cause})
    this.code = code
  }
}
