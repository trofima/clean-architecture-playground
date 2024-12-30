import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {UpdateOrderList} from './update-order-list.js'
import {DataStoreError} from '../../dependencies/index.js'
import {DataStoreMock, NotifierMock, OrderListData} from '../../dependencies/test-utilities.js'
import {OrderList} from '../entities/order-list.js'
import {Order} from '../entities/order.js'

suite('update order list', () => {
  test('present empty list', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    dataStore.get.defer()
    presentation.update(() => OrderList.make({offset: 0, limit: 20}))

    const listing = updateOrderList()
    assert.deepEqual(dataStore.get.lastCall, ['orders', {offset: 0, limit: 20}])

    await dataStore.get.resolve(0, OrderListData.make({list: [], total: 0}))
    await listing
    assert.deepEqual(presentation.get(), {loading: false, list: [], error: undefined, offset: 0, limit: 20, total: 0})
  })

  test('present error, when data getting failed and list is empty', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderList.make())

    dataStore.get.fails(new DataStoreError('Oj vej', {code: '001'}))
    await updateOrderList()
    assert.deepInclude(presentation.get(), {
      loading: false,
      error: {
        message: 'Oj vej',
        code: '001',
      },
    })

    dataStore.get.fails(new DataStoreError('Oj vavoj', {code: '100'}))
    await updateOrderList()
    assert.deepInclude(presentation.get(), {
      loading: false,
      error: {
        message: 'Oj vavoj',
        code: '100',
      },
    })
  })

  test('show error notification, when data getting failed and list is not empty', async () => {
    const {updateOrderList, presentation, dataStore, notifier} = setup()
    presentation.update(() => OrderList.make({list: [Order.make()]}))

    dataStore.get.fails(new DataStoreError('Oj vej', {code: '001'}))
    await updateOrderList()
    assert.deepEqual(notifier.showNotification.lastCall, [{type: 'error', message: 'Oj vej'}])
    assert.deepInclude(presentation.get(), {loading: false, error: undefined})

    dataStore.get.fails(new DataStoreError('Oj vavoj', {code: '100'}))
    await updateOrderList()
    assert.deepEqual(notifier.showNotification.lastCall, [{type: 'error', message: 'Oj vavoj'}])
    assert.deepInclude(presentation.get(), {loading: false, error: undefined})
  })

  test('update an order list meta data', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderList.make({offset: 0, limit: 1}))
    dataStore.get.returns([])
    dataStore.get
      .for('orders', {offset: 0, limit: 1})
      .returns(OrderListData.make({list: OrderListData.makeDummyOrders(1), total: 1}))

    await updateOrderList()

    assert.deepInclude(presentation.get(), {offset: 1, total: 1})
  })

  test('update another order list meta data', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderList.make({offset: 1, limit: 2}))
    dataStore.get.returns([])
    dataStore.get
      .for('orders', {offset: 1, limit: 2})
      .returns(OrderListData.make({list: OrderListData.makeDummyOrders(2), total: 3}))

    await updateOrderList()

    assert.deepInclude(presentation.get(), {offset: 3, total: 3})
  })

  test('present an order data', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderList.make({offset: 0, limit: 1}))

    dataStore.get.for('orders', {offset: 0, limit: 1}).returns(OrderListData.make({
      list: [OrderListData.makeOrder({
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

    await updateOrderList()

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
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderList.make({offset: 0, limit: 1}))

    dataStore.get.for('orders', {offset: 0, limit: 1}).returns(OrderListData.make({
      list: [OrderListData.makeOrder({
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

    await updateOrderList()

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
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderList.make({offset: 0, limit: 1}))

    dataStore.get.for('orders', {offset: 0, limit: 1}).returns(OrderListData.make({
      list: [OrderListData.makeOrder({
        id: 'id',
        createdDate: '2023-11-12T08:12:01.010Z',
        updatedDate: '2024-12-24T17:57:03.444Z',
        user: 'userId',
        sum: 0.5,
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'pending',
      }), OrderListData.makeOrder({
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

    await updateOrderList()

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
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderList.make({offset: 0, limit: 1}))

    dataStore.get
      .for('orders', {offset: 0, limit: 1})
      .returns(OrderListData.make({
        list: [OrderListData.makeOrder({user: 'userId'}), OrderListData.makeOrder({user: 'userId'})]
      }))
    dataStore.get.for('users', ['userId']).returns([{id: 'userId', name: 'name'}])

    await updateOrderList()

    assert.deepEqual(presentation.get().list.at(0).user, {id: 'userId', name: 'name'})
    assert.deepEqual(presentation.get().list.at(1).user, {id: 'userId', name: 'name'})
    assert.deepEqual(dataStore.get.lastCall, ['users', ['userId']])
    assert.deepEqual(dataStore.get.callCount, 2)
  })
})

const setup = () => {
  const presentation = Atom.of({})
  const dataStore = new DataStoreMock()
  const notifier = new NotifierMock()
  return {
    presentation, dataStore, notifier,
    updateOrderList: UpdateOrderList({presentation, dataStore, notifier})
  }
}
