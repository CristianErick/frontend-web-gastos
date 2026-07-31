<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import ThemeToggle from '../components/ThemeToggle.vue'
import KPICard from '../components/KPICard.vue'
import DoughnutChart from '../components/charts/DoughnutChart.vue'
import BarChart from '../components/charts/BarChart.vue'

const router = useRouter()
const stats = ref({
  totalUsers: 0,
  totalTransactions: 0,
  totalIncome: 0,
  totalExpense: 0,
})

const loading = ref(true)
const error = ref(null)

const dataReady = computed(() =>
  !loading.value && !error.value
)

const user = computed(() => {
  const data = localStorage.getItem('user')
  return data ? JSON.parse(data) : null
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const expenseByCategory = ref([])
const monthlyComparative = ref([])
const historicalBalance = ref([])

const doughnutLabels = computed(() =>
  expenseByCategory.value.map(e => e.category?.name || 'Sin categoría')
)
const doughnutData = computed(() =>
  expenseByCategory.value.map(e => e.total)
)
const doughnutColors = computed(() =>
  expenseByCategory.value.map(e => e.category?.color || '#6366f1')
)

const barLabels = computed(() => monthlyComparative.value.map(m => m.label || m.mes))
const barIncomeData = computed(() => monthlyComparative.value.map(m => m.income ?? m.ingresos ?? 0))
const barExpenseData = computed(() => monthlyComparative.value.map(m => m.expense ?? m.gastos ?? 0))
const barBalanceData = computed(() => monthlyComparative.value.map(m => m.balance ?? 0))

const histLabels = computed(() => historicalBalance.value.map(b => b.label || b.mes))
const histPositive = computed(() =>
  historicalBalance.value.map(b => {
    const val = b.balanceAcumulado ?? b.balance_acumulado ?? 0
    return val >= 0 ? val : 0
  })
)
const histNegative = computed(() =>
  historicalBalance.value.map(b => {
    const val = b.balanceAcumulado ?? b.balance_acumulado ?? 0
    return val < 0 ? Math.abs(val) : 0
  })
)

const currentBalance = computed(() => {
  const last = historicalBalance.value[historicalBalance.value.length - 1]
  if (!last) return 0
  return last.balanceAcumulado ?? last.balance_acumulado ?? 0
})

let isMounted = true

const loadDashboardData = async () => {
  loading.value = true
  error.value = null
  try {
    const [dashboardRes, expensesRes, comparativeRes, balanceRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/statistics/gastos-por-categoria'),
      api.get('/statistics/comparativa-ingresos-gastos?meses=12'),
      api.get('/statistics/balance-historico?meses=12'),
    ])

    if (!isMounted) return

    stats.value = {
      totalUsers: dashboardRes.data.totalUsers ?? 0,
      totalTransactions: dashboardRes.data.totalTransactions ?? 0,
      totalIncome: dashboardRes.data.totalIncome ?? 0,
      totalExpense: dashboardRes.data.totalExpense ?? 0,
    }
    expenseByCategory.value = expensesRes.data.gastosPorCategoria ?? []
    monthlyComparative.value = comparativeRes.data.comparativa ?? []
    historicalBalance.value = balanceRes.data.balanceHistorico ?? []
  } catch (err) {
    console.error('Error al cargar dashboard:', err)
    if (err.response?.status === 403) {
      error.value = 'No tienes permisos de administrador para ver esta sección.'
    } else {
      error.value = 'Error al cargar los datos del dashboard.'
    }
  } finally {
    if (isMounted) {
      loading.value = false
    }
  }
}

onMounted(() => {
  isMounted = true
  loadDashboardData()
})

onUnmounted(() => {
  isMounted = false
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <div class="flex items-center space-x-2">
              <img src="/logo32.png" alt="OptiGasto" class="h-8 w-8" />
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">OptiGasto</h1>
            </div>
            <div class="hidden md:flex space-x-1">
              <router-link to="/" class="px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20">Dashboard</router-link>
              <router-link to="/users" class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Usuarios</router-link>
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

    <!-- Page Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">Visión general del sistema financiero</p>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">Administrador</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Cargando métricas...</p>
      </div>

      <!-- Error State (e.g., 403 not admin) -->
      <div v-else-if="error" class="text-center py-12">
        <div class="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
          </svg>
          <p class="text-red-700 dark:text-red-300 font-medium">{{ error }}</p>
          <button @click="logout" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
            Volver a inicio de sesión
          </button>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else-if="dataReady" class="space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Usuarios Registrados"
            :value="stats.totalUsers ?? 0"
            icon="users"
            color="indigo"
          />
          <KPICard
            title="Total Transacciones"
            :value="stats.totalTransactions ?? 0"
            icon="transactions"
            color="blue"
          />
          <KPICard
            title="Total Ingresos"
            :value="stats.totalIncome != null ? `S/ ${Number(stats.totalIncome).toLocaleString()}` : 'S/ 0'"
            icon="income"
            color="green"
          />
          <KPICard
            title="Total Gastos"
            :value="stats.totalExpense != null ? `S/ ${Number(stats.totalExpense).toLocaleString()}` : 'S/ 0'"
            icon="expense"
            color="red"
          />
        </div>

        <!-- Charts Row 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Expenses by Category - Doughnut Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gastos por Categoría</h2>
            <div v-if="expenseByCategory.length > 0" class="h-72">
              <DoughnutChart
                :labels="[...doughnutLabels]"
                :data="[...doughnutData]"
                :colors="[...doughnutColors]"
              />
            </div>
            <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Sin datos de gastos por categoría</p>
            </div>
          </div>

          <!-- Monthly Comparative - Bar Chart -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ingresos vs Gastos (12 meses)</h2>
            <div v-if="monthlyComparative.length > 0" class="h-72">
              <BarChart
                :labels="[...barLabels]"
                :incomeData="[...barIncomeData]"
                :expenseData="[...barExpenseData]"
                title="Flujo de Caja Mensual"
              />
            </div>
            <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Sin datos para comparativa mensual</p>
            </div>
          </div>
        </div>

        <!-- Historical Balance Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Balance Histórico Acumulado</h2>
          <div v-if="historicalBalance.length > 0" class="h-80">
            <BarChart
              :labels="[...histLabels]"
              :incomeData="[...histPositive]"
              :expenseData="[...histNegative]"
              title="Evolución del Balance Acumulado"
            />
            <div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 rounded-full bg-green-500"></span>
                Balance Positivo
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 rounded-full bg-red-500"></span>
                Balance Negativo
              </span>
              <span class="ml-auto font-medium text-gray-900 dark:text-white">
                Balance Actual: S/ {{ currentBalance.toLocaleString() }}
              </span>
            </div>
          </div>
          <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Sin datos de balance histórico</p>
          </div>
        </div>

        <!-- Top Expense Categories Table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Top Categorías de Gasto</h2>
          </div>
          <div v-if="expenseByCategory.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Categoría</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Gastado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transacciones</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">% del Total</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="expense in expenseByCategory.slice(0, 10)" :key="expense.category?.name || expense.total" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-3">
                      <span v-if="expense.category?.color" class="w-3 h-3 rounded-full" :style="{ backgroundColor: expense.category.color }"></span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ expense.category?.name || 'Sin categoría' }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">S/ {{ Number(expense.total).toLocaleString() }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ expense.count }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ ((expense.total / expenseByCategory.reduce((sum, e) => sum + e.total, 0)) * 100).toFixed(1) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="p-6 text-center text-gray-500 dark:text-gray-400">
            <p>No hay datos de gastos por categoría</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>