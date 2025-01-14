import {Atom} from '@borshch/utilities';
import {OpenOrder, RenderOrderList, RemoveOrderFromList, UpdateOrderList} from '@clean-architecture-playground/core'
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../dependencies/navigator.jsx'
import {OrderListView} from './view.jsx'
import {useIntegration} from '../common/hooks.js';
import {presentOrderList} from './presenter.js';

export const OrderList = () => {
  const {controller, viewModel} = useIntegration(makeOrderListIntegration)
  
  return viewModel && <OrderListView viewModel={viewModel} controller={controller} />
}

const makeOrderListIntegration = () => {
  const presentation = new Atom()
  const updateOrderList = UpdateOrderList({presentation, dataStore, notifier})
  const renderOrderList = RenderOrderList({presentation, updateOrderList})
  const removeOrderFromList = RemoveOrderFromList({dataStore, notifier, presentation})
  const openOrder = OpenOrder({
    notifier, presentation,
    navigator: appNavigator,
  })

  return {
    presentation,
    present: presentOrderList,
    controller: {
      initialize: () => renderOrderList(),
      refresh: () => updateOrderList({refresh: true}),
      remove: (event, id) => {
        event.stopPropagation()
        return removeOrderFromList(id);
      },
      loadMore: () => updateOrderList(),
      open: (id) => openOrder(id)
    },
  }
}
