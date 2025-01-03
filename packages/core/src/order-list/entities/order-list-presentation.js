export const OrderListPresentation = {
  make: ({loading = false, error = undefined, list = [], offset = 0, limit = 0, total = 0} = {}) =>
    ({loading, error, list, offset, limit, total}),

  makeOrder: ({id, createdDate, user, sum, paymentStatus, fulfillmentStatus, updating = false}) =>
    ({id, createdDate, user, sum, paymentStatus, fulfillmentStatus, updating}),

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
  }),

  setOrderUpdating: (orderList, {id, updating}) => ({
    ...orderList,
    list: orderList.list.map((order) => order.id === id ? {...order, updating} : order),
  }),

  removeOrder: (orderList, id) => ({
    ...orderList,
    list: orderList.list.filter((order) => order.id !== id),
    offset: orderList.offset - 1,
    total: orderList.total - 1,
  }),
}
