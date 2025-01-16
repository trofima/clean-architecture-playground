import {OrderList} from './order-list/index.jsx'
import {Order} from './order/index.jsx'

export const routes = [{
  path: '/',
  Component: OrderList,
}, {
  path: '/order',
  Component: Order,
}]