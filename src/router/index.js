import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/index.vue'
import Chart from '@/views/chart.vue'
const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
      title: '自选基金'
    }
  },
  {
    path: '/chart',
    name: 'Chart',
    component: Chart,
    meta: {
      title: '图表'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
