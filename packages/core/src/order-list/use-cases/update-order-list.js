import {OrderListPresentation} from '../entities/order-list-presentation.js'
import {OrderList} from '../entities/order-list.js'

export const UpdateOrderList = ({presentation, dataStore, notifier}) => async ({refresh = false} = {}) => {
  const presentationModel = presentation.update(OrderListPresentation.setLoading, true)
  try {
    const readOptions = OrderListPresentation.getReadOptions(presentationModel, {refresh})
    const orderList = await dataStore.get('orders', readOptions)
    const uniqueUserIds = OrderList.getUniqueUserIds(orderList)
    const {list, total} = orderList
    const users = list.length ? await dataStore.get('users', uniqueUserIds) : []

    presentation.update(OrderListPresentation.update, {
      refresh, total,
      list: setUsers(list, users),
    })
  } catch (error) {
    const orderCount = presentationModel.list.length
    presentation.update(OrderListPresentation.setError, error)

    if (orderCount) notifier.showNotification({type: 'error', message: error.message})
  }
}

const setUsers = (list, users) => list.map(({user, ...rest}) => OrderListPresentation.makeOrder({
  user: users.find(({id: userId}) => userId === user)?.name,
  ...rest,
}))
