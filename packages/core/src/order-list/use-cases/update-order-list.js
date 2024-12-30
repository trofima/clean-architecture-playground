import {OrderList} from '../entities/order-list.js'
import {Order} from '../entities/order.js'

export const UpdateOrderList = ({presentation, dataStore, notifier}) => async () => {
  const presentationModel = presentation.get()
  try {
    const readOptions = OrderList.getReadOptions(presentationModel)
    const {list, total} = await dataStore.get('orders', readOptions)
    const uniqueUserIds = new Set(list.map(({user}) => user))
    const users = list.length ? await dataStore.get('users', Array.from(uniqueUserIds)) : []

    presentation.update((model) => OrderList.make({
      ...model, total,
      offset: readOptions.offset + list.length,
      list: list.map((order) => Order.make({...order, user: users.find(({id}) => id === order.user)})),
      loading: false,
    }))
  } catch ({message, code}) {
    const orderCount = presentationModel.list.length
    presentation.update((model) => ({
      ...model,
      loading: false,
      error: !orderCount ? {message, code} : undefined,
    }))

    if (orderCount) notifier.showNotification({type: 'error', message})
  }
}