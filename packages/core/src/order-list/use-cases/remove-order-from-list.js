import {OrderListPresentation} from '../entities/order-list-presentation.js'

export const RemoveOrderFromList = ({presentation, dataStore, notifier}) => async (id) => {
  try {
    const confirmed = await notifier.confirm('Are you sure you want to remove this order?', {type: 'danger'})
    if (confirmed) {
      presentation.update(OrderListPresentation.setOrderUpdating, {id, updating: true})
      await dataStore.remove('order', id)
      presentation.update(OrderListPresentation.removeOrder, id)
    }
  } catch ({message}) {
    presentation.update(OrderListPresentation.setOrderUpdating, {id, updating: false})
    notifier.showNotification({type: 'error', message})
  }
}
