import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification, NotificationType } from '@/types'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([])

  // Actions
  function addNotification(
    type: NotificationType,
    message: string,
    timeout: number = 5000,
    action?: { label: string; callback: () => void }
  ) {
    const id = `${Date.now()}-${Math.random()}`
    const notification: Notification = {
      id,
      type,
      message,
      timeout,
      action,
    }

    notifications.value.push(notification)

    // Auto-remove after timeout
    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, timeout)
    }

    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function success(message: string, timeout?: number) {
    return addNotification('success', message, timeout)
  }

  function error(message: string, timeout?: number) {
    return addNotification('error', message, timeout)
  }

  function warning(message: string, timeout?: number) {
    return addNotification('warning', message, timeout)
  }

  function info(message: string, timeout?: number) {
    return addNotification('info', message, timeout)
  }

  function clear() {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clear,
  }
})
