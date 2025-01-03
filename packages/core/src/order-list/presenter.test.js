import {assert} from 'chai'
import {presentOrderList} from './presenter.js'
import {OrderListPresentation} from './entities/order-list-presentation.js'
import {OrderPresentation} from '../order/entities/order-presentation.js'

suite('present order list', () => {
  test('build view model', () => {
    const viewModel = presentOrderList(
      OrderListPresentation.make({list: [
        OrderPresentation.make({user: 'A Name', paymentStatus: 'unpaid', fulfillmentStatus: 'pending'}),
      ]})
    )
    assert.deepInclude(viewModel.list.at(0), {
      user: 'A Name', paymentStatus: 'unpaid', fulfillmentStatus: 'pending',
    })

    const anotherViewModel = presentOrderList(
      OrderListPresentation.make({list: [
        OrderPresentation.make({user: 'Another Name', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled'}),
      ]})
    )
    assert.deepInclude(anotherViewModel.list.at(0), {
      user: 'Another Name', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled',
    })

    const allViewModel = presentOrderList(
      OrderListPresentation.make({list: [
        OrderPresentation.make({user: 'A Name', paymentStatus: 'unpaid', fulfillmentStatus: 'pending'}),
        OrderPresentation.make({user: 'Another Name', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled'}),
      ]})
    )
    assert.deepInclude(allViewModel.list.at(0), {
      user: 'A Name', paymentStatus: 'unpaid', fulfillmentStatus: 'pending',
    })
    assert.deepInclude(allViewModel.list.at(1), {
      user: 'Another Name', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled',
    })
  })

  test('format date', () => {
    const {list: [{createdDate: emptyCreatedDate}]} = presentOrderList(
      OrderListPresentation.make({list: [OrderPresentation.make({createdDate: ''})]})
    )
    assert.equal(emptyCreatedDate, '')

    const {list: [{createdDate}]} = presentOrderList(
      OrderListPresentation.make({list: [OrderPresentation.make({createdDate: '2023-11-12T08:12:01.010Z'})]})
    )
    assert.equal(createdDate, '2023-11-12, 08:12')

    const {list: [{createdDate: anotherCreatedDate}]} = presentOrderList(
      OrderListPresentation.make({list: [OrderPresentation.make({createdDate: '2024-12-24T17:57:03.444Z'})]})
    )
    assert.equal(anotherCreatedDate, '2024-12-24, 17:57')
  })

  test('format sum', () => {
    const {list: [{sum: zeroSum}]} = presentOrderList(
      OrderListPresentation.make({list: [OrderPresentation.make({sum: '0'})]})
    )
    assert.equal(zeroSum, '0.00')

    const {list: [{sum}]} = presentOrderList(
      OrderListPresentation.make({list: [OrderPresentation.make({sum: '1.123'})]})
    )
    assert.equal(sum, '1.12')

    const {list: [{sum: roundedSum}]} = presentOrderList(
      OrderListPresentation.make({list: [OrderPresentation.make({sum: '1.125'})]})
    )
    assert.equal(roundedSum, '1.13')
  })
})
