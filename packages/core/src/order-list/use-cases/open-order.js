export const OpenOrder = ({presentation, navigator, notifier}) => async (id) => {
  const {list} = presentation.get()
  const order = list.find((order) => order.id === id)
  if (!order.updating) {
    try {
      await navigator.open(`/order?id=${id}`)
    } catch (error) {
      notifier.showNotification({type: 'error', message: error.message})
    }
  }
}
