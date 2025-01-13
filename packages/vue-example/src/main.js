import { createApp } from 'vue'
import {createRouter} from 'vue-router'
import App from './App.vue'
import OrderList from './components/OrderList.vue'

const router = createRouter({
  routes: [{
    path: '/',
    component: OrderList,
  }],
})

createApp(App)
  .use(router)
  .mount('#app')
