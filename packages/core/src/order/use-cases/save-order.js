import {OrderPresentation} from '../entities/order-presentation.js'

export const SaveOrder = ({presentation, dataStore, navigator, notifier}) => async () => {
  presentation.update(OrderPresentation.setLoading, true)
  try {
    const {data} = presentation.get()
    await dataStore.set('order', {...data, user: data.user.id})
    await navigator.close()
  } catch (error) {
    presentation.update(OrderPresentation.setLoading, false)
    await notifier.showNotification({type: 'error', message: error.message})
  }
}
