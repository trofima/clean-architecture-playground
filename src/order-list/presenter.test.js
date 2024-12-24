import {assert} from 'chai'
import {presentOrderList} from './presenter.js'
import {OrderList} from './entities/order-list.js'
import {Order} from './entities/order.js'

suite('present order list', () => {
  test('format order data', () => {
    const viewModel = presentOrderList(
      OrderList.make({list: [Order.make({createdDate: '2023-11-12T08:12:01.010Z'})]})
    )
    assert.equal(viewModel.list.at(0).createdDate, '2023-11-12, 08:12')

    const anotherViewModel = presentOrderList(
      OrderList.make({list: [Order.make({createdDate: '2024-12-24T17:57:03.444Z'})]})
    )
    assert.equal(anotherViewModel.list.at(0).createdDate, '2024-12-24, 17:57')

    const allViewModel = presentOrderList(
      OrderList.make({list: [
        Order.make({createdDate: '2023-11-12T08:12:01.010Z'}),
        Order.make({createdDate: '2024-12-24T17:57:03.444Z'}),
      ]})
    )
    assert.equal(allViewModel.list.at(0).createdDate, '2023-11-12, 08:12')
    assert.equal(allViewModel.list.at(1).createdDate, '2024-12-24, 17:57')
  })
})
