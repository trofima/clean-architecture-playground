export {OrderList} from './order-list/index.js'
export {Order} from './order/index.js'

import {appNavigator} from './dependencies/navigator.js'

const {pathname, search} = window.location
appNavigator.open(`${pathname}${search}`)
