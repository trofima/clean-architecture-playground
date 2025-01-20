<template src="./view.html"></template>
<style scoped src="./view.css"></style>

<script>
import {Atom} from '@borshch/utilities'
import {useRoute} from 'vue-router'
import {ChangeOrderField, CloseOrder, RenderOrder, SaveOrder} from '@clean-architecture-playground/core'
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../../dependencies/navigator.js'
import {useIntegration} from '../../common/integration.js'
import {presentOrder} from './presenter.js'

const makeOrderIntegration = (orderId) => {
  const presentation = new Atom()
  const renderOrder = RenderOrder({presentation, dataStore})
  const changeOrderField = ChangeOrderField({presentation})
  const closeOrder = CloseOrder({presentation, navigator: appNavigator, notifier})
  const saveOrder = SaveOrder({presentation, dataStore, navigator: appNavigator, notifier})

  const controller = {
    initialize: () => renderOrder(orderId),
    change: ({currentTarget: {name, value}}) => changeOrderField(name, value),
    close: closeOrder,
    save: saveOrder,
 }

  return {
    controller, 
    presentation,
    present: presentOrder, 
  }
}

export default {
    name: 'Order',
    setup() {
      const route = useRoute()
      const orderId = route.query.id

      return useIntegration(makeOrderIntegration, orderId)
   },
}
</script>