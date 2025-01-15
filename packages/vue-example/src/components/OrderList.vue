<template>
  <div class="order-list-page">
    <div class="order-page-header">
      <h1>Order List</h1>
      <button class="add-order-button" @click="controller.refresh">Refresh order list</button>
    </div>
    <p>Total order count: <span>{{viewModel.total}}</span></p>

    <div class="head-of-list">
      <div>
        <p>User Name</p>
      </div>
      <div class="create-date">
        <p>Create Date</p>
      </div>
      <div class="sum">
        <p>Sum</p>
      </div>
      <div class="payment-status">
        <p>Payment Status</p>
      </div>
      <div class="fulfillment-status">
        <p>Fulfillment Status</p>
      </div>
    </div>

    <ul class="order-list">
      <template v-if="viewModel.error">
        <p>Error: {{ viewModel.error.message }}; Code: {{ viewModel.error.code }}</p>
      </template>
      <template v-else>
        <order-list-item v-for="(order, index) in viewModel.list" :key="order.id" :itemIndex="index" :itemData="order"></order-list-item>
      </template>
    </ul>
    <button class="add-order-button" @click="controller.loadMore" :disabled="viewModel.loading">
      {{viewModel.loading ? '...' : 'LoadMore'}}
    </button>
  </div>
</template>

<script>
import {ref, onBeforeMount, onBeforeUnmount} from 'vue'
import OrderListItem from '@/components/OrderListItem.vue'
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
        remove: removeOrderFromList,
        open: openOrder,
      }

      unsubscribeFromPresentation = presentation.subscribe((model) => {
        viewModel.value = present(model)
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

<style lang="scss">
div.order-list-page {
  --baseline: 15px;
  --option-transition-time: 0.3s;

  width: 100svw;
  padding: var(--baseline) calc(var(--baseline)*3);
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;

  > div.order-page-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: calc(var(--baseline)*2);
    color: rgba(0, 0, 0, 1);

    > button.add-order-button {
      padding: var(--baseline);
      border-radius: calc(var(--baseline)/2);
      font-size: var(--baseline);
      font-weight: 600;
      color: rgba(0, 0, 0, 1);
    }
  }
}

div.head-of-list,
ul.order-list > div.list > li.order-item {
  height: fit-content;
  padding: calc(var(--baseline)/3) var(--baseline);

  display: grid;
  grid-template-columns: repeat(2, 3fr) 2fr repeat(2, 3fr) 1fr;
  grid-gap: var(--baseline);
  justify-content: flex-start;
  align-items: center;

  > div {
    height: fit-content;
    width: 100%;

    > p {
      height: fit-content;
      width: 100%;
      padding: 0;
      margin: 0;

      align-content: center;
      white-space: nowrap;
      user-select: none;
      pointer-events: none;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

div.head-of-list {
  > div {
    > p {
      font-size: var(--baseline);
      font-weight: 600;
      color: rgba(0, 0, 0, 1);
      opacity: 0.5;
    }
  }
}

ul.order-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;

  > div.list > li.order-item {
    width: 100%;
    padding: calc(var(--baseline)/3) var(--baseline);

    background-color: rgba(0, 0, 0, 0);
    transition: background-color var(--option-transition-time) ease;
    box-sizing: border-box;

    > div {
      > p {
        height: calc(var(--baseline)*2);

        font-size: var(--baseline);
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
      }

      > button {
        margin-right: 0;
        padding: 0;
        background-color: rgba(0, 0, 0, 0);
        border-radius: 5px;
        border: none;
        transition: background-color var(--option-transition-time) ease;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        > img {
          height: calc(var(--baseline)*2);
        }
      }

      &.delete-button {
        display: flex;
        justify-content: end;
      }
    }
  }

  > div.list > li.order-item:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  > div.list > li.order-item.updating {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style>
