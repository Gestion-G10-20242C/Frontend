import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/user/:username',
      name: 'user',
      component: () => import('../views/UserView.vue'),
    },
    {
      path: '/feed', // Nueva ruta para el feed
      name: 'feed',
      component: () => import('../views/FeedView.vue'), // Importar el nuevo componente
    },
    {
      path: '/follow-users',
      name: 'followUsers',
      component: () => import('../views/FollowUsersView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
    // Catch-all route - redirect to home
      path: '/books',
      name: 'books',
      component: () => import('../views/BooksView.vue'),
    }, // Catch-all route - redirect to home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  await userStore.resetIfExpired()
  next() // continue navigation
})

export default router
