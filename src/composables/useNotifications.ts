import { useNotificationStore } from '@/stores/notification'

/**
 * Composable for showing notifications
 */
export function useNotifications() {
  const notificationStore = useNotificationStore()

  const showError = (message: string, timeout?: number) => {
    notificationStore.error(message, timeout)
  }

  const showSuccess = (message: string, timeout?: number) => {
    notificationStore.success(message, timeout)
  }

  const showWarning = (message: string, timeout?: number) => {
    notificationStore.warning(message, timeout)
  }

  const showInfo = (message: string, timeout?: number) => {
    notificationStore.info(message, timeout)
  }

  const clearAll = () => {
    notificationStore.clear()
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
  }
}

