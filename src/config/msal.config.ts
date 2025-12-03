import { Configuration, LogLevel } from "@azure/msal-browser";

// MSAL Configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_AZURE_TENANT_ID || "common"
    }`,
    redirectUri:
      import.meta.env.VITE_AZURE_REDIRECT_URL || window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean
      ) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error("[MSAL]", message);
            return;
          case LogLevel.Info:
            console.info("[MSAL]", message);
            return;
          case LogLevel.Verbose:
            console.debug("[MSAL]", message);
            return;
          case LogLevel.Warning:
            console.warn("[MSAL]", message);
            return;
        }
      },
      logLevel: import.meta.env.DEV ? LogLevel.Verbose : LogLevel.Error,
      piiLoggingEnabled: false,
    },
  },
};

// Login request scopes
export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
  prompt: "select_account",
};
