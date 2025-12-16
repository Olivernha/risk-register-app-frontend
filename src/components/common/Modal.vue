<template>
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="relative z-[60]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Background backdrop -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="close"></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" @click.self="close">
          <Transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="isOpen"
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all sm:my-8 sm:w-full"
              :class="maxWidthClass"
            >
              <div class="bg-white dark:bg-slate-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="flex items-start justify-between mb-4">
                    <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100" id="modal-title">
                        {{ title }}
                    </h3>
                    <button
                        type="button"
                        class="text-gray-400 hover:text-gray-500 focus:outline-none"
                        @click="close"
                    >
                        <span class="sr-only">Close</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <!-- Content Slot -->
                <div class="mt-2">
                    <slot></slot>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
}>(), {
  size: '2xl'
})

const maxWidthClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'sm:max-w-sm'
    case 'md': return 'sm:max-w-md'
    case 'lg': return 'sm:max-w-lg'
    case 'xl': return 'sm:max-w-xl'
    case '2xl': return 'sm:max-w-2xl'
    case '3xl': return 'sm:max-w-3xl'
    case '4xl': return 'sm:max-w-4xl'
    case '5xl': return 'sm:max-w-5xl'
    case '6xl': return 'sm:max-w-6xl'
    case '7xl': return 'sm:max-w-7xl'
    default: return 'sm:max-w-2xl'
  }
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  emit('close')
}

// Close on Escape key
function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>
