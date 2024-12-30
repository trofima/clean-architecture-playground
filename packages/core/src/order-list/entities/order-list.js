export const OrderList = {
  make: ({loading = false, error = undefined, list = [], offset = 0, limit = 0, total = 0} = {}) =>
    ({loading, error, list, offset, limit, total}),
  getReadOptions: ({offset = 0, limit = 1}) => ({offset, limit}),
}
