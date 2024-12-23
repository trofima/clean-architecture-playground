import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {RenderOrderList} from './render-order-list.js'

suite('Render order list', () => {
  test('present listing started', async () => {
    const presentation = new Atom({})
    const renderOrderList = RenderOrderList({presentation})

    await renderOrderList()

    assert.equal(presentation.get().listing, true)
  })
})
