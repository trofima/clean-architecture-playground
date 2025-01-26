import {assert} from 'chai'
import {AsyncFunctionSpy, Atom} from '@borshch/utilities'
import {RenderOrderList} from './render-order-list.js'

suite('Render order list', () => {
  test('initialize order list presentation', async () => {
    const {renderOrderList, presentation} = setup()

    const listing = renderOrderList()

    assert.deepEqual(presentation.get(), {loading: false, list: [], error: undefined, offset: 0, limit: 5, total: 0})
    await listing
  })

  test('load orders', async () => {
    const {renderOrderList, updateOrderList} = setup()

    await renderOrderList()

    assert(updateOrderList.called)
  })
})

const setup = () => {
  const presentation = new Atom()
  const updateOrderList = new AsyncFunctionSpy()
  return {
    presentation, updateOrderList,
    renderOrderList: RenderOrderList({presentation, updateOrderList}),
  }
}
