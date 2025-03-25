import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {UpdateOrderInList} from './update-order-in-list.js'
import {OrderListPresentation} from '../entities/order-list-presentation.js'

suite('update order in list', () => {
  test('update order data', async () => {
    const {updateOrderInList, presentation} = setup()
    presentation.init(OrderListPresentation.make({list: [
      OrderListPresentation.makeOrder({id: 'id', paymentStatus: 'unpaid', fulfillmentStatus: 'pending'}),
    ]}))

    await updateOrderInList('id', {paymentStatus: 'paid'})
    assert.equal(presentation.get().list.at(0).paymentStatus, 'paid')

    await updateOrderInList('id', {paymentStatus: 'unpaid'})
    assert.equal(presentation.get().list.at(0).paymentStatus, 'unpaid')

    await updateOrderInList('id', {fulfillmentStatus: 'fulfilled'})
    assert.equal(presentation.get().list.at(0).fulfillmentStatus, 'fulfilled')

    await updateOrderInList('id', {fulfillmentStatus: 'pending'})
    assert.equal(presentation.get().list.at(0).fulfillmentStatus, 'pending')

    await updateOrderInList('id', {paymentStatus: 'paid', fulfillmentStatus: 'fulfilled'})
    assert.deepInclude(presentation.get().list.at(0), {paymentStatus: 'paid', fulfillmentStatus: 'fulfilled'})
  })

  test('update order by id', async () => {
    const {updateOrderInList, presentation} = setup()
    presentation.init(OrderListPresentation.make({list: [
      OrderListPresentation.makeOrder({id: 'notUpdatingId', paymentStatus: 'unpaid'}),
      OrderListPresentation.makeOrder({id: 'id', paymentStatus: 'unpaid'}),
      OrderListPresentation.makeOrder({id: 'anotherId', paymentStatus: 'unpaid'}),
    ]}))

    await updateOrderInList('id', {paymentStatus: 'paid'})
    assert.equal(presentation.get().list.at(1).paymentStatus, 'paid')

    await updateOrderInList('anotherId', {paymentStatus: 'paid'})
    assert.equal(presentation.get().list.at(2).paymentStatus, 'paid')

    assert.equal(presentation.get().list.at(0).paymentStatus, 'unpaid')
  })
})

const setup = () => {
  const presentation = new Atom()
  return {
    presentation,
    updateOrderInList: UpdateOrderInList({presentation}),
  }
}
