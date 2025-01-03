import {OrderListPresentation} from '../entities/order-list-presentation.js'

export const UpdateOrderList = ({presentation, dataStore, notifier}) => async ({refresh = false} = {}) => {
  presentation.update(OrderListPresentation.setLoading, true)
  const presentationModel = presentation.get()
  try {
    const readOptions = OrderListPresentation.getReadOptions(presentationModel, {refresh})
    const {list, total} = await dataStore.get('orders', readOptions)
    const uniqueUserIds = new Set(list.map(({user}) => user))
    const users = list.length ? await dataStore.get('users', Array.from(uniqueUserIds)) : []

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
