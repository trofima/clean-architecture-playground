import {assert, use} from 'chai'
import {Atom} from '@borshch/utilities'
import {SaveOrder} from './save-order.js'
import {DataStoreMock, NavigatorMock, NotifierMock} from '../../dependencies/test-utilities.js'
import {OrderPresentation} from '../entities/order-presentation.js'
import {Order} from '../entities/order.js'
import {User} from '../../user/entities/user.js'

suite('Save order', () => {
  test('present loader', async () => {
    const {saveOrder, presentation} = setup()

    presentation.update(() => OrderPresentation.make({data: Order.make({id: '1'})}))
    await saveOrder()
    assert.equal(presentation.get().loading, true)
  })

  test('save order to data store', async () => {
    const {saveOrder, dataStore, presentation} = setup()

    const dummyOrder = OrderPresentation.makeData({id: '1', user: User.make({id: 'userId'})})
    presentation.update(() => OrderPresentation.make({data: dummyOrder}))
    await saveOrder()
    assert.deepEqual(dataStore.set.lastCall, ['order', {...dummyOrder, user: 'userId'}])

    const anotherDummyOrder = OrderPresentation.makeData({id: '2', user: User.make({id: 'anotherUserId'})})
    presentation.update(() => OrderPresentation.make({data: anotherDummyOrder}))
    await saveOrder()
    assert.deepEqual(dataStore.set.lastCall, ['order', {...anotherDummyOrder, user: 'anotherUserId'}])
  })

  test('show error notification, when saving failed', async () => {
    const {saveOrder, presentation, dataStore, notifier} = setup()
    presentation.update(() => OrderPresentation.make({data: Order.make({id: '1'})}))

    dataStore.set.fails(new Error('Oj vej'))
    await saveOrder()
    assert.deepEqual(notifier.showNotification.lastCall, [{type: 'error', message: 'Oj vej'}])
    assert.equal(presentation.get().loading, false)

    dataStore.set.fails(new Error('Oj vavoj'))
    await saveOrder()
    assert.deepEqual(notifier.showNotification.lastCall, [{type: 'error', message: 'Oj vavoj'}])
    assert.equal(presentation.get().loading, false)
  })

  test('close order form after successful saving', async () => {
    const {saveOrder, presentation, navigator} = setup()
    presentation.update(() => OrderPresentation.make({data: Order.make({id: '1'})}))

    await saveOrder()

    assert.deepEqual(navigator.close.called, true)
  })
})

const setup = () => {
  const presentation = Atom.of({})
  const dataStore = new DataStoreMock()
  const navigator = new NavigatorMock()
  const notifier = new NotifierMock()
  return {
    presentation, dataStore, navigator, notifier,
    saveOrder: SaveOrder({presentation, dataStore, navigator, notifier})
  }
}
