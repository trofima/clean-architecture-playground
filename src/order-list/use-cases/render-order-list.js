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

export const RenderOrderList = ({presentation}) => () => {
  presentation.update(() => ({listing: true}))
}
