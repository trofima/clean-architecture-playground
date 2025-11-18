import {assert} from 'chai'
import {presentOrderList} from './presenter.js'
import {OrderListPresentation} from '@clean-architecture-playground/core'

suite('present order list', () => {
  [
    {user: 'Name', paymentStatus: 'unpaid', fulfillmentStatus: 'pending'},
    {user: 'Another Name', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled'},
  ].forEach(({user, paymentStatus, fulfillmentStatus}) => {
    test('render order item to view model', () => {
      const viewModel = presentOrderList(
        OrderListPresentation.make({list: [
          OrderListPresentation.makeOrder({user, paymentStatus, fulfillmentStatus}),
        ]}),
      )

      assert.deepInclude(viewModel.list.at(0), {user, paymentStatus, fulfillmentStatus})
    })
  })

  test('render multiple order items to view model', () => {
    const allViewModel = presentOrderList(
      OrderListPresentation.make({list: [
        OrderListPresentation.makeOrder({user: 'Name', paymentStatus: 'unpaid', fulfillmentStatus: 'pending'}),
        OrderListPresentation.makeOrder({user: 'Another Name', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled'}),
      ]}),
    )

    assert.deepInclude(allViewModel.list.at(0), {
      user: 'Name', paymentStatus: 'unpaid', fulfillmentStatus: 'pending',
    })
    assert.deepInclude(allViewModel.list.at(1), {
      user: 'Another Name', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled',
    })
  })

  ;[
    {createdDate: '', formattedCreatedDate: ''},
    {createdDate: '2023-11-12T08:12:01.010Z', formattedCreatedDate: '2023-11-12, 08:12'},
    {createdDate: '2024-12-24T17:57:03.444Z', formattedCreatedDate: '2024-12-24, 17:57'},
  ].forEach(({createdDate, formattedCreatedDate}) => {
    test('format date', () => {
      const {list: [{createdDate: renderedCreatedDate}]} = presentOrderList(
        OrderListPresentation.make({list: [OrderListPresentation.makeOrder({createdDate})]}),
      )

      assert.equal(renderedCreatedDate, formattedCreatedDate)
    })
  })

  ;[
    {sum: '0', formattedSum: '0.00'},
    {sum: '1.123', formattedSum: '1.12'},
    {sum: '1.125', formattedSum: '1.13'},
  ].forEach(({sum, formattedSum}) => {
    test('format sum', () => {
      const {list: [{sum: renderedSum}]} = presentOrderList(
        OrderListPresentation.make({list: [OrderListPresentation.makeOrder({sum})]}),
      )

      assert.equal(renderedSum, formattedSum)
    })
  })

  test('render placeholder items (skeleton list), when loading empty list', () => {
    const {list} = presentOrderList(
      OrderListPresentation.make({list: [], loading: true}),
    )
    assert.deepEqual(list, [
      {id: 'placeholder1', createdDate: '...', user: '...', sum: '...', paymentStatus: '...', fulfillmentStatus: '...'},
      {id: 'placeholder2', createdDate: '...', user: '...', sum: '...', paymentStatus: '...', fulfillmentStatus: '...'},
      {id: 'placeholder3', createdDate: '...', user: '...', sum: '...', paymentStatus: '...', fulfillmentStatus: '...'},
    ])

    const {list: emptyList} = presentOrderList(
      OrderListPresentation.make({list: [], loading: false}),
    )
    assert.deepEqual(emptyList, [])
  })
})
