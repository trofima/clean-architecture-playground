
import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {RemoveOrderFromList} from './remove-order-from-list.js'
import {OrderListPresentation} from '../entities/order-list-presentation.js'
import {DataStoreMock, NotifierMock} from '../../dependencies/test-utilities.js'
import {DataStoreError} from '../../dependencies/index.js'

suite('Remove order from list', () => {
  test('ask for removal confirmation', async () => {
    const {removeOrderFromList, presentation, notifier} = setup()
    presentation.update(() => (OrderListPresentation.make({list: [OrderListPresentation.makeOrder({id: '1'})]})))

    await removeOrderFromList('1')

    assert.deepEqual(notifier.confirm.lastCall, ['Are you sure you want to remove this order?', {type: 'danger'}])
  })

  test('mark order as updating', async () => {
    const {removeOrderFromList, presentation, notifier, dataStore} = setup()
    presentation.update(() => (OrderListPresentation.make({list: [
      OrderListPresentation.makeOrder({id: '1', updating: false}),
      OrderListPresentation.makeOrder({id: '2', updating: false}),
    ]})))
    notifier.confirm.defer()
    dataStore.remove.defer()

    removeOrderFromList('1')
    removeOrderFromList('2')
    await notifier.confirm.resolve(0, true)
    await notifier.confirm.resolve(1, true)

    const {list: [order1, order2]} = presentation.get()
    assert.equal(order1.updating, true)
    assert.equal(order2.updating, true)

    await Promise.all([dataStore.remove.resolve(0), dataStore.remove.resolve(1)])
  })

  test('remove order, when confirmed', async () => {
    const {removeOrderFromList, presentation, dataStore, notifier} = setup()
    const order1 = OrderListPresentation.makeOrder({id: '1'})
    const order2 = OrderListPresentation.makeOrder({id: '2'})
    presentation.update(() => (OrderListPresentation.make({offset: 2, total: 3, list: [order1, order2]})))
    notifier.confirm.returns(true)

    await removeOrderFromList('1')

    assert.deepEqual(dataStore.remove.lastCall, ['order', '1'])
    assert.deepInclude(presentation.get(), {
      list: [order2],
      offset: 1,
      total: 2,
    })

    await removeOrderFromList('2')

    assert.deepEqual(dataStore.remove.lastCall, ['order', '2'])
    assert.deepInclude(presentation.get(), {
      list: [],
      offset: 0,
      total: 1,
    })
  })

  test('do not remove order, when not confirmed', async () => {
    const {removeOrderFromList, presentation, dataStore, notifier} = setup()
    notifier.confirm.returns(false)
    const order = OrderListPresentation.makeOrder({id: '1'})
    presentation.update(() => (OrderListPresentation.make({offset: 1, total: 2, list: [order]})))

    await removeOrderFromList('1')

    assert.deepEqual(dataStore.remove.called, false)
    assert.deepInclude(presentation.get(), {
      list: [order],
      offset: 1,
      total: 2,
    })
  })

  test('do not remove order, when data store operation failed', async () => {
    const {removeOrderFromList, presentation, dataStore} = setup()
    const order = OrderListPresentation.makeOrder({id: '1', updating: false})
    presentation.update(() => (OrderListPresentation.make({offset: 1, list: [order]})))
    dataStore.remove.fails(new DataStoreError('Oj vej', {code: '001'}))

    await removeOrderFromList('1')

    assert.deepInclude(presentation.get(), {
      list: [order],
      offset: 1,
    })
  })

  test('show notification, when data store operation failed', async () => {
    const {removeOrderFromList, presentation, dataStore, notifier} = setup()
    const order = OrderListPresentation.makeOrder({id: '1', updating: false})
    presentation.update(() => (OrderListPresentation.make({offset: 1, list: [order]})))
    notifier.confirm.returns(true)

    dataStore.remove.fails(new DataStoreError('Oj vej', {code: '001'}))
    await removeOrderFromList('1')
    assert.deepEqual(notifier.showNotification.lastCall, [{type: 'error', message: 'Oj vej'}])

    dataStore.remove.fails(new DataStoreError('Oj vavoj', {code: '100'}))
    await removeOrderFromList('1')
    assert.deepEqual(notifier.showNotification.lastCall, [{type: 'error', message: 'Oj vavoj'}])
  })
})

const setup = () => {
  const presentation = Atom.of({})
  const dataStore = new DataStoreMock()
  const notifier = new NotifierMock()

  return {
    presentation,
    dataStore,
    notifier,
    removeOrderFromList: RemoveOrderFromList({presentation, dataStore, notifier}),
  }
}
