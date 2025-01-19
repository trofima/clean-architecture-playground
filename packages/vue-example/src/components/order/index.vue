<template src="./view.html"></template>
<style scoped src="./view.css"></style>

<script>
import { ref, onMounted } from 'vue';
import { Atom } from '@borshch/utilities';
import { useRoute } from 'vue-router';
import { ChangeOrderField, CloseOrder, RenderOrder, SaveOrder } from '@clean-architecture-playground/core';
import { dataStore, notifier } from '@clean-architecture-playground/core/dummy-dependencies';
import { appNavigator } from '../../dependencies/navigator.js';

export default {
    name: 'Order',
    setup() {
        const presentation = new Atom();
        const route = useRoute();
        const orderId = ref(route.query.id); // Make it reactive

        const viewModel = ref({
            loading: false,
            error: null,
            order: {
                id: `placeholder${orderId.value}`,
                createdDate: '...',
                updatedDate: '...',
                user: '...',
                sum: '...',
                paymentStatus: '...',
                fulfillmentStatus: '...',
                shippingAddress: '...'
            },
        });

        const renderOrder = RenderOrder({ presentation, dataStore });
        const changeOrderField = ChangeOrderField({ presentation });
        const closeOrder = CloseOrder({ presentation, navigator: appNavigator, notifier });
        const saveOrder = SaveOrder({ presentation, dataStore, navigator: appNavigator, notifier });

        const controller = {
            initialize: () => renderOrder(orderId.value), // Use `.value`
            change: changeOrderField,
            close: closeOrder,
            save: saveOrder,
        };

        onMounted(async () => {
            try {
                const orderData = await renderOrder(orderId.value); // Ensure `await`
                viewModel.value = orderData; // Correctly update `viewModel`
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        });

        return {
            controller,
            viewModel,
        };
    },
};
</script>