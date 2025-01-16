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
      <button :disabled="updating" @click.stop=remove(id)>
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
    }
  },
  data() {
    return {
      updating: false,
    }
  },
  methods: {
    open(id) {
      console.log(`open Something ${id}`)
    },
    remove(event, id) {
      console.log(`remove Something ${id}`)
    },
  }
}
</script>

<style scoped>

</style>
