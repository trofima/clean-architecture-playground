import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {CloseOrder} from './close-order.js'
import {NavigatorMock, NotifierMock} from '../../dependencies/test-utilities.js'
import {OrderPresentation} from '../entities/order-presentation.js'

suite('Close order', () => {
  test('close order form', async () => {
    const {closeOrder, presentation, navigator} = setup()
    presentation.update(() => OrderPresentation.make({data: {}}))

    await closeOrder()

    assert.deepEqual(navigator.close.called, true)
  })

  test('do not close, when has changes and closing is not confirmed', async () => {
    const {closeOrder, presentation, notifier, navigator} = setup()
    presentation.update(() => OrderPresentation.make({
      originalData: {paymentStatus: 'unpaid'},
      data: {paymentStatus: 'paid'},
    }))
    notifier.confirm
      .for('Changes will be lost. Are you sure you want to close this order?', {type: 'warning'})
      .returns(false)

    await closeOrder()

    assert.deepEqual(navigator.close.called, false)
  })

  test('close, when has changes and closing is confirmed', async () => {
    const {closeOrder, presentation, notifier, navigator} = setup()
    presentation.update(() => OrderPresentation.make({
      originalData: {paymentStatus: 'unpaid'},
      data: {paymentStatus: 'paid'},
    }))
    notifier.confirm
      .for('Changes will be lost. Are you sure you want to close this order?', {type: 'warning'})
      .returns(true)

    await closeOrder()

    assert.deepEqual(navigator.close.called, true)
  })
})

const setup = () => {
  const presentation = Atom.of({})
  const navigator = new NavigatorMock()
  const notifier = new NotifierMock()
  return {
    presentation, navigator, notifier,
    closeOrder: CloseOrder({presentation, navigator, notifier})
  }
}
