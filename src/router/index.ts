import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/mytask.vue'),
      },
      {
        path: 'heatmap',
        name: 'HeatMap',
        component: () => import('@/views/dashboard/HeatMapView.vue'),
      },
      {
        path: 'risks',
        name: 'RiskList',
        component: () => import('@/views/risks/RiskListView.vue'),
      },
      {
        path: 'risks/create',
        name: 'RiskCreate',
        component: () => import('@/views/risks/RiskCreateView.vue'),
        meta: { requiresRole: ['RiskManagement', 'Admin'] },
      },
      {
        path: 'risks/:id',
        name: 'RiskDetails',
        component: () => import('@/views/risks/RiskDetailsView.vue'),
      },
      {
        path: 'risks/:id/edit',
        name: 'RiskEdit',
        component: () => import('@/views/risks/RiskEditView.vue'),
        meta: { requiresRole: ['RiskManagement', 'Admin'] },
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/reports/RiskReportView.vue'),
      },
      {
        path: 'versions',
        name: 'Versions',
        component: () => import('@/views/versions/VersionListView.vue'),
        meta: { requiresRole: ['RiskManagement', 'Admin'] },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/UserListView.vue'),
        meta: { requiresRole: ['Admin'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false
  const requiresRole = to.meta.requiresRole as string[] | undefined

  // Check authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Check role-based access
  if (requiresRole && authStore.user) {
    const hasRole = requiresRole.includes(authStore.user.role)
    if (!hasRole) {
      next({ name: 'Dashboard' })
      return
    }
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router
