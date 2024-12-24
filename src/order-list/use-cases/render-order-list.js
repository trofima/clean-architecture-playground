/** RenderOrderList()
 * present listing action started
 * get limited amount of orders from external store.
 * present order list:
 * * total count
 * * orders:
 * * * id,
 * * * created date,
 * * * customer name,
 * * * sum,
 * * * payment status,
 * * * fulfillment status,
 *
 * Error: Fetching failed
 * * present listing failure
 * */

export const RenderOrderList = ({presentation, dataStore}) => async () => {
  presentation.update(() => ({listing: true, list: [], error: undefined}))
  try {
    const orders = await dataStore.get('orders', {offset: 0, limit: 20})
    const users = orders.length ? await dataStore.get('users', orders.map(({user}) => user)) : []

    presentation.update((model) => ({
      ...model,
      list: orders.map((order, index) => ({...order, user: users[index]})),
      listing: false,
    }))
  } catch (error) {
    presentation.update(() => ({
      listing: false,
      error: {
        message: error.message,
        code: error.code,
      },
    }))
  }
}
