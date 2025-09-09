import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/styles.css'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomeView.vue')
  },
  {
    path: '/principles',
    name: 'Principles', 
    component: () => import('./views/GrowthPrinciplesView.vue')
  },
  {
    path: '/flashcards',
    name: 'Flashcards',
    component: () => import('./views/GrowthFlashcardsView.vue')
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: () => import('./views/GrowthQuizView.vue')
  },
  {
    path: '/interview',
    name: 'Interview', 
    component: () => import('./views/MockInterviewView.vue')
  },
  {
    path: '/thermometer',
    name: 'Thermometer',
    component: () => import('./views/ThermometerView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')