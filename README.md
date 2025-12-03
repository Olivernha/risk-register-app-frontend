# Risk Register Frontend

Vue.js 3 + TypeScript frontend application for the Risk Register system.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Vue Router** - Official routing library
- **Pinia** - State management
- **Vuetify** - Material Design component framework
- **Axios** - HTTP client
- **VeeValidate** - Form validation
- **TipTap** - Rich text editor
- **Chart.js** - Data visualization

## Project Structure

```
src/
├── assets/          # Static assets (CSS, images)
├── components/      # Reusable Vue components
├── composables/     # Composition API composables
├── layouts/         # Layout components
├── plugins/         # Vue plugins (Vuetify, Axios)
├── router/          # Vue Router configuration
├── stores/          # Pinia stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── views/           # Page components
├── App.vue          # Root component
└── main.ts          # Application entry point
```

## Setup

### Prerequisites

- Node.js 18+ or Bun
- Backend API running on http://localhost:3000

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev
# or
bun run dev
```

The application will be available at http://localhost:5173

### Build

```bash
# Build for production
npm run build
# or
bun run build
```

### Preview Production Build

```bash
# Preview production build
npm run preview
# or
bun run preview
```

## Environment Variables

Create `.env.development` and `.env.production` files:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Risk Register
```

## Features

### Implemented (Task 16.1)

- ✅ Vue 3 + TypeScript project structure
- ✅ Vite configuration with path aliases
- ✅ Vue Router with navigation guards
- ✅ Pinia state management (auth, notification, version stores)
- ✅ Vuetify UI framework integration
- ✅ Axios HTTP client with interceptors
- ✅ Authentication flow (login, logout, token refresh)
- ✅ Role-based access control
- ✅ Main layout with navigation
- ✅ Notification system
- ✅ TypeScript type definitions

### To Be Implemented

- Risk Management UI (Tasks 17.1-17.4)
- Rating UI (Tasks 18.1-18.3)
- Mitigation Management UI (Tasks 19.1-19.3)
- Question Management UI (Tasks 20.1-20.3)
- Version Management UI (Tasks 21.1-21.3)
- Dashboard Components (Tasks 22.1-22.3)
- User Management UI (Tasks 23.1-23.2)
- Error Handling & Notifications (Tasks 24.1-24.2)
- Security Measures (Task 25.1)

## Authentication

The application uses **Microsoft Authentication Library (MSAL)** for Azure AD/Entra ID authentication:

1. User clicks "Sign in with Microsoft"
2. MSAL redirects to Microsoft login page
3. User authenticates with organizational account
4. Microsoft returns access token
5. App exchanges token with backend for user profile (roles & permissions)
6. Access token is automatically refreshed by MSAL
7. Token is included in all API requests via Axios interceptor

### Setup

See [MSAL_SETUP.md](./MSAL_SETUP.md) for detailed configuration instructions.

Quick setup:
1. Register app in Azure Portal
2. Configure redirect URIs
3. Set environment variables in `.env.development`
4. Grant API permissions

## Routing

Protected routes require authentication. Role-based routes check user permissions:

- `/login` - Public login page
- `/` - Dashboard (authenticated)
- `/risks` - Risk list (authenticated)
- `/risks/create` - Create risk (RM/Admin only)
- `/versions` - Version management (RM/Admin only)
- `/users` - User management (Admin only)

## State Management

### Auth Store
- User authentication state
- Login/logout actions
- Permission checking

### Notification Store
- Toast notifications
- Success/error/warning/info messages
- Auto-dismiss functionality

### Version Store
- Version list
- Selected version
- Active version tracking

## Development Guidelines

### Component Naming
- Use PascalCase for component files: `RiskForm.vue`
- Use kebab-case in templates: `<risk-form />`

### Composables
- Create reusable logic in `composables/` directory
- Prefix with `use`: `useRiskForm.ts`, `useRating.ts`

### Type Safety
- Define interfaces in `types/index.ts`
- Use TypeScript strict mode
- Avoid `any` types

### Code Style
- Use Composition API with `<script setup>`
- Use `ref` and `reactive` for state
- Use `computed` for derived state
- Use `watch` for side effects

## API Integration

All API calls go through the Axios instance in `plugins/axios.ts`:

```typescript
import api from '@/plugins/axios'

// GET request
const response = await api.get('/risks')

// POST request
const response = await api.post('/risks', data)

// Error handling is automatic via interceptors
```

## Next Steps

1. Install dependencies: `npm install` or `bun install`
2. Start development server: `npm run dev`
3. Implement remaining UI components (Tasks 17-25)
4. Connect to backend API
5. Test all features
6. Build for production

## License

Proprietary - Risk Management Department
