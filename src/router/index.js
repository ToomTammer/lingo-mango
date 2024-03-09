import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import GameWordView from '../components/GameWordView.vue'
import CategoryView from '../components/CategoryView.vue'
import ReportView from '../components/ReportView.vue'
import GameConversationView from '../components/GameConversationView.vue'
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
    path: '/Category',
    name: 'Category',
    component: CategoryView
  },
  {
    path: '/SportsAndGameWords',
    name: 'SporstAndGameWords',
    component: GameWordView
  },
  {
    path: '/Report',
    name: 'Report',
    component: ReportView
  },
  {
    path: '/SportsAndGameConversation',
    name: 'SportsAndGameConversation',
    component: GameConversationView
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
