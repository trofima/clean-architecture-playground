<template src="./view.html"></template>
<style src="./view.css"></style>

<script>
import OrderListItem from '@/components/order-list/OrderListItem.vue'
import {Atom} from '@borshch/utilities';
import {OpenOrder, RenderOrderList, RemoveOrderFromList, UpdateOrderList} from '@clean-architecture-playground/core'
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'
import {appNavigator} from '../../dependencies/navigator.js';
import {useIntegration} from '../../common/integration.js';
import {presentOrderList} from './presenter.js';

const makeOrderListIntegration = () => {
  const presentation = new Atom()
  const updateOrderList = UpdateOrderList({presentation, dataStore, notifier})
  const renderOrderList = RenderOrderList({presentation, updateOrderList})
  const removeOrderFromList = RemoveOrderFromList({dataStore, notifier, presentation})
  const openOrder = OpenOrder({
    notifier, presentation,
    navigator: appNavigator,
  })

  const controller = {
    initialize: () => renderOrderList(),
    refresh: () => updateOrderList({refresh: true}),
    loadMore: () => updateOrderList(),
    remove: removeOrderFromList,
    open: openOrder,
  }

  return {controller, present: presentOrderList, presentation}
}

export default {
  name: 'OrderList',
  components: {
    OrderListItem
  },
  setup() {
    return useIntegration(makeOrderListIntegration)
  },
}

</script>
