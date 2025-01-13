import {useEffect, useState, useRef} from 'react'
import {useSearchParams} from 'react-router';
import {Atom} from '@borshch/utilities';
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../dependencies/router.jsx';
import {ChangeOrderField, CloseOrder, presentOrder, RenderOrder, SaveOrder} from '@clean-architecture-playground/core';
import {OrderView} from './view.jsx';

export const Order = () => {
  const [urlSearchParams] = useSearchParams()
  const {controller, viewModel} = useCleanArchitecture(urlSearchParams.get('id'))

  return <OrderView viewModel={viewModel} controller={controller} />
}

const useCleanArchitecture = (id) => {
  const presentation = new Atom()
  const renderOrder = RenderOrder({dataStore, presentation})
  const changeOrderField = ChangeOrderField({presentation})
  const closeOrder = CloseOrder({
    presentation, notifier,
    navigator: appNavigator,
  })
  const saveOrder = SaveOrder({
    presentation, notifier,
    navigator: appNavigator,
  })

  const [viewModel, setViewModel] = useState({});
  const controller = useRef({})

  useEffect(() => {
    controller.current = {
      initialize: () => renderOrder(id),
      change: ({target: {name, value}}) => changeOrderField(name, value),
      close: () => closeOrder(),
      save: () => saveOrder(),
    }
    
    const unsubscribe = presentation.subscribe((model) => 
      setViewModel(Object.keys(model.data).length ? presentOrder(model) : model))
    controller.current.initialize()
  	
    return () => unsubscribe();
  }, []);

  return {
    viewModel,
    controller: controller.current,
  }
}
