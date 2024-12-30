import {assert} from 'chai'
import {AsyncFunctionSpy, Atom} from '@borshch/utilities'
import {RenderOrderList} from './render-order-list.js'

suite('Render order list', () => {
  test('present empty list', async () => {
    const {renderOrderList, presentation} = setup()

    const listing = renderOrderList()

    assert.deepEqual(presentation.get(), {loading: true, list: [], error: undefined, offset: 0, limit: 20, total: 0})
    await listing
  })

  test('load orders', async () => {
    const {renderOrderList, updateOrderList} = setup()

    await renderOrderList()

    assert(updateOrderList.called)
  })
})

const setup = () => {
  const presentation = Atom.of({})
  const updateOrderList = new AsyncFunctionSpy()
  return {
    presentation, updateOrderList,
    renderOrderList: RenderOrderList({presentation, updateOrderList})
  }
}
