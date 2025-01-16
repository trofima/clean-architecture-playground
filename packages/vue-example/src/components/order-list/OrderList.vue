<template src="./view.html"></template>
<style src="./view.css"></style>

<script>
import {ref, onBeforeMount, onBeforeUnmount} from 'vue'
import OrderListItem from '@/components/order-list/OrderListItem.vue'
import {Atom} from '@borshch/utilities';
import {OpenOrder, RenderOrderList, RemoveOrderFromList, UpdateOrderList, presentOrderList} from '@clean-architecture-playground/core'
import {dataStore, notifier} from '@clean-architecture-playground/core/dummy-dependencies'

const present = (model) => {
  return model.loading && !model.list.length
    ? {
      ...model,
      list: Array(3).fill(undefined).map((_, index) => ({
        id: `placeholder${index}`,
        createdDate: '...',
        user: '...',
        sum: '...',
        paymentStatus: '...',
        fulfillmentStatus: '...',
      })),
    }
    : model
}

export default {
  name: 'OrderList',
  components: {
    OrderListItem
  },
  setup() {
    let unsubscribeFromPresentation
    const controller = ref({})
    const viewModel = ref({})

    onBeforeMount(() => {
      const presentation = new Atom()
      const updateOrderList = UpdateOrderList({presentation, dataStore, notifier})
      const renderOrderList = RenderOrderList({presentation, updateOrderList})
      const removeOrderFromList = RemoveOrderFromList({dataStore, notifier, presentation})
      const openOrder = OpenOrder({
        notifier, presentation,
        navigator: {open: () => {console.log('Vue Navigator is not implemented yet')}},
      })

      controller.value = {
        initialize: () => renderOrderList(),
        refresh: () => updateOrderList({refresh: true}),
        loadMore: () => updateOrderList(),
        remove: () => removeOrderFromList(),
        open: openOrder,
      }

      unsubscribeFromPresentation = presentation.subscribe((model) => {
        viewModel.value = present(presentOrderList(model))
      })

      controller.value.initialize()
    })

    onBeforeUnmount(() => {
      unsubscribeFromPresentation()
    })

    return {
      viewModel,
      controller,
    }
  }
}

</script>
