import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {RenderOrder} from './render-order.js'
import {DataStoreMock, OrderListData} from '../../dependencies/test-utilities.js'
import {DataStoreError} from '../../dependencies/index.js'
import {User} from '../../user/entities/user.js'

suite('Render order', () => {
  test('present order loading', async () => {
    const {renderOrder, presentation} = setup()

    const rendering = renderOrder('id')

    assert.deepEqual(presentation.get(), {loading: true, order: undefined, error: undefined})
    await rendering
  })

  test('present an order data', async () => {
    const {renderOrder, presentation, dataStore} = setup()
    dataStore.get.for('order', {id: 'id'}).returns(OrderListData.makeOrder({
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      updatedDate: '2024-12-24T17:57:03.444Z',
      user: 'userId',
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
    }))
    dataStore.get.for('user', 'userId').returns(User.make({id: 'userId', name: 'name'}))

    await renderOrder('id')

    assert.deepEqual(presentation.get().order, {
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      updatedDate: '2024-12-24T17:57:03.444Z',
      user: {id: 'userId', name: 'name'},
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
    })
  })

  test('present another order data', async () => {
    const {renderOrder, presentation, dataStore} = setup()
    dataStore.get.for('order', {id: 'anotherId'}).returns(OrderListData.makeOrder({
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      updatedDate: '2024-10-30T24:48:15.555Z',
      user: 'anotherUserId',
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    }))
    dataStore.get.for('user', 'anotherUserId').returns(User.make({id: 'anotherUserId', name: 'another name'}))

    await renderOrder('anotherId')

    assert.deepEqual(presentation.get().order, {
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      updatedDate: '2024-10-30T24:48:15.555Z',
      user: {id: 'anotherUserId', name: 'another name'},
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    })
  })

  test('hide loader when order loaded', async () => {
    const {renderOrder, presentation, dataStore} = setup()
    dataStore.get.for('order', {id: 'id'}).returns(OrderListData.makeOrder())
    dataStore.get.for('user', 'userId').returns(User.make())

    await renderOrder('id')

    assert.equal(presentation.get().loading, false)
  })

  test('present error, when data getting failed', async () => {
    const {renderOrder, presentation, dataStore} = setup()

    dataStore.get.fails(new DataStoreError('Oj vej', {code: '001'}))
    await renderOrder('id')
    assert.deepInclude(presentation.get(), {
      loading: false,
      error: {
        message: 'Oj vej',
        code: '001',
      },
    })

    dataStore.get.fails(new DataStoreError('Oj vavoj', {code: '100'}))
    await renderOrder('id')
    assert.deepInclude(presentation.get(), {
      loading: false,
      error: {
        message: 'Oj vavoj',
        code: '100',
      },
    })
  })
})

const setup = () => {
  const presentation = Atom.of({})
  const dataStore = new DataStoreMock()
  dataStore.get.returns(OrderListData.makeOrder())
  return {
    presentation, dataStore,
    renderOrder: RenderOrder({presentation, dataStore})
  }
}
