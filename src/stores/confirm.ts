import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'error' | 'success'
}

export const useConfirmStore = defineStore('confirm', () => {
  const isOpen = ref(false)
  const options = ref<ConfirmOptions>({
    title: 'Confirm',
    message: 'Are you sure?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning'
  })

  let resolvePromise: ((value: boolean) => void) | null = null

  function ask(opts: ConfirmOptions): Promise<boolean> {
    options.value = {
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      type: 'warning',
      ...opts
    }
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function alert(title: string, message: string) {
    return ask({
      title,
      message,
      confirmText: 'OK',
      cancelText: undefined,
      type: 'info'
    })
  }

  function confirm() {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  function cancel() {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  return {
    isOpen,
    options,
    ask,
    alert,
    confirm,
    cancel
  }
})
