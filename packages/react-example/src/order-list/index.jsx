import {useEffect, useState, useRef} from 'react'
import {OrderListView} from './view.jsx'
import {Atom} from '@borshch/utilities';
import {OpenOrder, RenderOrderList, RemoveOrderFromList, UpdateOrderList, presentOrderList} from '@clean-architecture-playground/core'
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'

export const OrderList = () => {
  const [viewModel, setViewModel] = useState({});
  const controller = useRef({})

  useEffect(() => {
    const presentation = new Atom()
    const updateOrderList = UpdateOrderList({presentation, dataStore, notifier})
    const renderOrderList = RenderOrderList({presentation, updateOrderList})
    const removeOrderFromList = RemoveOrderFromList({dataStore, notifier, presentation})
    const openOrder = OpenOrder({
      notifier, presentation,
      // navigator: appNavigator, // TODO: use some react router
    })
    controller.current = {
      refresh: () => updateOrderList({refresh: true}),
      remove: (event, id) => {
        event.stopPropagation()
        return removeOrderFromList(id);
      },
      open: (event) => {
        // return openOrder(id);
      }
    }
    const unsubscribe = presentation.subscribe(setViewModel)
    renderOrderList()
  	return () => unsubscribe();
  }, []);
  return <OrderListView viewModel={viewModel} controller={controller.current} />
}