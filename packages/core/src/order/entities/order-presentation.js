import {User} from '../../user/entities/user.js'

export const OrderPresentation = {
  make: ({
    data = {},
    originalData = {...data},
    loading = false,
    error = undefined,
  } = {}) => ({data, loading, error, originalData, hasChanges: hasChanges(data, originalData)}),

  makeData: ({
    id = '',
    createdDate = '',
    updatedDate = '',
    user = User.make(),
    sum = 0,
    paymentStatus = '',
    fulfillmentStatus = '',
    shippingAddress = '',
  }) => ({id, createdDate, updatedDate, user, sum, paymentStatus, fulfillmentStatus, shippingAddress}),

  setData: (order, data) => ({...order, data, originalData: {...data}, loading: false}),

  setLoading: (order, loading) => ({...order, loading}),

  setFailed: (order, {message, code}) => ({...order, error: {message, code}, loading: false}),

  updateField: ({data, ...rest}, {name, value}) => {
    const updatedData = {...data, [name]: value}
    return ({
      ...rest,
      data: updatedData,
      hasChanges: hasChanges(updatedData, rest.originalData)
    })
  },
}

const hasChanges = (data, originalData) => {
  for (const [key, value] of Object.entries(data))
    if (value !== originalData[key]) return true
  return false
}
