import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {OpenOrder} from './open-order.js'
import {NavigatorError} from '../../dependencies/index.js'
import {NavigatorMock, NotifierMock} from '../../dependencies/test-utilities.js'
import {OrderListPresentation} from '../entities/order-list-presentation.js'

suite('open order', () => {
  test('navigate to order', async () => {
    const {openOrder, navigator, presentation} = setup()
    presentation.init(OrderListPresentation.make({list: [
      OrderListPresentation.makeOrder({id: 'id'}),
      OrderListPresentation.makeOrder({id: 'anotherId'}),
    ]}))

    await openOrder('id')
    assert.deepEqual(navigator.open.lastCall, ['/order?id=id'])

    await openOrder('anotherId')
    assert.deepEqual(navigator.open.lastCall, ['/order?id=anotherId'])
  })

  test('do not navigate to updating order', async () => {
    const {openOrder, navigator, presentation} = setup()
    presentation.init(OrderListPresentation.make({list: [
      OrderListPresentation.makeOrder({id: 'id', updating: true}),
      OrderListPresentation.makeOrder({id: 'anotherId', updating: true}),
    ]}))

    await openOrder('id')
    assert.equal(navigator.open.called, false)

    await openOrder('anotherId')
    assert.equal(navigator.open.called, false)
  })

  test('present error when navigation failed', async () => {
    const {openOrder, navigator, presentation, notifier} = setup()
    presentation.init(OrderListPresentation.make({list: [OrderListPresentation.makeOrder({id: 'id'})]}))

    navigator.open.fails(new NavigatorError('Oj vej', {code: '001'}))
    await openOrder('id')
    assert.deepEqual(notifier.showNotification.lastCall, [{type: 'error', message: 'Oj vej'}])

    navigator.open.fails(new NavigatorError('Oj vavoj', {code: '002'}))
    await openOrder('id')
    assert.deepEqual(notifier.showNotification.lastCall, [{type: 'error', message: 'Oj vavoj'}])
  })
})

const setup = () => {
  const presentation = new Atom()
  const navigator = new NavigatorMock()
  const notifier = new NotifierMock()
  return {
    presentation,
    navigator,
    notifier,
    openOrder: OpenOrder({presentation, navigator, notifier}),
  }
}
