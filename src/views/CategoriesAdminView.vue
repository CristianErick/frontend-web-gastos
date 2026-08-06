<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Categorías Globales</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Administrar categorías de ingresos y gastos del sistema</p>
      </div>
    </div>

    <div v-if="error" class="text-center py-12">
      <div class="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
        </svg>
        <p class="text-red-700 dark:text-red-300 font-medium">{{ error }}</p>
        <button @click="goLogin" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
          Iniciar sesión como administrador
        </button>
      </div>
    </div>

    <template v-else>
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Lista de Categorías</h2>
        <button @click="openForm" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Nueva Categoría
        </button>
      </div>

      <!-- Form Modal -->
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">{{ editing ? 'Editar' : 'Nueva' }} Categoría Global</h3>
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <input v-model="form.name" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
              <select v-model="form.type" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Icono</label>
              <select v-model="form.icon" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="work">Trabajo</option>
                <option value="code">Freelance / Código</option>
                <option value="trending_up">Inversiones</option>
                <option value="restaurant">Alimentación</option>
                <option value="directions_bus">Transporte</option>
                <option value="receipt">Servicios</option>
                <option value="movie">Entretenimiento</option>
                <option value="local_hospital">Salud</option>
                <option value="electricity">Electricidad</option>
                <option value="savings">Ahorros</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
              <input v-model="form.color" type="color" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg px-3 py-2 h-10 cursor-pointer" />
            </div>
            <div class="flex space-x-2 pt-2">
              <button type="submit" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">Guardar</button>
              <button type="button" @click="closeForm" class="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Icono</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Color</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Global</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <CategoryIcon :icon="category.icon" :color="category.color" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ category.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="category.type === 'income' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ category.type === 'income' ? 'Ingreso' : 'Gasto' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-block w-6 h-6 rounded-full" :style="{ backgroundColor: category.color || '#ccc' }" :title="category.color"></span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="category.isGlobal ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-600/30 text-gray-700 dark:text-gray-300'" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ category.isGlobal ? 'Global' : 'Personal' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center gap-1">
                    <button @click="editCategory(category)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors" title="Editar">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button @click="duplicateCategory(category)" class="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors" title="Duplicar">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                    <button @click="deleteCategory(category)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Eliminar">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m10-10h-3M4 7h16m-8 4l4 4" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '../services/api'
import CategoryIcon from '../components/CategoryIcon.vue'

const categories = ref([])
const showForm = ref(false)
const editing = ref(null)
const form = ref({ name: '', type: 'expense', icon: '', color: '#6366f1' })
const error = ref(null)
let isMounted = false

const user = computed(() => {
  const data = localStorage.getItem('user')
  return data ? JSON.parse(data) : null
})

const isAdmin = computed(() => user.value?.role === 'administrador')

const goLogin = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

const loadCategories = async () => {
  error.value = null
  try {
    const response = await api.get('/admin/categories')
    if (!isMounted) return
    categories.value = response.data.categories
  } catch (err) {
    console.error('Error al cargar categorías:', err)
    if (err.response?.status === 403) {
      error.value = 'No tienes permisos de administrador para ver esta sección.'
    } else {
      error.value = 'Error al cargar las categorías.'
    }
  }
}

const openForm = () => {
  editing.value = null
  form.value = { name: '', type: 'expense', icon: '', color: '#6366f1' }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editing.value = null
  form.value = { name: '', type: 'expense', icon: '', color: '#6366f1' }
}

const saveCategory = async () => {
  try {
    if (editing.value) {
      await api.put(`/admin/categories/${editing.value.id}`, form.value)
    } else {
      await api.post('/admin/categories', form.value)
    }
    if (!isMounted) return
    closeForm()
    await loadCategories()
  } catch (err) {
    console.error('Error al guardar categoría:', err)
  }
}

const editCategory = (category) => {
  editing.value = category
  form.value = {
    name: category.name,
    type: category.type,
    icon: category.icon || '',
    color: category.color || '#6366f1',
  }
  showForm.value = true
}

const duplicateCategory = async (category) => {
  try {
    await api.post('/admin/categories', {
      name: `${category.name} (copia)`,
      type: category.type,
      icon: category.icon,
      color: category.color,
    })
    if (!isMounted) return
    await loadCategories()
  } catch (err) {
    console.error('Error al duplicar categoría:', err)
  }
}

const deleteCategory = async (category) => {
  if (!confirm('¿Eliminar esta categoría?')) return
  try {
    await api.delete(`/admin/categories/${category.id}`)
    if (isMounted) await loadCategories()
  } catch (err) {
    console.error('Error al eliminar categoría:', err)
  }
}

onMounted(async () => {
  isMounted = true
  if (!isAdmin.value) {
    error.value = 'No tienes permisos de administrador para ver esta sección.'
    return
  }
  await loadCategories()
})

onUnmounted(() => {
  isMounted = false
})
</script>