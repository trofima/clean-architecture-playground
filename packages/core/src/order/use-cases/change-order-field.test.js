import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {ChangeOrderField} from './change-order-field.js'
import {OrderPresentation} from '../entities/order-presentation.js'

suite('change order field', () => {
  test('update field value', () => {
    const {changeOrderField, presentation} = setup()

    presentation.update(() => OrderPresentation.make({
      data: {paymentStatus: 'unpaid'},
    }))
    changeOrderField('paymentStatus', 'paid')
    assert.deepEqual(presentation.get().data, {paymentStatus: 'paid'})

    presentation.update(() => OrderPresentation.make({
      data: {paymentStatus: 'paid'},
    }))
    changeOrderField('paymentStatus', 'unpaid')
    assert.deepEqual(presentation.get().data, {paymentStatus: 'unpaid'})

    presentation.update(() => OrderPresentation.make({
      data: {fulfillmentStatus: 'pending'},
    }))
    changeOrderField('fulfillmentStatus', 'fulfilled')
    assert.deepEqual(presentation.get().data, {fulfillmentStatus: 'fulfilled'})

    presentation.update(() => OrderPresentation.make({
      data: {fulfillmentStatus: 'fulfilled'},
    }))
    changeOrderField('fulfillmentStatus', 'pending')
    assert.deepEqual(presentation.get().data, {fulfillmentStatus: 'pending'})

    presentation.update(() => OrderPresentation.make({
      data: {paymentStatus: 'unpaid', fulfillmentStatus: 'pending'},
    }))

    changeOrderField('paymentStatus', 'paid')
    changeOrderField('fulfillmentStatus', 'fulfilled')

    assert.deepEqual(presentation.get().data, {
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    })
  })

  test('determine if order has changes', () => {
    const {changeOrderField, presentation} = setup()

    presentation.update(() => OrderPresentation.make({
      data: {paymentStatus: 'unpaid'},
    }))
    changeOrderField('paymentStatus', 'paid')
    assert.equal(presentation.get().hasChanges, true)
    changeOrderField('paymentStatus', 'unpaid')
    assert.equal(presentation.get().hasChanges, false)

    presentation.update(() => OrderPresentation.make({
      data: {paymentStatus: 'unpaid', fulfillmentStatus: 'pending'},
    }))
    changeOrderField('paymentStatus', 'paid')
    changeOrderField('fulfillmentStatus', 'fulfilled')
    changeOrderField('paymentStatus', 'unpaid')
    assert.equal(presentation.get().hasChanges, true)
  })
})

const setup = () => {
  const presentation = new Atom()
  return {
    presentation,
    changeOrderField: ChangeOrderField({presentation})
  }
}
