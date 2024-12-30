import {OrderList} from '../entities/order-list.js'

export const RenderOrderList = ({presentation, updateOrderList}) => async () => {
  presentation.update(() => OrderList.make({loading: true, limit: 20}))
  updateOrderList()
}
