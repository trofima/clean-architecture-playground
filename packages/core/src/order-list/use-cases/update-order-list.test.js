import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {UpdateOrderList} from './update-order-list.js'
import {DataStoreError} from '../../dependencies/index.js'
import {DataStoreMock, makeDummyOrders, NotifierMock} from '../../dependencies/test-utilities.js'
import {OrderListPresentation} from '../entities/order-list-presentation.js'
import {OrderPresentation} from '../../order/entities/order-presentation.js'
import {User} from '../../user/entities/user.js'
import {OrderList} from '../entities/order-list.js'
import {Order} from '../../order/entities/order.js'

suite('update order list', () => {
  test('present empty list', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    dataStore.get.defer()
    presentation.update(() => OrderListPresentation.make({offset: 0, limit: 20}))

    const listing = updateOrderList()
    assert.deepEqual(presentation.get(), {loading: true, list: [], error: undefined, offset: 0, limit: 20, total: 0})
    assert.deepEqual(dataStore.get.lastCall, ['orders', {offset: 0, limit: 20}])

    await dataStore.get.resolve(0, OrderList.make({list: [], total: 0}))
    await listing
    assert.deepEqual(presentation.get(), {loading: false, list: [], error: undefined, offset: 0, limit: 20, total: 0})
  })

  test('present error, when data getting failed and list is empty', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderListPresentation.make())

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
    presentation.update(() => OrderListPresentation.make({list: [OrderPresentation.make()]}))

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
    presentation.update(() => OrderListPresentation.make({offset: 0, limit: 1}))
    dataStore.get
      .for('orders', {offset: 0, limit: 1})
      .returns(OrderList.make({list: makeDummyOrders(1), total: 1}))

    await updateOrderList()

    assert.deepInclude(presentation.get(), {offset: 1, total: 1})
  })

  test('update another order list meta data', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderListPresentation.make({offset: 1, limit: 2}))
    dataStore.get
      .for('orders', {offset: 1, limit: 2})
      .returns(OrderList.make({list: makeDummyOrders(2), total: 3}))

    await updateOrderList()

    assert.deepInclude(presentation.get(), {offset: 3, total: 3})
  })

  test('present an order data', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderListPresentation.make({offset: 0, limit: 1}))

    dataStore.get.for('orders', {offset: 0, limit: 1}).returns(OrderList.make({
      list: [Order.make({
        id: 'id',
        createdDate: '2023-11-12T08:12:01.010Z',
        user: 'userId',
        sum: 0.5,
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'pending',
      })]
    }))
    dataStore.get.for('users', ['userId']).returns([User.make(({id: 'userId', name: 'user name'}))])

    await updateOrderList()

    assert.deepEqual(presentation.get().list, [{
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      user: 'user name',
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
      updating: false,
    }])
  })

  test('present another order data', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderListPresentation.make({offset: 0, limit: 1}))

    dataStore.get.for('orders', {offset: 0, limit: 1}).returns(OrderList.make({
      list: [Order.make({
        id: 'anotherId',
        createdDate: '2024-07-10T11:85:20.390Z',
        user: 'anotherUserId',
        sum: 5.6,
        paymentStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
      })],
    }))
    dataStore.get.for('users', ['anotherUserId']).returns([User.make({id: 'anotherUserId', name: 'another user name'})])

    await updateOrderList()

    assert.deepEqual(presentation.get().list, [{
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      user: 'another user name',
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      updating: false,
    }])
  })

  test('present all orders data', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderListPresentation.make({offset: 0, limit: 1}))

    dataStore.get.for('orders', {offset: 0, limit: 1}).returns(OrderList.make({
      list: [Order.make({
        id: 'id',
        createdDate: '2023-11-12T08:12:01.010Z',
        user: 'userId',
        sum: 0.5,
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'pending',
      }), Order.make({
        id: 'anotherId',
        createdDate: '2024-07-10T11:85:20.390Z',
        user: 'anotherUserId',
        sum: 5.6,
        paymentStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
      })]
    }))
    dataStore.get
      .for('users', ['userId', 'anotherUserId'])
      .returns([User.make({id: 'userId', name: 'user name'}), User.make({id: 'anotherUserId', name: 'another user name'})])

    await updateOrderList()

    assert.deepEqual(presentation.get().list, [{
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      user: 'user name',
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
      updating: false,
    }, {
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      user: 'another user name',
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      updating: false,
    }])
  })

  test('present orders of the same user', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderListPresentation.make({offset: 0, limit: 1}))

    dataStore.get
      .for('orders', {offset: 0, limit: 1})
      .returns(OrderList.make({
        list: [Order.make({user: 'userId'}), Order.make({user: 'userId'})]
      }))
    dataStore.get.for('users', ['userId']).returns([User.make({id: 'userId', name: 'user name'})])

    await updateOrderList()

    assert.deepEqual(presentation.get().list.at(0).user, 'user name')
    assert.deepEqual(presentation.get().list.at(1).user, 'user name')
    assert.deepEqual(dataStore.get.lastCall, ['users', ['userId']])
    assert.deepEqual(dataStore.get.callCount, 2)
  })

  test('update order list by default', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderListPresentation.make({offset: 0, limit: 1}))

    dataStore.get.for('orders', {offset: 0, limit: 1}).returns(OrderList.make({
      list: [Order.make({id: 'id'})]
    }))
    dataStore.get.for('orders', {offset: 1, limit: 1}).returns(OrderList.make({
      list: [Order.make({id: 'anotherId'})]
    }))

    await updateOrderList()
    await updateOrderList()

    const {list} = presentation.get()
    assert.equal(list.length, 2)
    assert.equal(list.at(0).id, 'id')
    assert.equal(list.at(1).id, 'anotherId')
  })

  test('refresh order list', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderListPresentation.make({
      offset: 2,
      limit: 1,
      list: [OrderListPresentation.makeOrder({id: 'id1'}), OrderListPresentation.makeOrder({id: 'id2'})],
    }))
    dataStore.get.for('orders', {offset: 0, limit: 2}).returns(OrderList.make({
      list: [Order.make({id: 'refreshedId1'}), Order.make({id: 'refreshedId2'})]
    }))

    await updateOrderList({refresh: true})

    const {list, offset} = presentation.get()
    assert.equal(list.length, 2)
    assert.equal(list.at(0).id, 'refreshedId1')
    assert.equal(list.at(1).id, 'refreshedId2')
    assert.equal(offset, 2)

    presentation.update(() => OrderListPresentation.make({
      offset: 3,
      limit: 1,
      list: [
        OrderListPresentation.makeOrder({id: 'id1'}),
        OrderListPresentation.makeOrder({id: 'id2'}),
        OrderListPresentation.makeOrder({id: 'id3'}),
      ],
    }))
    dataStore.get.for('orders', {offset: 0, limit: 3}).returns(OrderList.make({list: [
      Order.make({id: 'refreshedId1'}),
      Order.make({id: 'refreshedId2'}),
      Order.make({id: 'refreshedId3'}),
    ]}))

    await updateOrderList({refresh: true})

    const {list: anotherList, offset: anotherOffset} = presentation.get()
    assert.equal(anotherList.length, 3)
    assert.equal(anotherList.at(0).id, 'refreshedId1')
    assert.equal(anotherList.at(1).id, 'refreshedId2')
    assert.equal(anotherList.at(2).id, 'refreshedId3')
    assert.equal(anotherOffset, 3)
  })
})

const setup = () => {
  const presentation = Atom.of({})
  const dataStore = new DataStoreMock()
  const notifier = new NotifierMock()
  dataStore.get.forArg(0, 'users').returns([])
  dataStore.get.forArg(0, 'orders').returns(OrderList.make())
  return {
    presentation, dataStore, notifier,
    updateOrderList: UpdateOrderList({presentation, dataStore, notifier})
  }
}
