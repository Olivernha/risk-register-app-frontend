import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  InteractionRequiredAuthError,
  type AccountInfo,
  type AuthenticationResult,
} from "@azure/msal-browser";
import { msalInstance } from "@/plugins/msal";
import { loginRequest } from "@/config/msal.config";
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
    isLoading.value = true;

    try {
      // Trigger MSAL login popup
      const loginResponse: AuthenticationResult = await msalInstance.loginPopup(
        loginRequest
      );

      if (!loginResponse || !loginResponse.account) {
        throw new Error("Login failed: No account returned");
      }

      // Set the active account
      msalInstance.setActiveAccount(loginResponse.account);
      msalAccount.value = loginResponse.account;

      // Get access token for API
      const tokenResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: loginResponse.account,
      });

      accessToken.value = tokenResponse.accessToken;

      // Fetch user profile from backend
      await fetchUserProfile();

      return true;
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function loginRedirect(): Promise<void> {
    isLoading.value = true;

    try {
      await msalInstance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("[Auth] Login redirect failed:", error);
      isLoading.value = false;
      throw error;
    }
  }

  async function logout(): Promise<void> {
    isLoading.value = true;

    try {
      // Notify backend (ignore errors)
      await api.post("/auth/logout").catch(() => {});

      // Clear local state
      user.value = null;
      accessToken.value = null;
      msalAccount.value = null;

      // MSAL logout
      const account = msalInstance.getActiveAccount();
      if (account) {
        await msalInstance.logoutPopup({
          account,
          postLogoutRedirectUri: window.location.origin,
        });
      }
    } catch (error) {
      console.error("[Auth] Logout error:", error);
      // Clear state anyway
      user.value = null;
      accessToken.value = null;
      msalAccount.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function getAccessToken(): Promise<string | null> {
    try {
      const account = msalInstance.getActiveAccount();

      if (!account) {
        console.warn("[Auth] No active account found");
        return null;
      }

      // Try to acquire token silently
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      accessToken.value = response.accessToken;
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Fallback to interactive method
        try {
          const response = await msalInstance.acquireTokenPopup(loginRequest);
          accessToken.value = response.accessToken;
          return response.accessToken;
        } catch (popupError) {
          console.error("[Auth] Token acquisition failed:", popupError);
          return null;
        }
      }

      console.error("[Auth] Token acquisition error:", error);
      return null;
    }
  }

  async function fetchUserProfile(): Promise<void> {
    try {
      // Fetch user profile from Microsoft Graph API
      const graphResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me?$select=displayName,companyName,mail,userPrincipalName,jobTitle,department,id,givenName,surname,officeLocation,preferredLanguage",
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      );

      if (!graphResponse.ok) {
        throw new Error(`Graph API error: ${graphResponse.status}`);
      }

      const graphData = await graphResponse.json();

      // Map Microsoft Graph data to User type
      // Note: You'll need to determine role and permissions from your backend or another source
      const userData: User = {
        userId: graphData.id,
        name:
          graphData.displayName ||
          `${graphData.givenName} ${graphData.surname}`,
        email: graphData.mail || graphData.userPrincipalName,
        role: "RiskOwner", // Default role - should be fetched from backend
        department: graphData.department || "Unknown",
        permissions: [], // Should be fetched from backend
        active: true,
      };

      user.value = userData;

      // Optionally: Sync with backend to get role and permissions
      // try {
      //   const backendResponse = await api.post<User>("/auth/sync", {
      //     azureId: graphData.id,
      //     email: graphData.mail || graphData.userPrincipalName,
      //     name: graphData.displayName,
      //     department: graphData.department,
      //     jobTitle: graphData.jobTitle,
      //   });

      //   // Update with backend data (role and permissions)
      //   user.value = backendResponse.data;
      //   localStorage.setItem("user", JSON.stringify(backendResponse.data));
      // } catch (backendError) {
      //   console.warn(
      //     "[Auth] Backend sync failed, using Graph data only:",
      //     backendError
      //   );
      // }
    } catch (error) {
      console.error("[Auth] Failed to fetch user profile:", error);
      throw error;
    }
  }

  async function initializeAuth(): Promise<void> {
    isLoading.value = true;

    try {
      const accounts = msalInstance.getAllAccounts();

      if (accounts.length === 0) {
        console.log("[Auth] No accounts found");
        isLoading.value = false;
        return;
      }

      // Set the first account as active
      const account = accounts[0];
      msalInstance.setActiveAccount(account);
      msalAccount.value = account;

      // Try to get access token
      const token = await getAccessToken();

      if (token) {
        // If user data is not persisted, fetch from Graph API
        if (!user.value) {
          await fetchUserProfile();
        }
      } else {
        // Token acquisition failed, clear state
        user.value = null;
        accessToken.value = null;
        msalAccount.value = null;
      }
    } catch (error) {
      console.error("[Auth] Initialization failed:", error);
      // Clear any stale data
      user.value = null;
      accessToken.value = null;
      msalAccount.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  function hasPermission(resource: string, action: string): boolean {
    if (!user.value) return false;

    const permission = user.value.permissions.find(
      (p) => p.resource === resource
    );
    return permission ? permission.actions.includes(action as any) : false;
  }

  function hasRole(roles: string[]): boolean {
    if (!user.value) return false;
    return roles.includes(user.value.role);
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
    loginRedirect,
    logout,
    getAccessToken,
    fetchUserProfile,
    initializeAuth,
    hasPermission,
    hasRole,
  };
}, {
  persist: {
    key: 'risk-register-auth',
    storage: localStorage,
    paths: ['user', 'accessToken', 'msalAccount'],
  },
});
