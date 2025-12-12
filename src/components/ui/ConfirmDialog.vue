<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="handleCancel"
      >
        <div
          class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4"
          @click.stop
        >
          <!-- Icon -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto rounded-full" :class="iconBgClass">
            <svg
              v-if="variant === 'danger'"
              class="w-6 h-6"
              :class="iconClass"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else-if="variant === 'warning'"
              class="w-6 h-6"
              :class="iconClass"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              :class="iconClass"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
            {{ title }}
          </h3>

          <!-- Message -->
          <p class="text-sm text-center text-gray-600 dark:text-gray-400">
            {{ message }}
          </p>

          <!-- Input (if needed) -->
          <div v-if="requireInput">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ inputLabel }}
            </label>
            <textarea
              v-model="inputValue"
              :placeholder="inputPlaceholder"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 justify-end">
            <button
              @click="handleCancel"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :disabled="requireInput && !inputValue.trim()"
              class="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: boolean
  title: string
  message: string
  variant?: 'info' | 'warning' | 'danger'
  confirmText?: string
  cancelText?: string
  requireInput?: boolean
  inputLabel?: string
  inputPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  requireInput: false,
  inputLabel: 'Reason',
  inputPlaceholder: 'Enter reason...',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [inputValue?: string]
  cancel: []
}>()

const inputValue = ref('')

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      inputValue.value = ''
    }
  }
)

const iconBgClass = computed(() => {
  const classes = {
    info: 'bg-blue-100 dark:bg-blue-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    danger: 'bg-red-100 dark:bg-red-900/30',
  }
  return classes[props.variant]
})

const iconClass = computed(() => {
  const classes = {
    info: 'text-blue-600 dark:text-blue-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
  }
  return classes[props.variant]
})

const confirmButtonClass = computed(() => {
  const classes = {
    info: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600',
    warning: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600',
    danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600',
  }
  return classes[props.variant]
})

function handleConfirm() {
  emit('confirm', props.requireInput ? inputValue.value : undefined)
  emit('update:modelValue', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
