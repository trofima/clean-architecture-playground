import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {UpdateOrderList} from './update-order-list.js'
import {DataStoreError} from '../../dependencies/index.js'
import {DataStoreMock, makeDummyOrders, NotifierMock} from '../../dependencies/test-utilities.js'
import {OrderListPresentation} from '../entities/order-list-presentation.js'
import {User} from '../../user/entities/user.js'
import {OrderList} from '../entities/order-list.js'
import {Order} from '../../order/entities/order.js'

suite('update order list', () => {
  test('present empty list', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    dataStore.get.defer()
    presentation.init(OrderListPresentation.make({offset: 0, limit: 20}))

    const listing = updateOrderList()
    assert.deepEqual(presentation.get(), {loading: true, list: [], error: undefined, offset: 0, limit: 20, total: 0})
    assert.deepEqual(dataStore.get.lastCall, ['orders', {offset: 0, limit: 20}])

    await dataStore.get.resolve(0, OrderList.make({list: [], total: 0}))
    await listing
    assert.deepEqual(presentation.get(), {loading: false, list: [], error: undefined, offset: 0, limit: 20, total: 0})
  })

  ;[
    {message: 'Oj vej', code: '001'},
    {message: 'Oj vavoj', code: '100'},
  ].forEach(({message, code}) => {
    test('present error, when data getting failed and list is empty', async () => {
      const {updateOrderList, presentation, dataStore} = setup()
      presentation.init(OrderListPresentation.make())
      dataStore.get.fails(new DataStoreError(message, {code}))

      await updateOrderList()

      assert.deepInclude(presentation.get(), {
        loading: false,
        error: {message, code},
      })
    })
  })

  test('hide error from previous loading', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    dataStore.get.defer()
    presentation.init(OrderListPresentation.make())

    const firstUpdating = updateOrderList()
    await dataStore.get.reject(0, new DataStoreError('Oj vej', {code: '001'}))
    await firstUpdating
    assert.deepInclude(presentation.get(), {
      loading: false,
      error: {
        message: 'Oj vej',
        code: '001',
      },
    })

    const secondUpdating = updateOrderList()
    assert.deepInclude(presentation.get(), {
      loading: true,
      error: undefined,
    })

    await dataStore.get.resolve(1, OrderListPresentation.make())
    await secondUpdating
  })

  ;[
    {message: 'Oj vej', code: '001'},
    {message: 'Oj vavoj', code: '100'},
  ].forEach(({message, code}) => {
    test('show error notification, when data getting failed and list is not empty', async () => {
      const {updateOrderList, presentation, dataStore, notifier} = setup()
      presentation.init(OrderListPresentation.make({list: [OrderListPresentation.makeOrder()]}))
      dataStore.get.fails(new DataStoreError(message, {code}))

      await updateOrderList()

      assert.deepEqual(notifier.showNotification.lastCall, [{type: 'error', message}])
      assert.deepInclude(presentation.get(), {loading: false, error: undefined})
    })
  })


  ;[{
    initialMetadata: {offset: 0, limit: 1},
    orderCount: 1,
    total: 1,
    offset: 1,
  }, {
    initialMetadata: {offset: 1, limit: 2},
    orderCount: 2,
    total: 3,
    offset: 3,
  }].forEach(({initialMetadata, orderCount, offset, total}) => {
    test('update order list meta data', async () => {
      const {updateOrderList, presentation, dataStore} = setup()
      presentation.init(OrderListPresentation.make(initialMetadata))
      dataStore.get
        .for('orders', initialMetadata)
        .returns(OrderList.make({list: makeDummyOrders(orderCount), total}))

      await updateOrderList()

      assert.deepInclude(presentation.get(), {offset, total})
    })
  })

  ;[{
    orderData: {
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      user: 'userId',
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
    },
    userData: {id: 'userId', name: 'User Name'},
  }, {
    orderData: {
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      user: 'anotherUserId',
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    },
    userData: {id: 'anotherUserId', name: 'another user name'},
  }].forEach(({orderData, userData}) => {
    test('present order data', async () => {
      const {updateOrderList, presentation, dataStore} = setup()
      presentation.init(OrderListPresentation.make({offset: 0, limit: 1}))

      dataStore.get.for('orders', {offset: 0, limit: 1})
        .returns(OrderList.make({list: [Order.make(orderData)]}))
      dataStore.get.for('users', [userData.id])
        .returns([User.make((userData))])

      await updateOrderList()

      assert.deepEqual(presentation.get().list, [{
        id: orderData.id,
        createdDate: orderData.createdDate,
        sum: orderData.sum,
        paymentStatus: orderData.paymentStatus,
        fulfillmentStatus: orderData.fulfillmentStatus,
        user: userData.name,
        updating: false,
      }])
    })
  })

  test('present all orders data', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.init(OrderListPresentation.make({offset: 0, limit: 1}))

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
      })],
    }))
    dataStore.get
      .for('users', ['userId', 'anotherUserId'])
      .returns([
        User.make({id: 'userId', name: 'user name'}),
        User.make({id: 'anotherUserId', name: 'another user name'}),
      ])

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
    presentation.init(OrderListPresentation.make({offset: 0, limit: 1}))

    dataStore.get
      .for('orders', {offset: 0, limit: 1})
      .returns(OrderList.make({
        list: [Order.make({user: 'userId'}), Order.make({user: 'userId'})],
      }))
    dataStore.get.for('users', ['userId']).returns([User.make({id: 'userId', name: 'user name'})])

    await updateOrderList()

    assert.deepEqual(presentation.get().list.at(0).user, 'user name')
    assert.deepEqual(presentation.get().list.at(1).user, 'user name')
    assert.deepEqual(dataStore.get.lastCall, ['users', ['userId']])
    assert.deepEqual(dataStore.get.callCount, 2)
  })

  test('loads more items to list by default', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.init(OrderListPresentation.make({offset: 0, limit: 1}))

    dataStore.get.for('orders', {offset: 0, limit: 1}).returns(OrderList.make({
      list: [Order.make({id: 'id'})],
    }))
    dataStore.get.for('orders', {offset: 1, limit: 1}).returns(OrderList.make({
      list: [Order.make({id: 'anotherId'})],
    }))

    await updateOrderList()
    const {list: listAfterFirstUpdate} = presentation.get()
    assert.equal(listAfterFirstUpdate.length, 1)
    assert.equal(listAfterFirstUpdate.at(0).id, 'id')

    await updateOrderList()
    const {list: listAfterSecondUpdate} = presentation.get()
    assert.equal(listAfterSecondUpdate.length, 2)
    assert.equal(listAfterSecondUpdate.at(0).id, 'id')
    assert.equal(listAfterSecondUpdate.at(1).id, 'anotherId')
  })

  ;[{
    initialOrder: {paymentStatus: 'unpaid'},
    updatedOrder: {paymentStatus: 'paid'},
  }, {
    initialOrder: {fulfillmentStatus: 'pending'},
    updatedOrder: {fulfillmentStatus: 'fulfilled'},
  }, {
    initialOrder: {paymentStatus: 'unpaid', fulfillmentStatus: 'pending'},
    updatedOrder: {paymentStatus: 'paid', fulfillmentStatus: 'fulfilled'},
  }].forEach(({initialOrder, updatedOrder}) => {
    test('refresh order list item', async () => {
      const {updateOrderList, presentation, dataStore} = setup()
      presentation.update(() => OrderListPresentation.make({
        offset: 1,
        limit: 1,
        list: [OrderListPresentation.makeOrder(initialOrder)],
      }))
      dataStore.get.for('orders', {offset: 0, limit: 1})
        .returns(OrderList.make({list: [Order.make(updatedOrder)]}))

      await updateOrderList({refresh: true})

      const {list} = presentation.get()
      assert.deepInclude(list.at(0), updatedOrder)
    })
  })

  test('refresh all order list items', async () => {
    const {updateOrderList, presentation, dataStore} = setup()
    presentation.update(() => OrderListPresentation.make({
      offset: 2,
      limit: 1,
      list: [
        OrderListPresentation.makeOrder({paymentStatus: 'unpaid'}),
        OrderListPresentation.makeOrder({fulfillmentStatus: 'pending'}),
      ],
    }))
    dataStore.get.for('orders', {offset: 0, limit: 2}).returns(OrderList.make({
      list: [
        Order.make({paymentStatus: 'paid'}),
        Order.make({fulfillmentStatus: 'fulfilled'}),
      ],
    }))

    await updateOrderList({refresh: true})

    const {list} = presentation.get()
    assert.deepInclude(list.at(0), {paymentStatus: 'paid'})
    assert.deepInclude(list.at(1), {fulfillmentStatus: 'fulfilled'})
  })

  ;[
    {currentOffset: 2},
    {currentOffset: 3},
  ].forEach(({currentOffset}) => {
    test('refresh order list of different length', async () => {
      const {updateOrderList, presentation, dataStore} = setup()
      presentation.update(() => OrderListPresentation.make({
        offset: currentOffset,
        limit: 1,
        list: Array(currentOffset).fill().map(OrderListPresentation.makeOrder),
      }))
      dataStore.get.for('orders', {offset: 0, limit: currentOffset}).returns(OrderList.make({
        list: Array(currentOffset).fill().map(Order.make),
      }))

      await updateOrderList({refresh: true})

      const {list, offset} = presentation.get()
      assert.equal(list.length, currentOffset)
      assert.equal(offset, currentOffset)
    })
  })
})

const setup = () => {
  const presentation = new Atom()
  const dataStore = new DataStoreMock()
  const notifier = new NotifierMock()
  dataStore.get.forArg(0, 'users').returns([])
  dataStore.get.forArg(0, 'orders').returns(OrderList.make())
  return {
    presentation, dataStore, notifier,
    updateOrderList: UpdateOrderList({presentation, dataStore, notifier}),
  }
}
