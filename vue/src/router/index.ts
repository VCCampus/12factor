import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/principles',
      name: 'principles',
      component: () => import('@/views/PrinciplesView.vue')
    },
    {
      path: '/flashcards',
      name: 'flashcards',
      component: () => import('@/views/FlashcardsView.vue')
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('@/views/QuizView.vue')
    },
    {
      path: '/mock-interview',
      name: 'mock-interview',
      component: () => import('@/views/MockInterviewView.vue'),
      children: [
        {
          path: '',
          name: 'interview-home',
          component: () => import('@/components/interview/InterviewHome.vue')
        },
        {
          path: ':difficulty',
          name: 'interview-quiz',
          component: () => import('@/components/interview/InterviewQuiz.vue'),
          props: true
        }
      ]
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/AnalyticsView.vue')
    },
    {
      path: '/achievements',
      name: 'achievements', 
      component: () => import('@/views/GamificationView.vue')
    },
    {
      path: '/export',
      name: 'export',
      component: () => import('@/views/ExportView.vue')
    },
    {
      path: '/thermometer',
      name: 'thermometer',
      component: () => import('@/views/ThermometerView.vue')
    }
  ]
})

export default router