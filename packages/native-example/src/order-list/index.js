import {BorshchComponent} from '@borshch/components'
import {renderOrderListView} from './view.js'

export class OrderList extends BorshchComponent {
  render() {
    return renderOrderListView({list: [], loading: false, error: undefined})
  }
}

export default OrderList.define()