import {OrderList} from '../entities/order-list.js'

export const RemoveOrderFromList = ({presentation, dataStore, notifier}) => async (id) => {
  presentation.update(OrderList.setOrderUpdating, {id, updating: true})

  try {
    await dataStore.remove('order', id)
    presentation.update(OrderList.removeOrder, id)
  } catch ({message}) {
    presentation.update(OrderList.setOrderUpdating, {id, updating: false})
    notifier.showNotification({type: 'error', message})
  }
}
