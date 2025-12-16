<template>
  <div v-if="isOpen" class="relative z-[60]" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <!-- Background backdrop -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ease-in-out duration-500" aria-hidden="true" @click="close"></div>

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <Transition
            enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from-class="translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            leave-from-class="translate-x-0"
            leave-to-class="translate-x-full"
          >
            <div v-if="isOpen" class="pointer-events-auto w-screen max-w-md">
              <div class="flex h-full flex-col overflow-y-scroll bg-white dark:bg-slate-900 shadow-xl">
                <div class="px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex items-start justify-between">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100" id="slide-over-title">
                      {{ title }}
                    </h2>
                    <div class="ml-3 flex h-7 items-center">
                      <button type="button" class="relative rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="close">
                        <span class="absolute -inset-2.5"></span>
                        <span class="sr-only">Close panel</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative flex-1 px-4 py-6 sm:px-6">
                  <slot></slot>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  title: string
}>()

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
