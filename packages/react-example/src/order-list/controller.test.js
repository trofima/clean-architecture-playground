import {assert} from 'chai'
import {AsyncFunctionSpy, FunctionSpy} from '@borshch/utilities'
import {Controller} from './controller.js'

suite('order list controller', () => {
  suite('initialize', () => {
    test('render order list', async () => {
      const {controller, renderOrderList} = setUp()

      await controller.initialize()

      assert.equal(renderOrderList.called, true)
    })
  })

  suite('refresh', () => {
    test('update order list with refresh', async () => {
      const {controller, updateOrderList} = setUp()

      await controller.refresh()

      assert.deepEqual(updateOrderList.lastCall, [{refresh: true}])
    })
  })

  suite('loadMore', () => {
    test('update order list', async () => {
      const {controller, updateOrderList} = setUp()

      await controller.loadMore()

      assert.equal(updateOrderList.called, true)
    })
  })

  suite('open', () => {
    [
      {orderId: 'id'},
      {orderId: 'anotherId'},
    ].forEach(({orderId}) => {
      test('open order by id', async () => {
        const {controller, openOrder} = setUp()

        await controller.open(makeEvent({dataset: {id: orderId}}))

        assert.deepEqual(openOrder.lastCall, [orderId])
      })
    })
  })

  suite('remove', () => {
    test('stop event propagation', async () => {
      const {controller} = setUp()
      const event = makeEvent()

      await controller.remove(event)

      assert.equal(event.stopPropagation.called, true)
    })

    ;[
      {orderId: 'id'},
      {orderId: 'anotherId'},
    ].forEach(({orderId}) => {
      test('remove order by id', async () => {
        const {controller, removeOrderFromList} = setUp()

        await controller.remove(makeEvent({dataset: {id: orderId}}))

        assert.deepEqual(removeOrderFromList.lastCall, [orderId])
      })
    })
  })
})

const setUp = () => {
  const renderOrderList = new AsyncFunctionSpy()
  const openOrder = new AsyncFunctionSpy()
  const updateOrderList = new AsyncFunctionSpy()
  const removeOrderFromList = new AsyncFunctionSpy()
  return {
    renderOrderList, openOrder, updateOrderList, removeOrderFromList,
    controller: Controller({renderOrderList, openOrder, updateOrderList, removeOrderFromList}),
  }
}

const makeEvent = ({dataset = {}} = {}) => ({
  stopPropagation: new FunctionSpy(),
  currentTarget: {dataset},
})
