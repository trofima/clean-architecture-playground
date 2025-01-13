import { createBrowserRouter } from 'react-router';
import {OrderList} from '../order-list/index.jsx';
import {Order} from '../order/index.jsx';

const routes = [
  {
    path: '/',
    Component: OrderList,
  },
  {
    path: '/order',
    Component: Order,
  },
];

export const router = createBrowserRouter(routes);

export class AppNavigator {
  constructor({router}) {
    this.#router = router
    this.#history.push(router.state.location.path)
  }

  open(path) {
    this.#router.navigate(path)
    this.#history.push(path)
  }

  close() {
    if (this.#history.length > 1) this.#router.navigate(-1)
    else this.open('/')
  }

  #history = []
  #router
}

export const appNavigator = new AppNavigator({router})
