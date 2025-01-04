import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {RenderOrder} from './render-order.js'
import {DataStoreMock} from '../../dependencies/test-utilities.js'
import {DataStoreError} from '../../dependencies/index.js'
import {User} from '../../user/entities/user.js'
import {Order} from '../entities/order.js'

suite('Render order', () => {
  test('initialize order presentation', async () => {
    const {renderOrder, presentation} = setup()

    const rendering = renderOrder('id')

    assert.deepEqual(presentation.get(), {
      loading: true,
      data: {
        id: '',
        createdDate: '',
        updatedDate: '',
        user: {id: '', name: '', billingAddress: ''},
        sum: 0,
        paymentStatus: '',
        fulfillmentStatus: '',
        shippingAddress: '',
      },
      originalData: {
        id: '',
        createdDate: '',
        updatedDate: '',
        user: {id: '', name: '', billingAddress: ''},
        sum: 0,
        paymentStatus: '',
        fulfillmentStatus: '',
        shippingAddress: '',
      },
      error: undefined,
      hasChanges: false,
    })
    await rendering
  })

  test('present an order data', async () => {
    const {renderOrder, presentation, dataStore} = setup()
    dataStore.get.for('order', {id: 'id'}).returns(Order.make({
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      updatedDate: '2024-12-24T17:57:03.444Z',
      user: 'userId',
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
      shippingAddress: 'address',
    }))
    dataStore.get.for('user', 'userId')
      .returns(User.make({id: 'userId', name: 'name', billingAddress: 'billing address'}))

    await renderOrder('id')

    assert.deepEqual(presentation.get().data, {
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      updatedDate: '2024-12-24T17:57:03.444Z',
      user: {id: 'userId', name: 'name', billingAddress: 'billing address'},
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
      shippingAddress: 'address',
    })
    assert.deepEqual(presentation.get().originalData, {
      id: 'id',
      createdDate: '2023-11-12T08:12:01.010Z',
      updatedDate: '2024-12-24T17:57:03.444Z',
      user: {id: 'userId', name: 'name', billingAddress: 'billing address'},
      sum: 0.5,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
      shippingAddress: 'address',
    })
  })

  test('present another order data', async () => {
    const {renderOrder, presentation, dataStore} = setup()
    dataStore.get.for('order', {id: 'anotherId'}).returns(Order.make({
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      updatedDate: '2024-10-30T24:48:15.555Z',
      user: 'anotherUserId',
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      shippingAddress: 'another shipping address',
    }))
    dataStore.get.for('user', 'anotherUserId')
      .returns(User.make({id: 'anotherUserId', name: 'another name', billingAddress: 'another billing address'}))

    await renderOrder('anotherId')

    assert.deepEqual(presentation.get().data, {
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      updatedDate: '2024-10-30T24:48:15.555Z',
      user: {id: 'anotherUserId', name: 'another name', billingAddress: 'another billing address'},
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      shippingAddress: 'another shipping address',
    })
    assert.deepEqual(presentation.get().originalData, {
      id: 'anotherId',
      createdDate: '2024-07-10T11:85:20.390Z',
      updatedDate: '2024-10-30T24:48:15.555Z',
      user: {id: 'anotherUserId', name: 'another name', billingAddress: 'another billing address'},
      sum: 5.6,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      shippingAddress: 'another shipping address',
    })
  })

  test('hide loader when order loaded', async () => {
    const {renderOrder, presentation} = setup()

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
  dataStore.get.returns(Order.make())
  dataStore.get.forArg(0, 'order').returns(Order.make())
  dataStore.get.forArg(0, 'user').returns(User.make())
  return {
    presentation, dataStore,
    renderOrder: RenderOrder({presentation, dataStore})
  }
}
