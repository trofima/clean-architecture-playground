import {assert} from 'chai'
import {AsyncFunctionSpy, Atom} from '@borshch/utilities'
import {SaveOrderAndUpdateList} from './save-order-and-update-list.js'
import {OrderPresentation} from '@clean-architecture-playground/core'

suite('save order and update list', () => {
  test('save order', async () => {
    const {saveOrderAndUpdateList, presentation, saveOrder} = setup()
    presentation.init(OrderPresentation.make())

    await saveOrderAndUpdateList()

    assert(saveOrder.called, 'saveOrder should have been called')
  })

  test('update order in list with saved data', async () => {
    const {saveOrderAndUpdateList, updateOrderInList, presentation} = setup()

    presentation.update(() => OrderPresentation.make({data: {
      id: 'id', 
      paymentStatus: 'paid', 
      fulfillmentStatus: 'fulfilled', 
      shippingAddress: 'shipping address',
    }}))
    await saveOrderAndUpdateList()
    assert.deepEqual(updateOrderInList.lastCall, [
      'id', {
        paymentStatus: 'paid', 
        fulfillmentStatus: 'fulfilled',
        shippingAddress: 'shipping address',
      },
    ])

    presentation.update(() => OrderPresentation.make({data: {
      id: 'anotherId', 
      paymentStatus: 'unpaid', 
      fulfillmentStatus: 'pending', 
      shippingAddress: 'another shipping address',
    }}))
    await saveOrderAndUpdateList()
    assert.deepEqual(updateOrderInList.lastCall, [
      'anotherId', {
        paymentStatus: 'unpaid', 
        fulfillmentStatus: 'pending',
        shippingAddress: 'another shipping address',
      },
    ])
  })

  test('do not update order when saving failed', async () => {
    const {saveOrderAndUpdateList, updateOrderInList, presentation} = setup()
    presentation.init(OrderPresentation.make({error: {message: 'error message', code: 1}}))

    await saveOrderAndUpdateList()

    assert(!updateOrderInList.called, 'updateOrderInList should not have been called')
  })

  test('wait for saving before updating list', async () => {
    const {saveOrderAndUpdateList, saveOrder, updateOrderInList, presentation} = setup()
    presentation.init(OrderPresentation.make())
    saveOrder.defer()

    saveOrderAndUpdateList()
    assert(saveOrder.called, 'saveOrder should have been called')
    assert(!updateOrderInList.called, 'updateOrderInList should not have been called yet')

    await saveOrder.resolve()
    assert(updateOrderInList.called, 'updateOrderInList should have been called already')
  })
})

const setup = () => {
  const presentation = new Atom()
  const saveOrder = new AsyncFunctionSpy()
  const updateOrderInList = new AsyncFunctionSpy()
  return {
    presentation, saveOrder, updateOrderInList,
    saveOrderAndUpdateList: SaveOrderAndUpdateList({presentation, saveOrder, updateOrderInList}),
  }
}
