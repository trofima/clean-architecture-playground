import {User} from '../../user/entities/user.js'

export const OrderPresentation = {
  make: ({
    data = { 
      id: '',
      createdDate: '',
      updatedDate: '',
      user: User.make(),
      sum: 0,
      paymentStatus: '',
      fulfillmentStatus: '',
      shippingAddress: '',
    },
    updates = {},
    loading = false,
    error = undefined,
  } = {}) => ({data, updates, loading, error}),

  setData: (order, data) => ({...order, data, loading: false}),

  setFailed: (order, {message, code}) => ({...order, error: {message, code}, loading: false}),

  hasChanges: (order) => Object.keys(order.updates).length > 0,

  updateField: ({updates, ...rest}, {name, value}) => ({
    ...rest,
    updates: rest.data[name] !== value ? {...updates, [name]: value} : omit(updates, name)
  }),
}

const omit = (obj, key) => {
  const {[key]: _, ...rest} = obj
  return rest
}
