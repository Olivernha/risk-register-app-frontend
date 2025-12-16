import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AccountInfo } from "@azure/msal-browser";
import api from "@/plugins/axios";
import type { User } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const msalAccount = ref<AccountInfo | null>(null);
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const userRole = computed(() => user.value?.role);
  const userName = computed(() => user.value?.name);
  const userEmail = computed(
    () => msalAccount.value?.username || user.value?.email
  );

  // Actions
  async function login(): Promise<boolean> {
    // Legacy MSAL login - kept for compatibility
    throw new Error('Microsoft login not configured. Please use email/password login.')
  }

  async function loginRedirect(): Promise<void> {
    // Legacy MSAL login redirect - kept for compatibility
    throw new Error('Microsoft login not configured. Please use email/password login.')
  }

  async function loginWithCredentials(email: string, password: string): Promise<boolean> {
    isLoading.value = true

    try {
      // Fetch users from db.json
      const response = await api.get<User[]>('/users')
      const users = response.data

      // Find user by email
      const foundUser = users.find(u => u.email === email)

      if (!foundUser) {
        throw new Error('Invalid email or password')
      }

      // In a real app, password would be verified on backend
      // For demo, we'll just check if password is 'password123'
      if (password !== 'password123') {
        throw new Error('Invalid email or password')
      }

      // Set user and create a simple token
      user.value = foundUser
      accessToken.value = `demo-token-${foundUser.userId}`

      return true
    } catch (error) {
      console.error('[Auth] Login failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    isLoading.value = true

    try {
      // Clear local state
      user.value = null
      accessToken.value = null
      msalAccount.value = null
    } catch (error) {
      console.error('[Auth] Logout error:', error)
      // Clear state anyway
      user.value = null
      accessToken.value = null
      msalAccount.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function getAccessToken(): Promise<string | null> {
    // For simple auth, just return the stored token
    return accessToken.value
  }

  async function initializeAuth(): Promise<void> {
    isLoading.value = true

    try {
      // Check if user is stored in localStorage (via pinia-plugin-persistedstate)
      if (user.value && accessToken.value) {
        // User is already authenticated
        console.log('[Auth] User already authenticated')
      } else {
        // No stored auth
        console.log('[Auth] No stored authentication')
      }
    } catch (error) {
      console.error('[Auth] Initialization failed:', error)
      // Clear any stale data
      user.value = null
      accessToken.value = null
      msalAccount.value = null
    } finally {
      isLoading.value = false
    }
  }

  function hasPermission(resource: string, action: string): boolean {
    if (!user.value) return false

    const permission = user.value.permissions.find(
      (p) => p.resource === resource
    )
    return permission ? permission.actions.includes(action as any) : false
  }

  function hasRole(roles: string[]): boolean {
    if (!user.value) return false
    return roles.includes(user.value.role)
  }

  return {
    // State
    user,
    accessToken,
    msalAccount,
    isLoading,

    // Getters
    isAuthenticated,
    userRole,
    userName,
    userEmail,

    // Actions
    login,
    loginWithCredentials,
    loginRedirect,
    logout,
    getAccessToken,
    initializeAuth,
    hasPermission,
    hasRole,
  }
}, {
  persist: {
    key: 'risk-register-auth',
    storage: localStorage,
  },
})
