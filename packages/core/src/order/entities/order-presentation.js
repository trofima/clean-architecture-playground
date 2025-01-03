import {User} from '../../user/entities/user.js'

export const OrderPresentation = {
  make: ({
    id = '',
    createdDate = '',
    updatedDate = '',
    user = User.make(),
    sum = 0,
    paymentStatus = '',
    fulfillmentStatus = '',
    shippingAddress = '',
    changes = {},
  } = {}) => ({
    id, createdDate, updatedDate, user, sum, paymentStatus, fulfillmentStatus, shippingAddress, changes,
  }),
}
