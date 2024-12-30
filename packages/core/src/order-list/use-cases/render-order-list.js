import {OrderList} from '../entities/order-list.js'
import {Order} from '../entities/order.js'

export const RenderOrderList = ({presentation, dataStore}) => async () => {
  const orderList = OrderList.make({loading: true, limit: 20})
  presentation.update(() => orderList)
  try {
    const readOptions = OrderList.getReadOptions(orderList)
    const {list, total} = await dataStore.get('orders', readOptions)
    const uniqueUserIds = new Set(list.map(({user}) => user))
    const users = list.length ? await dataStore.get('users', Array.from(uniqueUserIds)) : []

    presentation.update((model) => OrderList.make({
      ...model, total,
      offset: list.length,
      list: list.map((order) => Order.make({...order, user: users.find(({id}) => id === order.user)})),
      loading: false,
    }))
  } catch ({message, code}) {
    presentation.update((model) => ({
      ...model,
      loading: false,
      error: {message, code},
    }))
  }
}
