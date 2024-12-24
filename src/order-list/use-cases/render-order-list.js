import {OrderList} from '../entities/order-list.js'

export const RenderOrderList = ({presentation, dataStore}) => async () => {
  const orderList = OrderList.make({loading: true, limit: 20})
  presentation.update(() => orderList)
  try {
    const readOptions = OrderList.readOptions(orderList)
    const {list, offset, total} = await dataStore.get('orders', readOptions)
    const uniqueUserIds = new Set(list.map(({user}) => user))
    const users = list.length ? await dataStore.get('users', Array.from(uniqueUserIds)) : []

    presentation.update((model) => ({
      ...model, offset, total,
      list: list.map((order) => ({...order, user: users.find(({id}) => id === order.user)})),
      loading: false,
    }))
  } catch (error) {
    presentation.update((model) => ({
      ...model,
      loading: false,
      error: {
        message: error.message,
        code: error.code,
      },
    }))
  }
}
