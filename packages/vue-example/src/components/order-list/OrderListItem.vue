<template>
  <li :class="{'order-item grid-line': true, updating: itemData.updating}" @click=controller.open(itemData.id)>
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
      <button :disabled="itemData.updating" @click.stop=controller.remove(itemData.id)>
        <img src="../../assets/delete.svg" alt="Delete order button" />
      </button>
    </div>
  </li>
</template>

<script>
export default {
  name: 'OrderListItem',
  props: {
    itemData: {
      required: true,
      type: Object
    },
    controller: {
      required: true,
      type: Object,
    }
  },
};
</script>

<style></style>
