import {useEffect, useState, useRef} from 'react'
import {Atom} from '@borshch/utilities';
import {OpenOrder, RenderOrderList, RemoveOrderFromList, UpdateOrderList, presentOrderList} from '@clean-architecture-playground/core'
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../dependencies/router.jsx'
import {OrderListView} from './view.jsx'

// TODO: make super cool integration hook
// TODO: extend presenters

export const OrderList = () => {
  const {controller, viewModel} = useCleanArchitecture()
  
  return <OrderListView viewModel={viewModel} controller={controller} />
}

const useCleanArchitecture = () => {
  const presentation = new Atom()
  const updateOrderList = UpdateOrderList({presentation, dataStore, notifier})
  const renderOrderList = RenderOrderList({presentation, updateOrderList})
  const removeOrderFromList = RemoveOrderFromList({dataStore, notifier, presentation})
  const openOrder = OpenOrder({
    notifier, presentation,
    navigator: appNavigator,
  })

  const [viewModel, setViewModel] = useState({});
  const controller = useRef({})

  useEffect(() => {
    controller.current = {
      initialize: () => renderOrderList(),
      refresh: () => updateOrderList({refresh: true}),
      remove: (event, id) => {
        event.stopPropagation()
        return removeOrderFromList(id);
      },
      loadMore: () => updateOrderList(),
      open: (id) => openOrder(id)
    }

    const unsubscribe = presentation.subscribe((model) => setViewModel(presentOrderList(model)))
    controller.current.initialize()
  	
    return () => unsubscribe();
  }, []);

  return {
    viewModel,
    controller: controller.current,
  }
}
