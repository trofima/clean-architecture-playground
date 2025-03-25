import {OrderListPresentation} from '../entities/order-list-presentation.js'

export const UpdateOrderInList = ({presentation}) => async (id, updates) => {
  presentation.update(OrderListPresentation.updateOrder, {id, updates})
}
