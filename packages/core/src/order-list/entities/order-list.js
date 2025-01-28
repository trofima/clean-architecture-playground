export const OrderList = {
  make: ({list = [], total = 0} = {}) => ({list, total}),
  getUniqueUserIds: ({list}) => {
    const userIds = list.map(({user}) => user)
    const uniqueUserIds = new Set(userIds)
    return Array.from(uniqueUserIds)
  },
}
