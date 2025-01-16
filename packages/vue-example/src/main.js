import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import {appNavigator} from './dependencies/navigator.js'
import {routes} from './routes.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})
const app = createApp(App)

appNavigator.use(router)
app.use(router)
app.mount('#app')
