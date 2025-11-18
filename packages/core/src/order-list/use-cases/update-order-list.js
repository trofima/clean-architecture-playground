import {OrderListPresentation} from '../entities/order-list-presentation.js'
import {OrderList} from '../entities/order-list.js'

export const UpdateOrderList = ({presentation, dataStore, notifier}) => async ({refresh = false} = {}) => {
  const presentationModel = presentation.update(OrderListPresentation.setLoading, true)
  try {
    const readOptions = OrderListPresentation.getReadOptions(presentationModel, {refresh})
    const orderList = await dataStore.get('orders', readOptions)
    const uniqueUserIds = OrderList.getUniqueUserIds(orderList)
    const users = !OrderList.isEmpty(orderList) ? await dataStore.get('users', uniqueUserIds) : []

    presentation.update(OrderListPresentation.update, {
      refresh,
      total: OrderList.getTotal(orderList),
      list: mapUsers(orderList, users),
    })
  } catch (error) {
    presentation.update(OrderListPresentation.setError, error)
    if (OrderListPresentation.hasOrders(presentationModel))
      notifier.showNotification({type: 'error', message: error.message})
  }
}

const mapUsers = (orderList, users) => OrderList.getList(orderList)
  .map(({user, ...rest}) => OrderListPresentation.makeOrder({
    user: users.find(({id: userId}) => userId === user)?.name,
    ...rest,
  }))
