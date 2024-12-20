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
      path: '/user/:username/booklists',
      name: 'BookListsView',
      component: () => import('../views/BookListsView.vue'),
      props: true,
    },
    {
      path: '/user/:username/booklists/:name',
      name: 'BookListView',
      component: () => import('../views/BookListView.vue'),
      props: true,
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
      path: '/books',
      name: 'books',
      component: () => import('../views/BooksView.vue'),
    },
    {
      path: '/book/:id',
      name: 'book',
      component: () => import('../views/BookView.vue'),
      props: true,
    },
    {
      path: '/author/:authorName',
      name: 'AuthorView',
      component: () => import('../views/AuthorView.vue'),
    },
    {
      path: '/config',
      name: 'ConfigView',
      component: () => import('../views/ConfigView.vue'),
    },
    {
      path: '/recommendations',
      name: 'RecommendationsView',
      component: () => import('../views/RecommendationsView.vue'),
    },
    {
      path: '/chat-author/:authorName',
      name: 'ChatAuthorView',
      component: () => import('../views/ChatAuthorView.vue'),
      props: true,
    },
    {
      path: '/chats',
      name: 'ChatsView',
      component: () => import('../views/ChatsView.vue'),
      props: true,
    },
    {
      path: '/genres',
      name: 'all-genres',
      component: () => import('../views/AllGenresView.vue'),
    },
    {
      path: '/genres/:genreName',
      name: 'single-genre',
      component: () => import('../views/SingleGenreView.vue'),
      props: true,
    },
    {
      path: '/communities',
      name: 'communities',
      component: () => import('../views/FollowCommunitiesView.vue'),
    },
    {
      path: '/communities/:communityName',
      name: 'community',
      component: () => import('../views/CommunityView.vue'),
    },
    // Catch-all route - redirect to home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/feed',
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  await userStore.resetIfExpired()
  next() // continue navigation
})

export default router
