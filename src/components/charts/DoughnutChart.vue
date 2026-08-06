<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { Chart, ArcElement, DoughnutController, Tooltip, Legend } from 'chart.js'

Chart.register(ArcElement, DoughnutController, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  labels: {
    type: Array,
    required: true,
  },
  colors: {
    type: Array,
    default: () => [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
      '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
      '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    ],
  },
  title: {
    type: String,
    default: '',
  },
})

const canvasRef = ref(null)
let chartInstance = null

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  const plainLabels = [...props.labels]
  const plainData = [...props.data]
  const plainColors = [...props.colors]

  if (plainLabels.length === 0) return

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: plainLabels,
      datasets: [{
        data: plainData,
        backgroundColor: plainColors,
        borderWidth: 0,
        hoverOffset: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
            font: {
              size: 12,
              family: 'Inter, system-ui, sans-serif',
            },
            color: '#374151',
          },
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              const value = context.raw
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${context.label}: S/ ${value.toLocaleString()} (${percentage}%)`
            },
          },
        },
        title: {
          display: !!props.title,
          text: props.title,
          font: {
            size: 16,
            weight: '600',
          },
          color: '#1f2937',
          padding: { bottom: 20 },
        },
      },
    },
  })
}

watch(() => props.data, renderChart, { deep: true })
watch(() => props.labels, renderChart, { deep: true })

onMounted(renderChart)
onUnmounted(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<template>
  <div class="relative">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
    <div v-if="data.length === 0" class="absolute inset-0 flex items-center justify-center text-gray-400">
      <p class="text-sm">Sin datos para mostrar</p>
    </div>
  </div>
</template>