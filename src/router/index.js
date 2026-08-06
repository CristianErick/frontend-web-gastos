import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '../components/AdminLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import UsersAdminView from '../views/UsersAdminView.vue'
import CategoriesAdminView from '../views/CategoriesAdminView.vue'
import AuditAdminView from '../views/AuditAdminView.vue'

// Global AbortController for cancelling pending requests on navigation
let globalAbortController = new AbortController()

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { auth: true, admin: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardView,
      },
      {
        path: 'users',
        name: 'Users',
        component: UsersAdminView,
      },
      {
        path: 'categories',
        name: 'Categories',
        component: CategoriesAdminView,
      },
      {
        path: 'audit',
        name: 'Audit',
        component: AuditAdminView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  let user = null
  try {
    const raw = localStorage.getItem('user')
    if (raw) user = JSON.parse(raw)
  } catch {}

  // Cancel any pending requests from previous page
  globalAbortController.abort()
  globalAbortController = new AbortController()

  if (to.meta.auth && !token) {
    next('/login')
  } else if (to.path === '/login' && token && !to.query.error) {
    // Only redirect logged-in users away from login if NOT an explicit error redirect
    next('/')
  } else if (to.meta.admin && user?.role !== 'administrador') {
    // Clear invalid session before redirecting to login
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    next('/login?error=no-admin')
  } else {
    next()
  }
})

export default router
