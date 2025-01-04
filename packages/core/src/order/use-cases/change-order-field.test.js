import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {ChangeOrderField} from './change-order-field.js'
import {OrderPresentation} from '../entities/order-presentation.js'

suite('change order field', () => {
  test('add changed field to order updates', () => {
    const {changeOrderField, presentation} = setup()

    presentation.update(() => OrderPresentation.make({
      data: {paymentStatus: 'unpaid'},
      updates: {},
    }))
    changeOrderField('paymentStatus', 'paid')
    assert.deepEqual(presentation.get().updates, {paymentStatus: 'paid'})

    presentation.update(() => OrderPresentation.make({
      data: {paymentStatus: 'paid'},
      updates: {},
    }))
    changeOrderField('paymentStatus', 'unpaid')
    assert.deepEqual(presentation.get().updates, {paymentStatus: 'unpaid'})

    presentation.update(() => OrderPresentation.make({
      data: {fulfillmentStatus: 'pending'},
      updates: {},
    }))
    changeOrderField('fulfillmentStatus', 'fulfilled')
    assert.deepEqual(presentation.get().updates, {fulfillmentStatus: 'fulfilled'})

    presentation.update(() => OrderPresentation.make({
      data: {fulfillmentStatus: 'fulfilled'},
      updates: {},
    }))
    changeOrderField('fulfillmentStatus', 'pending')
    assert.deepEqual(presentation.get().updates, {fulfillmentStatus: 'pending'})
  })

  test('keep previously changed field', () => {
    const {changeOrderField, presentation} = setup()
    presentation.update(() => OrderPresentation.make({
      data: {paymentStatus: 'unpaid', fulfillmentStatus: 'pending'},
      updates: {},
    }))

    changeOrderField('paymentStatus', 'paid')
    changeOrderField('fulfillmentStatus', 'fulfilled')

    assert.deepEqual(presentation.get().updates, {
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    })
  })

  test('remove unchanged field from updates', () => {
    const {changeOrderField, presentation} = setup()
    presentation.update(() => OrderPresentation.make({
      data: {paymentStatus: 'unpaid'},
      updates: {},
    }))

    changeOrderField('paymentStatus', 'paid')
    changeOrderField('paymentStatus', 'unpaid')

    assert.deepEqual(presentation.get().updates, {})
  })
})

const setup = () => {
  const presentation = Atom.of({})
  return {
    presentation,
    changeOrderField: ChangeOrderField({presentation})
  }
}
