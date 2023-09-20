import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'


const routes:Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'board',
      component: () => import('@/views/board.vue')
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
