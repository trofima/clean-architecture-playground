export const OrderList = {
  make: ({list = [], total = 0} = {}) => ({list, total}),

  getList: ({list}) => list,

  getTotal: ({total}) => total,

  getUniqueUserIds: ({list}) => {
    const userIds = list.map(({user}) => user)
    const uniqueUserIds = new Set(userIds)
    return Array.from(uniqueUserIds)
  },

  isEmpty: ({list}) => list.length === 0,
}
