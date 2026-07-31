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
              <router-link to="/users" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Usuarios</router-link>
              <router-link to="/categories" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Categorías</router-link>
              <router-link to="/audit" class="px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20">Auditoría</router-link>
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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Auditoría Financiera</h1>
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
        <div class="mb-6">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar por nombre de usuario, descripción o monto..."
            class="w-full max-w-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div class="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuario</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoría</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                <tr v-for="txn in filteredTransactions" :key="txn.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ txn.user?.name || 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ txn.category?.name || 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="txn.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    S/ {{ txn.amount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="txn.type === 'income' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ txn.type === 'income' ? 'Ingreso' : 'Gasto' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{{ txn.description }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ new Date(txn.date).toLocaleDateString() }}</td>
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
const transactions = ref([])
const search = ref('')
const loading = ref(true)
const error = ref(null)
let isMounted = false

const user = computed(() => {
  const data = localStorage.getItem('user')
  return data ? JSON.parse(data) : null
})

const isAdmin = computed(() => user.value?.role === 'administrador')

const filteredTransactions = computed(() => {
  if (!search.value) return transactions.value
  const term = search.value.toLowerCase()
  return transactions.value.filter((t) =>
    t.user?.name?.toLowerCase().includes(term) ||
    t.description?.toLowerCase().includes(term) ||
    String(t.amount).includes(term)
  )
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const loadTransactions = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/admin/transactions')
    if (!isMounted) return
    transactions.value = response.data.transactions
  } catch (err) {
    console.error('Error al cargar transacciones:', err)
    if (err.response?.status === 403) {
      error.value = 'No tienes permisos de administrador para ver esta sección.'
    } else {
      error.value = 'Error al cargar las transacciones.'
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
  loadTransactions()
})

onUnmounted(() => {
  isMounted = false
})
</script>