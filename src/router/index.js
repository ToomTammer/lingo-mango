import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import SportAndGameWord from '../components/SportAndGameWordView.vue'
// import PageLoader from '../views/PageLoader.vue'

const routes = [
  {
    path: '/',
    name: 'First',
    component: HomeView
  },
  {
    path: '/Home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "category" */ '../components/HomeView.vue')
  },
  {
    path: '/SportAndGameWord',
    name: 'SportAndGameWord',
    component: SportAndGameWord
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
