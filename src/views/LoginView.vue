<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-gray-800 dark:to-gray-900">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">OptiGasto</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Panel de Administración</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
          <input
            v-model="email"
            @input="clearError"
            type="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="admin@example.com"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
          <input
            v-model="password"
            @input="clearError"
            type="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="••••••••"
            required
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </button>
      </form>

      <div v-if="hasGoogleClient" class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">o continúa con</span>
          </div>
        </div>

        <div id="google-signin-btn" class="mt-6 flex justify-center"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const hasGoogleClient = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

const checkNoAdminError = () => {
  if (route.query.error === 'no-admin') {
    error.value = 'Acceso denegado. Debes iniciar sesión con una cuenta de administrador.'
  }
}

onMounted(checkNoAdminError)
watch(() => route.query.error, checkNoAdminError)

const clearError = () => {
  if (error.value.includes('Acceso denegado')) error.value = ''
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    })

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

const handleGoogleResponse = async (response) => {
  try {
    const res = await api.post('/login/google', {
      id_token: response.credential,
    })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión con Google'
  }
}

onMounted(() => {
  if (!hasGoogleClient) return

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const checkGoogle = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      })
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: 300 }
      )
      return true
    }
    return false
  }

  if (!checkGoogle()) {
    const observer = new MutationObserver(() => {
      if (checkGoogle()) observer.disconnect()
    })
    observer.observe(document.head, { childList: true, subtree: true })
    setTimeout(() => observer.disconnect(), 10000)
  }
})
</script>