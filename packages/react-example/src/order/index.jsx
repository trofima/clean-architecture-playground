import {useSearchParams} from 'react-router';
import {Atom} from '@borshch/utilities';
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../dependencies/navigator.js';
import {ChangeOrderField, CloseOrder, RenderOrder, SaveOrder} from '@clean-architecture-playground/core';
import {OrderView} from './view.jsx';
import {useIntegration} from '../common/hooks.js';
import {PresentOrder} from './presenter.js';
import {formatNumber, formatTime} from '../common/formatters.js';

export const Order = () => {
  const [urlSearchParams] = useSearchParams()
  const {controller, viewModel} = useIntegration(makeOrderIntegration, [urlSearchParams])

  return viewModel && <OrderView viewModel={viewModel} controller={controller} />
}

const makeOrderIntegration = (urlSearchParams) => {
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
  const id = urlSearchParams.get('id')

  return {
    presentation,
    present: PresentOrder({formatTime, formatNumber}),
    controller: {
      initialize: () => renderOrder(id),
      change: ({target: {name, value}}) => changeOrderField(name, value),
      close: closeOrder,
      save: saveOrder,
    },
  }
}