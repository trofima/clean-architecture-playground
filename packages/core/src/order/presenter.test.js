import {assert} from 'chai'
import {presentOrder} from './presenter.js'
import {Order} from './entities/order.js'
import {User} from '../user/entities/user.js'

suite('present order', () => {
  test('build view model', () => {
    const viewModel = presentOrder({
      order: Order.make({
        user: User.make({name: 'A Name', billingAddress: 'billing address'}),
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'pending',
        shippingAddress: 'shipping address',
      }),
    })
    assert.deepInclude(viewModel.order, {
      user: 'A Name',
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
      shippingAddress: 'shipping address',
      billingAddress: 'billing address',
    })

    const anotherViewModel = presentOrder({
      order: Order.make({
        user: User.make({name: 'Another Name', billingAddress: 'another billing address'}),
        paymentStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
        shippingAddress: 'another shipping address',
      }),
    })
    assert.deepInclude(anotherViewModel.order, {
      user: 'Another Name',
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      shippingAddress: 'another shipping address',
      billingAddress: 'another billing address',
    })
  })

  test('format date', () => {
    const {order: {createdDate: emptyCreatedDate}} = presentOrder({
      order: Order.make({createdDate: ''}),
    })
    assert.equal(emptyCreatedDate, '')

    const {order: {createdDate}} = presentOrder({
      order: Order.make({createdDate: '2023-11-12T08:12:01.010Z'}),
    })
    assert.equal(createdDate, '2023-11-12, 08:12')

    const {order: {createdDate: anotherCreatedDate}} = presentOrder({
      order: Order.make({createdDate: '2024-12-24T17:57:03.444Z'}),
    })
    assert.equal(anotherCreatedDate, '2024-12-24, 17:57')
  })

  test('format sum', () => {
    const {order: {sum: zeroSum}} = presentOrder({
      order: Order.make({sum: '0'}),
    })
    assert.equal(zeroSum, '0.00')

    const {order: {sum}} = presentOrder({
      order: Order.make({sum: '1.123'}),
    })
    assert.equal(sum, '1.12')

    const {order: {sum: roundedSum}} = presentOrder({
      order: Order.make({sum: '1.125'}),
    })
    assert.equal(roundedSum, '1.13')
  })
})
