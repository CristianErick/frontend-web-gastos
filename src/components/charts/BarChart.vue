<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  incomeData: {
    type: Array,
    required: true,
  },
  expenseData: {
    type: Array,
    required: true,
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
  const plainIncome = [...props.incomeData]
  const plainExpense = [...props.expenseData]

  if (plainLabels.length === 0) return

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: plainLabels,
      datasets: [
        {
          label: 'Ingresos',
          data: plainIncome,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Gastos',
          data: plainExpense,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'rectRounded',
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
              return `${context.dataset.label}: S/ ${context.raw.toLocaleString()}`
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
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#6b7280',
            font: { size: 11 },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false,
          },
          ticks: {
            color: '#6b7280',
            font: { size: 11 },
            callback: (value) => `S/ ${value.toLocaleString()}`,
          },
        },
      },
    },
  })
}

watch(() => props.labels, renderChart, { deep: true })
watch(() => props.incomeData, renderChart, { deep: true })
watch(() => props.expenseData, renderChart, { deep: true })

onMounted(renderChart)
onUnmounted(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<template>
  <div class="relative">
    <canvas ref="canvasRef" class="w-full h-full max-h-80"></canvas>
    <div v-if="!labels || labels.length === 0" class="absolute inset-0 flex items-center justify-center text-gray-400">
      <p class="text-sm">Sin datos para mostrar</p>
    </div>
  </div>
</template>