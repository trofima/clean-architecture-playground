import {User} from '../../user/entities/user.js'

export const Order = {
  make: ({
    id = '',
    createdDate = '',
    updatedDate = '',
    user = User.make(),
    sum = 0,
    paymentStatus = '',
    fulfillmentStatus = '',
  } = {}) => ({id, createdDate, updatedDate, user, sum, paymentStatus, fulfillmentStatus}),
}
