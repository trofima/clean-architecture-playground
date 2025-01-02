export const OrderList = {
  make: ({loading = false, error = undefined, list = [], offset = 0, limit = 0, total = 0} = {}) =>
    ({loading, error, list, offset, limit, total}),
  makeOrder: ({id, createdDate, user, sum, paymentStatus, fulfillmentStatus}) =>
    ({id, createdDate, user, sum, paymentStatus, fulfillmentStatus}),
  getReadOptions: ({offset = 0, limit = 1}, {refresh = false} = {}) =>
    refresh ? {offset: 0, limit: offset} : {offset, limit},
  setLoading: (orderList, loading) => ({...orderList, loading}),
  setError: (orderList, {message, code}) => ({
    ...orderList,
    error: !orderList.list.length ? {message, code} : undefined, loading: false,
  }),
  update: (orderList, {total, list, refresh = false}) => ({
    ...orderList,
    total,
    loading: false,
    offset: refresh ? orderList.offset : orderList.offset + list.length,
    list: refresh ? list : [...orderList.list, ...list],
  })
}
