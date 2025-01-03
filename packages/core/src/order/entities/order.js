export const Order = {
  make: ({
    id = '',
    createdDate = '',
    updatedDate = '',
    user = '',
    sum = 0,
    paymentStatus = '',
    fulfillmentStatus = '',
    shippingAddress = '',
  } = {}) => ({
    id, createdDate, updatedDate, user, sum, paymentStatus, fulfillmentStatus, shippingAddress,
  }),
}