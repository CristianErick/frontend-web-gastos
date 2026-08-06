<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Administrar usuarios del sistema</p>
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
      <div class="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Moneda</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registro</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ u.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ u.name }}
                    <span v-if="u.id === currentUserId" class="ml-1 inline-block px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">Tú</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ u.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="u.role === 'administrador' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-600/30 text-gray-700 dark:text-gray-300'" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ u.role === 'administrador' ? 'Administrador' : 'Cliente' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ u.profile?.currency || 'PEN' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDate(u.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center gap-1">
                    <button @click="editUser(u)" class="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors" title="Editar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button @click="toggleUserStatus(u)" :class="u.suspended ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'" class="p-1.5 rounded-lg transition-colors" :title="u.suspended ? 'Activar usuario' : 'Suspender usuario'">
                      <svg v-if="u.suspended" class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      <svg v-else class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636M12 3a9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9z" /></svg>
                    </button>
                    <button v-if="u.id !== currentUserId || u.role !== 'administrador'" @click="deleteUser(u)" class="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Eliminar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m10-10h-3M4 7h16m-8 4l4 4" /></svg>
                    </button>
                    <button v-if="u.email === 'admin@optigas.com' || u.role === 'administrador'" @click="openEditRole(u)" class="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Editar rol">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal user data (password / role) -->
      <div v-if="showUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {{ modalAction === 'editUser' ? 'Editar Usuario' : 'Editar Rol' }} — {{ userModalName }}
          </h3>
          <form @submit.prevent="saveUserModal" class="space-y-4">
            <template v-if="modalAction === 'editUser'">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                <input v-model="modalForm.name" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nueva contraseña</label>
                <input v-model="modalForm.password" type="password" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Dejar vacío para no cambiar" />
              </div>
            </template>
            <template v-else>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
                <select v-model="modalForm.role" class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="cliente">Cliente</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            </template>
            <div class="flex space-x-2 pt-2">
              <button type="submit" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">Guardar</button>
              <button type="button" @click="closeUserModal" class="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="modalMessage" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
          <svg class="w-10 h-10 text-emerald-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p class="text-gray-800 dark:text-white font-medium">{{ response }}</p>
          <button @click="response = null" class="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">Aceptar</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '../services/api'

const users = ref([])
const loading = ref(true)
const error = ref(null)
let isMounted = false

const showUserModal = ref(false)
const modalAction = ref('editUser')
const userModalName = ref('')
const modalUserId = ref(null)
const modalForm = ref({ name: '', password: '', role: 'cliente' })
const response = ref(null)

const user = computed(() => {
  const data = localStorage.getItem('user')
  return data ? JSON.parse(data) : null
})

const currentUserId = computed(() => user.value?.id)
const isAdmin = computed(() => user.value?.role === 'administrador')

const goLogin = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString()
}

const toggleUserStatus = async (u) => {
  try {
    await api.put(`/admin/users/${u.id}/toggle-status`)
    u.suspended = !u.suspended
  } catch (err) {
    console.error('Error al cambiar estado:', err)
  }
}

const editUser = (u) => {
  modalAction.value = 'editUser'
  userModalName.value = u.name
  modalUserId.value = u.id
  modalForm.value = { name: u.name, password: '' }
  showUserModal.value = true
}

const openEditRole = (u) => {
  modalAction.value = 'editRole'
  userModalName.value = u.name
  modalUserId.value = u.id
  modalForm.value = { name: u.name, password: '', role: u.role }
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  modalUserId.value = null
}

const saveUserModal = async () => {
  try {
    if (modalAction.value === 'editUser') {
      const payload = { name: modalForm.value.name }
      if (modalForm.value.password) payload.password = modalForm.value.password
      await api.put(`/admin/users/${modalUserId.value}`, payload)
      response.value = 'Usuario actualizado correctamente.'
    } else {
      await api.put(`/admin/users/${modalUserId.value}/role`, { role: modalForm.value.role })
      response.value = 'Rol de usuario actualizado correctamente.'
    }
    closeUserModal()
    await loadUsers()
  } catch (err) {
    console.error('Error en la operación:', err)
    response.value = 'Ocurrió un error al realizar la operación.'
  }
}

const deleteUser = async (u) => {
  if (!confirm(`¿Eliminar definitivamente a ${u.name}? Esta acción no se puede deshacer.`)) return
  try {
    await api.delete(`/admin/users/${u.id}`)
    if (isMounted) users.value = users.value.filter(x => x.id !== u.id)
  } catch (err) {
    console.error('Error al eliminar usuario:', err)
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