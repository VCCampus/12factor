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
      component: () => import('@/views/PrinciplesView.vue'),
      children: [
        {
          path: '',
          redirect: '/principles/study'
        },
        {
          path: 'study',
          name: 'principles-study',
          component: () => import('@/components/principles/StudyContent.vue')
        },
        {
          path: 'flashcards',
          name: 'principles-flashcards',
          component: () => import('@/components/principles/FlashcardsContent.vue')
        },
        {
          path: 'quiz',
          name: 'principles-quiz',
          component: () => import('@/components/principles/QuizContent.vue')
        }
      ]
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
      path: '/thermometer',
      name: 'thermometer',
      component: () => import('@/views/ThermometerView.vue')
    }
  ]
})

// 处理旧路由的重定向
router.beforeEach((to, from, next) => {
  const deprecatedRoutes: Record<string, string> = {
    '/flashcards': '/principles/flashcards',
    '/quiz': '/principles/quiz',
    '/analytics': '/',
    '/achievements': '/',
    '/export': '/'
  }
  
  if (deprecatedRoutes[to.path]) {
    console.warn(`⚠️ 路由 ${to.path} 已废弃，已重定向到新路径`)
    next(deprecatedRoutes[to.path])
  } else {
    next()
  }
})

export default router