import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {OpenOrder} from './open-order.js'
import {NavigatorError} from '../../dependencies/index.js'
import {NavigatorMock} from '../../dependencies/test-utilities.js'

suite('open order', () => {
  test('navigate to order', async () => {
    const {openOrder, navigator} = setup()

    await openOrder('id')
    assert.deepEqual(navigator.open.lastCall, ['order/id'])

    await openOrder('anotherId')
    assert.deepEqual(navigator.open.lastCall, ['order/anotherId'])
  })

  test('present error when navigation failed', async () => {
    const {openOrder, navigator, presentation} = setup()

    navigator.open.fails(new NavigatorError('Oj vej', {code: '001'}))
    await openOrder('id')
    assert.deepInclude(presentation.get(), {
      error: {
        message: 'Oj vej',
        code: '001',
      },
    })

    navigator.open.fails(new NavigatorError('Oj vavoj', {code: '002'}))
    await openOrder('id')
    assert.deepInclude(presentation.get(), {
      error: {
        message: 'Oj vavoj',
        code: '002',
      },
    })
  })
})

const setup = () => {
  const presentation = Atom.of({})
  const navigator = new NavigatorMock()
  return {
    presentation,
    navigator,
    openOrder: OpenOrder({presentation, navigator})
  }
}
