export {OrderList} from './order-list/index.js'
export {Order} from './order/index.js'

import {appNavigator} from './dependencies/index.js'

appNavigator.open(window.location.pathname)
