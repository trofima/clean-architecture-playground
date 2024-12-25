import {assert} from 'chai'
import {AsyncFunctionSpy, Atom} from '@borshch/utilities'
import {RenderOrderList} from './render-order-list.js'
import {OrderData} from '../../dependencies/data-store/order-data.js'
import {OrderListData} from '../../dependencies/data-store/order-list-data.js'
import {DataStoreError} from '../../dependencies/data-store/index.js'

suite('Render order list', () => {
  test('present empty list', async () => {
    const {renderOrderList, presentation, dataStore} = setup()
    dataStore.get.defer()

    const listing = renderOrderList()
    assert.deepEqual(presentation.get(), {loading: true, list: [], error: undefined, offset: 0, limit: 20, total: 0})
    assert.deepEqual(dataStore.get.lastCall, ['orders', {offset: 0, limit: 20}])

    await dataStore.get.resolve(0, OrderListData.make({list: [], offset: 0, limit: 20, total: 0}))
    await listing
    assert.deepEqual(presentation.get(), {loading: false, list: [], error: undefined, offset: 0, limit: 20, total: 0})
  })

  test('present error, when data getting failed', async () => {
    const {renderOrderList, presentation, dataStore} = setup()

    dataStore.get.fails(new DataStoreError('Oj vej', {code: '001'}))
    await renderOrderList()
    assert.deepInclude(presentation.get(), {
      loading: false,
      list: [],
      error: {
        message: 'Oj vej',
        code: '001',
      },
    })

    dataStore.get.fails(new DataStoreError('Oj vavoj', {code: '100'}))
    await renderOrderList()
    assert.deepInclude(presentation.get(), {
      loading: false,
      list: [],
      error: {
        message: 'Oj vavoj',
        code: '100',
      },
    })
  })

  test('update an order list meta data', async () => {
    const {renderOrderList, presentation, dataStore} = setup()
    dataStore.get.returns([])
    dataStore.get
      .for('orders', {offset: 0, limit: 20})
      .returns(OrderListData.make({list: [makeDummyOrders(1)], offset: 1, total: 1}))

    await renderOrderList()

    assert.deepInclude(presentation.get(), {offset: 1, total: 1})
  })

  test('update another order list meta data', async () => {
    const {renderOrderList, presentation, dataStore} = setup()
    dataStore.get.returns([])
    dataStore.get
      .for('orders', {offset: 0, limit: 20})
      .returns(OrderListData.make({list: [makeDummyOrders(21)], offset: 20, total: 21}))

    await renderOrderList()

    assert.deepInclude(presentation.get(), {offset: 20, total: 21})
  })

  test('present an order data', async () => {
    const {renderOrderList, presentation, dataStore} = setup()

    dataStore.get.for('orders', {offset: 0, limit: 20}).returns(OrderListData.make({
      list: [OrderData.make({
        id: 'id',
        createdDate: '2023-11-12T08:12:01.010Z',
        updatedDate: '2024-12-24T17:57:03.444Z',
        user: 'userId',
        sum: 0.5,
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'pending',
      })]
    }))
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

    dataStore.get.for('orders', {offset: 0, limit: 20}).returns(OrderListData.make({
      list: [OrderData.make({
        id: 'anotherId',
        createdDate: '2024-07-10T11:85:20.390Z',
        updatedDate: '2024-10-30T24:48:15.555Z',
        user: 'anotherUserId',
        sum: 5.6,
        paymentStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
      })]
    }))
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

    dataStore.get.for('orders', {offset: 0, limit: 20}).returns(OrderListData.make({
      list: [OrderData.make({
        id: 'id',
        createdDate: '2023-11-12T08:12:01.010Z',
        updatedDate: '2024-12-24T17:57:03.444Z',
        user: 'userId',
        sum: 0.5,
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'pending',
      }), OrderData.make({
        id: 'anotherId',
        createdDate: '2024-07-10T11:85:20.390Z',
        updatedDate: '2024-10-30T24:48:15.555Z',
        user: 'anotherUserId',
        sum: 5.6,
        paymentStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
      })]
    }))
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

    dataStore.get
      .for('orders', {offset: 0, limit: 20})
      .returns(OrderListData.make({
        list: [OrderData.make({user: 'userId'}), OrderData.make({user: 'userId'})]
      }))
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

const makeDummyOrders = (count) => Array(count).fill(undefined).map(OrderData.make)
