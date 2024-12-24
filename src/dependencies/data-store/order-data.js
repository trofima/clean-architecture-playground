export const OrderData = {
  make: ({
    id = '',
    createdDate = '',
    updatedDate = '',
    user = '',
    sum = 0,
    paymentStatus = '',
    fulfillmentStatus = '',
  } = {}) => ({id, createdDate, updatedDate, user, sum, paymentStatus, fulfillmentStatus}),
}