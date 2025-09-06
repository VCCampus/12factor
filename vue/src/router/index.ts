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
      component: () => import('@/views/GrowthPrinciplesView.vue')
    },
    {
      path: '/flashcards',
      name: 'flashcards', 
      component: () => import('@/views/GrowthFlashcardsView.vue')
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('@/views/GrowthQuizView.vue')
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
          path: ':jobType',
          name: 'job-detail',
          component: () => import('@/components/interview/JobDetail.vue'),
          props: true
        },
        {
          path: ':jobType/:difficulty/quiz',
          name: 'interview-quiz',
          component: () => import('@/components/interview/InterviewQuiz.vue'),
          props: true
        },
        {
          path: ':jobType/:difficulty/result',
          name: 'interview-result',
          component: () => import('@/components/interview/InterviewResult.vue'),
          props: true
        },
        {
          path: ':jobType/:difficulty/review',
          name: 'interview-review',
          component: () => import('@/components/interview/InterviewReview.vue'),
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

// 移动优先重构完成，移除旧路由重定向逻辑
router.beforeEach((to, from, next) => {
  // 可以添加认证检查或其他路由守卫逻辑
  next()
})

export default router