import { PublicClientApplication, EventType, type EventMessage, type AuthenticationResult } from '@azure/msal-browser'
import { msalConfig } from '@/config/msal.config'

// Create MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig)

// Initialize MSAL
export async function initializeMsal(): Promise<AuthenticationResult | null> {
  try {
    await msalInstance.initialize()
    
    // Optional: Set up event callbacks
    msalInstance.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult
        console.log('[MSAL] Login success:', payload.account?.username)
      }
      
      if (event.eventType === EventType.LOGIN_FAILURE) {
        console.error('[MSAL] Login failed:', event.error)
      }
      
      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        console.log('[MSAL] Logout success')
      }
    })
    
    // Handle redirect promise
    const response = await msalInstance.handleRedirectPromise()
    
    if (response) {
      console.log('[MSAL] Redirect response received')
      return response
    }
    
    return null
  } catch (error) {
    console.error('[MSAL] Initialization error:', error)
    throw error
  }
}

export default msalInstance
