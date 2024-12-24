export const RenderOrderList = ({presentation, dataStore}) => async () => {
  presentation.update(() => ({listing: true, list: [], error: undefined}))
  try {
    const orders = await dataStore.get('orders', {offset: 0, limit: 20})
    const uniqueUserIds = new Set(orders.map(({user}) => user))
    const users = orders.length ? await dataStore.get('users', Array.from(uniqueUserIds)) : []

    presentation.update((model) => ({
      ...model,
      list: orders.map((order) => ({...order, user: users.find(({id}) => id === order.user)})),
      listing: false,
    }))
  } catch (error) {
    presentation.update((model) => ({
      ...model,
      listing: false,
      error: {
        message: error.message,
        code: error.code,
      },
    }))
  }
}
