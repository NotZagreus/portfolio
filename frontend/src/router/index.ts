import { createRouter, createWebHistory } from 'vue-router';
import Portfolio from '@/Portfolio.vue';
import { useAuth0 } from '@auth0/auth0-vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Portfolio,
    }
  ],
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth0();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;