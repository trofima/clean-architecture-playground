import {useSearchParams} from 'react-router';
import {Atom} from '@borshch/utilities';
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../dependencies/navigator.jsx';
import {ChangeOrderField, CloseOrder, RenderOrder, SaveOrder} from '@clean-architecture-playground/core';
import {OrderView} from './view.jsx';
import {useIntegration} from '../common/hooks.js';
import {presentOrder} from './presenter.js';

export const Order = () => {
  const [urlSearchParams] = useSearchParams()
  const {controller, viewModel} = useIntegration(makeOrderIntegration, urlSearchParams.get('id'))

  return viewModel && <OrderView viewModel={viewModel} controller={controller} />
}

const makeOrderIntegration = (id) => {
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
    present: presentOrder,
    controller: {
      initialize: () => renderOrder(id),
      change: ({target: {name, value}}) => changeOrderField(name, value),
      close: () => closeOrder(),
      save: () => saveOrder(),
    },
  }
}
