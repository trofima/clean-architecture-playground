import {OrderList} from '../entities/order-list.js'

export const RenderOrderList = ({presentation, updateOrderList}) => async () => {
  presentation.update(() => OrderList.make({loading: false, limit: 5, offset: 0, total: 0, list: []}))
  updateOrderList()
}
