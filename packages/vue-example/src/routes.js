import OrderList from './components/order-list/index.vue'

export const routes = [{
  path: '/',
  name: 'OrderList',
  component: OrderList,
}, {
  path: '/order' ,
  name: 'OrderItem',
  // route level code-splitting
  // this generates a separate chunk (OrderList.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import('./components/order/index.vue'),
}]