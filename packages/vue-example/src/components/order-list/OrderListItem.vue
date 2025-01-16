<template>
  <li :class="{'order-item grid-line': true, updating: itemData.updating}" @click=open(itemData.id)>
    <div>
      <p>{{ itemData.user }}</p>
    </div>
    <div>
      <p>{{ itemData.createdDate }}</p>
    </div>
    <div>
      <p>{{ itemData.sum }}</p>
    </div>
    <div>
      <p>{{ itemData.paymentStatus }}</p>
    </div>
    <div>
      <p>{{ itemData.fulfillmentStatus }}</p>
    </div>
    <div className="delete-button">
      <button :disabled="updating" @click.stop=remove(itemData.id)>
        <img src="../../assets/delete.svg" alt="Delete order button" />
      </button>
    </div>
  </li>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'OrderListItem',
  props: {
    itemData: {
      required: true,
      type: Object
    }
  },
  setup(props, { emit }) {
    const updating = ref(false);

    const open = (id) => {
      emit('open-order', id);
      console.log(`Open Something ${id}`);
    };

    const remove = (id) => {
      emit('remove-order', id);
    };

    return {
      updating,
      open,
      remove
    };
  }
});
</script>

<style scoped>

</style>
