export const SaveOrderAndUpdateList = ({presentation, saveOrder, updateOrderInList}) => async () => {
  await saveOrder()
  const {error, data: {id, paymentStatus, fulfillmentStatus, shippingAddress}} = presentation.get()
  if (!error) await updateOrderInList(id, {paymentStatus, fulfillmentStatus, shippingAddress})
}
