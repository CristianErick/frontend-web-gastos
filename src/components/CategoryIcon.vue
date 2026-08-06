<template>
  <span class="inline-flex items-center justify-center" :style="iconStyle">
    <svg v-if="path" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" :d="path" />
    </svg>
    <span v-else-if="letter" class="w-4 h-4 flex items-center justify-center text-xs font-bold">#</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, default: '' },
  color: { type: String, default: '' },
})

const defaults = {
  work: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V2a2 2 0 00-2-2h-4a2 2 0 00-2 2v4m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  code: 'M8 9l-3 3 3 3m5 0l3-3-3-3m-3-6l-4 12M9 19h6',
  trending_up: 'M3 17l6-6 4 4 8-8m0 0v6m0-6h-6',
  restaurant: 'M12 3v10.55A4 4 0 1014 17V7h4V3h-6m-2 0v8H6V3h4z',
  directions_bus: 'M8 6.75h8m-8 0V3M16 9.75v6m-1 2h2m-10 0h2m8-3v4m-8-4v4M16 6.75v3m-8-3v3m0 0h8',
  receipt: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm8 16V5M4 10h4m0 0v10m0-10h12M8 20h12',
  movie: 'M7 4h14a1 1 0 011 1v14a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1zM3 8h4m0 0V4M7 12h4m0 0v8M7 20h4m7-12h.01',
  local_hospital: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 5h-2v4H7v2h4v4h2v-4h4v-2h-4V7z',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  electricity: 'M13 3L6 13h5l-2 8 7-11h-5l2-7z',
  savings: 'M19 22H5v-2h14v2zm-7-2h7a4 4 0 010-8H5a4 4 0 010 8h3z',
}

const path = computed(() => defaults[props.icon] || '')
const letter = computed(() => !defaults[props.icon])
const iconStyle = computed(() => ({
  color: props.color || '#374151',
  backgroundColor: props.color ? `${props.color}22` : 'rgba(0,0,0,0.06)',
  borderRadius: '8px',
  padding: '6px',
  width: '28px',
  height: '28px',
}))
</script>