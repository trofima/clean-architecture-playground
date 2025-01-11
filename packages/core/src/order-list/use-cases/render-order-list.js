import {OrderListPresentation} from '../entities/order-list-presentation.js'

export const RenderOrderList = ({presentation, updateOrderList}) => async () => {
  presentation.update(() => OrderListPresentation.make({loading: false, limit: 5, offset: 0, total: 0, list: []}))
  await updateOrderList()
}
