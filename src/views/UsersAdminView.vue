<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <nav class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-100 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <div class="flex items-center space-x-2">
              <img src="/logo32.png" alt="OptiGasto" class="h-8 w-8" />
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">OptiGasto</h1>
            </div>
            <div class="hidden md:flex space-x-1">
              <router-link to="/" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</router-link>
              <router-link to="/users" class="px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20">Usuarios</router-link>
              <router-link to="/categories" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Categorías</router-link>
              <router-link to="/audit" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Auditoría</router-link>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <ThemeToggle />
            <span class="text-gray-600 dark:text-gray-300 text-sm hidden sm:block">{{ user?.name }}</span>
            <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>

    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">Administrar usuarios del sistema</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div v-if="error" class="text-center py-12">
        <div class="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
          </svg>
          <p class="text-red-700 dark:text-red-300 font-medium">{{ error }}</p>
          <button @click="logout" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
            Iniciar sesión como administrador
          </button>
        </div>
      </div>

      <template v-else>
      <div class="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Moneda</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registro</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ u.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ u.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ u.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ u.profile?.currency || 'PEN' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ new Date(u.created_at).toLocaleDateString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="toggleUserStatus(u)"
                    :class="u.suspended ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <template v-if="u.suspended">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Activar</span>
                    </template>
                    <template v-else>
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Suspender</span>
                    </template>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import ThemeToggle from '../components/ThemeToggle.vue'

const router = useRouter()
const users = ref([])
const loading = ref(true)
const error = ref(null)
let isMounted = false

const user = computed(() => {
  const data = localStorage.getItem('user')
  return data ? JSON.parse(data) : null
})

const isAdmin = computed(() => user.value?.role === 'administrador')

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const toggleUserStatus = async (u) => {
  try {
    await api.put(`/admin/users/${u.id}/toggle-status`)
    u.suspended = !u.suspended
  } catch (err) {
    console.error('Error al cambiar estado:', err)
  }
}

const loadUsers = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/admin/users')
    if (!isMounted) return
    users.value = response.data.users
  } catch (err) {
    console.error('Error al cargar usuarios:', err)
    if (err.response?.status === 403) {
      error.value = 'No tienes permisos de administrador para ver esta sección.'
    } else {
      error.value = 'Error al cargar los usuarios.'
    }
  } finally {
    if (isMounted) loading.value = false
  }
}

onMounted(() => {
  isMounted = true
  if (!isAdmin.value) {
    error.value = 'No tienes permisos de administrador para ver esta sección.'
    loading.value = false
    return
  }
  loadUsers()
})

onUnmounted(() => {
  isMounted = false
})
</script>