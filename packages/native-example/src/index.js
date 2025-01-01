export {OrderList as default} from './order-list/index.js'

import {AppNavigator} from './dependencies/index.js'

const appNavigator = new AppNavigator()
appNavigator.open(window.location.pathname)
