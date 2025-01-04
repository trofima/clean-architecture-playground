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
    originalData = {...data},
    loading = false,
    error = undefined,
  } = {}) => ({data, loading, error, originalData, hasChanges: hasChanges(data, originalData)}),

  setData: (order, data) => ({...order, data, originalData: {...data}, loading: false}),

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
