import {OrderList} from '../entities/order-list.js'

export const RemoveOrderFromList = ({presentation, dataStore, notifier}) => async (id) => {
  try {
    const confirmed = await notifier.confirm('Are you sure you want to remove this order?', {type: 'danger'})
    if (confirmed) {
      presentation.update(OrderList.setOrderUpdating, {id, updating: true})
      await dataStore.remove('order', id)
      presentation.update(OrderList.removeOrder, id)
    }
  } catch ({message}) {
    presentation.update(OrderList.setOrderUpdating, {id, updating: false})
    notifier.showNotification({type: 'error', message})
  }
}
