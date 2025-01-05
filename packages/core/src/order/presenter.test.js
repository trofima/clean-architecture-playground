import {assert} from 'chai'
import {presentOrder} from './presenter.js'
import {OrderPresentation} from './entities/order-presentation.js'
import {User} from '../user/entities/user.js'

suite('present order', () => {
  test('build view model', () => {
    const viewModel = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({
        id: 'id',
        user: User.make({name: 'A Name', billingAddress: 'billing address'}),
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'pending',
        shippingAddress: 'shipping address',
      }),
    }))
    assert.deepInclude(viewModel.data, {
      id: 'id',
      user: 'A Name',
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
      shippingAddress: 'shipping address',
      billingAddress: 'billing address',
    })

    const anotherViewModel = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({
        id: 'anotherId',
        user: User.make({name: 'Another Name', billingAddress: 'another billing address'}),
        paymentStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
        shippingAddress: 'another shipping address',
      }),
    }))
    assert.deepInclude(anotherViewModel.data, {
      id: 'anotherId',
      user: 'Another Name',
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      shippingAddress: 'another shipping address',
      billingAddress: 'another billing address',
    })
  })

  test('format created date', () => {
    const {data: {createdDate: emptyCreatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({createdDate: ''}),
    }))
    assert.equal(emptyCreatedDate, '')

    const {data: {createdDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({createdDate: '2023-11-12T08:12:01.010Z'}),
    }))
    assert.equal(createdDate, '2023-11-12, 08:12')

    const {data: {createdDate: anotherCreatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({createdDate: '2024-12-24T17:57:03.444Z'}),
    }))
    assert.equal(anotherCreatedDate, '2024-12-24, 17:57')
  })

  test('format updated date', () => {
    const {data: {updatedDate: emptyUpdatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({updatedDate: ''}),
    }))
    assert.equal(emptyUpdatedDate, '')

    const {data: {updatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({updatedDate: '2023-11-12T08:12:01.010Z'}),
    }))
    assert.equal(updatedDate, '2023-11-12, 08:12')

    const {data: {updatedDate: anotherUpdatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({updatedDate: '2024-12-24T17:57:03.444Z'}),
    }))
    assert.equal(anotherUpdatedDate, '2024-12-24, 17:57')
  })

  test('format sum', () => {
    const {data: {sum: zeroSum}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({sum: '0'}),
    }))
    assert.equal(zeroSum, '0.00')

    const {data: {sum}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({sum: '1.123'}),
    }))
    assert.equal(sum, '1.12')

    const {data: {sum: roundedSum}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({sum: '1.125'}),
    }))
    assert.equal(roundedSum, '1.13')
  })
})
