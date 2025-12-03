# MSAL Authentication Setup Guide

This guide explains how to configure Microsoft Authentication Library (MSAL) for Azure AD/Entra ID authentication in the Risk Register application.

## Prerequisites

1. Azure AD (Entra ID) tenant
2. Application registered in Azure Portal
3. API permissions configured

## Azure Portal Configuration

### Step 1: Register Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: Risk Register Frontend
   - **Supported account types**: Choose based on your needs
     - Single tenant (your organization only)
     - Multi-tenant (any Azure AD directory)
   - **Redirect URI**: 
     - Platform: Single-page application (SPA)
     - URI: `http://localhost:5173` (for development)
5. Click **Register**

### Step 2: Configure Authentication

1. In your app registration, go to **Authentication**
2. Under **Single-page application**, add redirect URIs:
   - Development: `http://localhost:5173`
   - Production: `https://your-domain.com`
3. Under **Implicit grant and hybrid flows**, ensure:
   - ✅ Access tokens (used for implicit flows)
   - ✅ ID tokens (used for implicit and hybrid flows)
4. Under **Advanced settings**:
   - Allow public client flows: **No**
5. Click **Save**

### Step 3: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Add the following permissions:
   - `User.Read` - Read user profile
   - `openid` - Sign in and read user profile
   - `profile` - View users' basic profile
   - `email` - View users' email address
6. Click **Add permissions**
7. Click **Grant admin consent** (if you have admin rights)

### Step 4: Configure Backend API (Optional)

If your backend API is also registered in Azure AD:

1. Register your backend API as a separate app
2. Expose an API scope (e.g., `access_as_user`)
3. In the frontend app registration:
   - Go to **API permissions**
   - Click **Add a permission**
   - Select **My APIs**
   - Select your backend API
   - Select the exposed scope
   - Click **Add permissions**

### Step 5: Get Configuration Values

From your app registration overview page, copy:
- **Application (client) ID**
- **Directory (tenant) ID**

## Environment Configuration

### Development Environment

Create or update `.env.development`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Risk Register

# MSAL Configuration
VITE_MSAL_CLIENT_ID=your-client-id-here
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_MSAL_REDIRECT_URI=http://localhost:5173
VITE_MSAL_POST_LOGOUT_REDIRECT_URI=http://localhost:5173

# API Scope (if using Azure AD protected backend)
VITE_API_SCOPE=api://your-backend-client-id/access_as_user
```

### Production Environment

Create or update `.env.production`:

```env
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_TITLE=Risk Register

# MSAL Configuration
VITE_MSAL_CLIENT_ID=your-client-id-here
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_MSAL_REDIRECT_URI=https://your-domain.com
VITE_MSAL_POST_LOGOUT_REDIRECT_URI=https://your-domain.com

# API Scope
VITE_API_SCOPE=api://your-backend-client-id/access_as_user
```

## Configuration Options

### Authority URL Formats

**Single Tenant (Recommended for enterprise apps):**
```
https://login.microsoftonline.com/{tenant-id}
```

**Multi-Tenant:**
```
https://login.microsoftonline.com/common
```

**Azure AD B2C:**
```
https://{tenant-name}.b2clogin.com/{tenant-name}.onmicrosoft.com/{policy-name}
```

### Cache Location

In `src/config/msal.config.ts`, you can configure where tokens are stored:

```typescript
cache: {
  cacheLocation: 'localStorage', // or 'sessionStorage'
  storeAuthStateInCookie: false, // Set to true for IE11 or Edge
}
```

- **localStorage**: Tokens persist across browser sessions
- **sessionStorage**: Tokens cleared when browser is closed

## Authentication Flow

### 1. Login Flow

```
User clicks "Sign in with Microsoft"
  ↓
MSAL opens popup/redirect to Microsoft login
  ↓
User authenticates with Microsoft
  ↓
Microsoft redirects back with authorization code
  ↓
MSAL exchanges code for access token
  ↓
App calls backend /auth/profile with token
  ↓
Backend validates token and returns user profile with roles
  ↓
User is authenticated and redirected to dashboard
```

### 2. Token Acquisition

```
App needs to call API
  ↓
Axios interceptor calls authStore.getAccessToken()
  ↓
MSAL tries to get token silently from cache
  ↓
If token expired, MSAL refreshes it automatically
  ↓
If refresh fails, MSAL shows popup for re-authentication
  ↓
Token added to Authorization header
  ↓
API request proceeds
```

### 3. Logout Flow

```
User clicks logout
  ↓
App calls backend /auth/logout
  ↓
App clears local state
  ↓
MSAL logs out from Microsoft (clears SSO session)
  ↓
User redirected to login page
```

## Backend Integration

Your backend API should:

1. **Validate MSAL tokens**:
   ```javascript
   // Example: Node.js with passport-azure-ad
   const BearerStrategy = require('passport-azure-ad').BearerStrategy
   
   const options = {
     identityMetadata: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
     clientID: process.env.CLIENT_ID,
     audience: process.env.CLIENT_ID,
     validateIssuer: true,
     passReqToCallback: false,
   }
   
   passport.use(new BearerStrategy(options, (token, done) => {
     // Token is valid, extract user info
     return done(null, token)
   }))
   ```

2. **Map Azure AD user to application user**:
   ```javascript
   // GET /auth/profile endpoint
   app.get('/auth/profile', authenticateToken, async (req, res) => {
     const azureUser = req.user // From MSAL token
     
     // Look up user in your database
     const user = await User.findOne({ email: azureUser.preferred_username })
     
     // Return user with roles and permissions
     res.json({
       userId: user.id,
       name: azureUser.name,
       email: azureUser.preferred_username,
       role: user.role, // From your database
       department: user.department,
       permissions: user.permissions,
     })
   })
   ```

## Testing

### Test Accounts

For development, you can create test users in Azure AD:

1. Go to **Azure Active Directory** > **Users**
2. Click **New user**
3. Create test users with different roles
4. Assign them to your application

### Local Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`

3. Click "Sign in with Microsoft"

4. Use your test account credentials

5. Verify:
   - Login successful
   - Token acquired
   - User profile loaded
   - API calls include Bearer token
   - Logout works correctly

## Troubleshooting

### Common Issues

**1. "AADSTS50011: The reply URL specified in the request does not match"**
- Solution: Add the redirect URI to your app registration in Azure Portal

**2. "AADSTS65001: The user or administrator has not consented"**
- Solution: Grant admin consent for API permissions in Azure Portal

**3. "AADSTS700016: Application not found in the directory"**
- Solution: Check that CLIENT_ID matches your app registration

**4. Popup blocked**
- Solution: Use redirect flow instead of popup, or allow popups for your domain

**5. Token acquisition fails silently**
- Solution: Check browser console for errors, verify API scopes are correct

### Debug Mode

Enable verbose logging in `src/config/msal.config.ts`:

```typescript
system: {
  loggerOptions: {
    logLevel: LogLevel.Verbose, // Shows all MSAL operations
  },
}
```

## Security Best Practices

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Use HTTPS in production**: MSAL requires HTTPS for production apps
3. **Validate tokens on backend**: Always validate tokens server-side
4. **Use appropriate scopes**: Request only the permissions you need
5. **Implement token refresh**: Handle token expiration gracefully
6. **Clear tokens on logout**: Ensure complete cleanup of authentication state
7. **Monitor failed logins**: Track authentication failures for security

## Additional Resources

- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [MSAL Browser Samples](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-browser-samples)

## Support

For issues specific to MSAL configuration, contact your Azure AD administrator or refer to the Microsoft documentation.
