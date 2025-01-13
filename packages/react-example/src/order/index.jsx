import {useSearchParams} from 'react-router';
import {Atom} from '@borshch/utilities';
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../dependencies/router.jsx';
import {ChangeOrderField, CloseOrder, presentOrder, RenderOrder, SaveOrder} from '@clean-architecture-playground/core';
import {OrderView} from './view.jsx';
import {useCleanArchitecture} from '../common/hooks.js';

export const Order = () => {
  const [urlSearchParams] = useSearchParams()
  const {controller, viewModel} = useCleanArchitecture(makeOrderIntegrator(urlSearchParams.get('id')))

  return <OrderView viewModel={viewModel} controller={controller} />
}

const makeOrderIntegrator = (id) => () => {
  const presentation = new Atom()
  const renderOrder = RenderOrder({dataStore, presentation})
  const changeOrderField = ChangeOrderField({presentation})
  const closeOrder = CloseOrder({
    presentation, notifier,
    navigator: appNavigator,
  })
  const saveOrder = SaveOrder({
    presentation, dataStore, notifier,
    navigator: appNavigator,
  })

  return {
    presentation,
    present: (model) => Object.keys(model.data).length ? presentOrder(model) : model,
    controller: {
      initialize: () => renderOrder(id),
      change: ({target: {name, value}}) => changeOrderField(name, value),
      close: () => closeOrder(),
      save: () => saveOrder(),
    },
  }
}
