export const OrderList = {
  make: ({loading = false, error = undefined, list = [], offset = 0, limit = 0, total = 0} = {}) =>
    ({loading, error, list, offset, limit, total}),
  makeOrder: ({id, createdDate, user, sum, paymentStatus, fulfillmentStatus}) =>
    ({id, createdDate, user, sum, paymentStatus, fulfillmentStatus}),
  getReadOptions: ({offset = 0, limit = 1}) => ({offset, limit}),
  setLoading: (orderList, loading) => ({...orderList, loading}),
  setError: (orderList, {message, code}) => ({
    ...orderList,
    error: !orderList.list.length ? {message, code} : undefined, loading: false,
  }),
  update: (orderList, {total, list}) => ({
    ...orderList,
    total,
    loading: false,
    offset: orderList.offset + list.length,
    list: [...orderList.list, ...list],
  })
}
