
import {assert} from 'chai'
import {Atom} from '@borshch/utilities'
import {RemoveOrderFromList} from './remove-order-from-list.js'
import {OrderList} from '../entities/order-list.js'
import {DataStoreMock, NotifierMock} from '../../dependencies/test-utilities.js'
import {DataStoreError} from '../../dependencies/index.js'

suite('Remove order from list', () => {
  test('mark an order as updating', async () => {
    const {removeOrderFromList, presentation} = setup()
    presentation.update(() => (OrderList.make({list: [
      OrderList.makeOrder({id: '1', updating: false}),
      OrderList.makeOrder({id: '2', updating: false}),
    ]})))

    const removing = removeOrderFromList('1')
    const anotherRemoving = removeOrderFromList('2')

    const {list} = presentation.get()
    assert.equal(list.at(0).updating, true)
    assert.equal(list.at(1).updating, true)

    await Promise.all([removing, anotherRemoving])
  })

  test('remove order from data store', async () => {
    const {removeOrderFromList, presentation, dataStore} = setup()
    const order1 = OrderList.makeOrder({id: '1'})
    const order2 = OrderList.makeOrder({id: '2'})
    presentation.update(() => (OrderList.make({offset: 2, total: 3, list: [order1, order2]})))

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

  test('do not remove order, when data store operation failed', async () => {
    const {removeOrderFromList, presentation, dataStore} = setup()
    const order = OrderList.makeOrder({id: '1', updating: false})
    presentation.update(() => (OrderList.make({offset: 1, list: [order]})))
    dataStore.remove.fails(new DataStoreError('Oj vej', {code: '001'}))

    await removeOrderFromList('1')

    assert.deepInclude(presentation.get(), {
      list: [order],
      offset: 1,
    })
  })

  test('show notification, when data store operation failed', async () => {
    const {removeOrderFromList, presentation, dataStore, notifier} = setup()
    const order = OrderList.makeOrder({id: '1', updating: false})
    presentation.update(() => (OrderList.make({offset: 1, list: [order]})))

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
