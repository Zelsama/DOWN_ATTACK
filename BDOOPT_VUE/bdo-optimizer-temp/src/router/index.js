import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EnhacingSimulatorView from '../views/EnhancingSimulatorView.vue'
import ComboBuilder from '@/views/ComboBuilderView.vue'
import AdminView from '@/views/AdminView.vue'
import PvpCalculatorView from '@/views/PvpCalculatorView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/enhancing-simulator',
    name: 'EnhacingSimulatorView',
    component: EnhacingSimulatorView,
    meta: {title: "Enhancing Simulator | BDOptimizer.com"}
  },
  {
    path: "/combo-builder",
    name: 'comboBuilderView',
    component: ComboBuilder,
    meta: {title: "Combo Builder | BDOptimizer.com"}
  },
  {
    path: "/admin",
    name: 'adminView',
    component: AdminView,
    meta: {title: "Admin | BDOptimizer.com"}
  },
  {
    path: "/pvp-calculator",
    name: 'pvpCalculatorView',
    component: PvpCalculatorView,
    meta: {title: "PvP Calculator | BDOptimizer.com"}
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const DEFAULT_TITLE = "BDO Optimizer";

router.afterEach((to,_)=>{
  document.title = to.meta.title || DEFAULT_TITLE;
})

export default router
