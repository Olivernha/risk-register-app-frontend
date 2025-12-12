<template>
  <div v-if="show" class="flex items-center justify-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-t-2 border-b-2"
      :class="spinnerClass"
      :style="{ width: sizeValue, height: sizeValue }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  show?: boolean
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  show: true,
  fullScreen: false,
})

const sizeValue = computed(() => {
  const sizes = {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  }
  return sizes[props.size]
})

const spinnerClass = computed(() => {
  const colors = {
    primary: 'border-gray-800 dark:border-gray-200',
    white: 'border-white',
    gray: 'border-gray-400',
  }
  return colors[props.color]
})

const containerClass = computed(() => {
  if (props.fullScreen) {
    return 'fixed inset-0 bg-white/80 dark:bg-slate-900/80 z-50'
  }
  return 'py-4'
})
</script>
