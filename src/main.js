import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/style/style.scss'
import 'lib-flexible'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
router.beforeEach((to, form, next) => {
  document.title = to.meta.title
  next()
})

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
