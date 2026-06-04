# Sessions Marketplace - Frontend

A modern, production-ready React frontend for a sessions marketplace platform. Built with Vite, React Router, and Axios with complete authentication and real-time API integration.

## Features

- **Premium Sessions Marketplace Catalog**: Immersive discovery home with real-time keyword search, active price range selects, session duration filters, newest/pricing sort ordering, and one-click clear options.
- **Asymmetric Session Details Layout**: High-end two-column detail view featuring custom learn outcomes agendas, agenda timelines, detailed host professional stats, and participant reviews.
- **Robust Authentication System**: Full JWT token handling (access/refresh) with automatic silent refreshes on 401 intercepts, and Google/GitHub OAuth integrations.
- **Interactive Signup Role Cards**: Replaces boring select dropdowns with custom animated cards ("Explore & Book" vs "Host & Earn") complete with active visual checkmarks, hover transforms, and highlight rings.
- **100% Mobile Responsive Sidebar**: Overlay navigation drawer using modern dynamic viewport parameters (`100dvh`) to guarantee the footer Logout CTA button remains visible and above the fold across all iOS/Android browser address bars.
- **Creator & User Dashboards**: Complete overview cards, bookings timelines, slot configurations, and real-time validation forms.
- **Role Switching**: On-the-fly switching between Creator and User accounts with synchronized sidebar options.

## Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 5.3
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Styling**: CSS (custom, no frameworks)
- **Package Manager**: pnpm

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Input, Badge, etc.)
│   ├── navigation/      # Navigation components
│   └── shared/          # Shared components
├── features/
│   ├── auth/            # Authentication features
│   ├── sessions/        # Session listing and detail
│   ├── bookings/        # Booking management
│   ├── dashboard/       # User dashboard
│   ├── creator/         # Creator dashboard
│   └── profile/         # Profile management
├── hooks/
│   ├── useAuth.js       # Authentication hook
│   ├── useSessions.js   # Sessions data hook
│   ├── useBookings.js   # Bookings data hook
│   └── useDebounce.js   # Debounce hook
├── routes/
│   ├── AppRoutes.jsx    # Main routes configuration
│   ├── ProtectedRoute.jsx    # Protected route wrapper
│   ├── CreatorRoute.jsx      # Creator-only route wrapper
│   └── PublicRoute.jsx       # Public route wrapper
├── services/
│   ├── axios.js         # Axios instance with interceptors
│   ├── auth.service.js  # Authentication API calls
│   ├── session.service.js   # Sessions API calls
│   └── booking.service.js   # Bookings API calls
├── store/
│   └── AuthContext.jsx  # Global auth state management
├── utils/
│   ├── constants.js     # Constants and configuration
│   ├── tokenStorage.js  # Token persistence utilities
│   ├── formatDate.js    # Date formatting utilities
│   └── roleHelpers.js   # Role-based utilities
└── styles/
    └── globals.css      # Global styles
```

## Getting Started

### Prerequisites
- Node.js 16+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

The development server runs at `http://localhost:5173` by default.

## API Configuration

The application connects to a Django REST API backend. Configure the base URL:

```javascript
// In src/utils/constants.js
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
```

Create a `.env` file to override:

```
VITE_API_BASE_URL=https://your-api-domain.com
```

## Authentication Flow

1. User logs in with credentials
2. Backend returns `access` and `refresh` tokens
3. Tokens are stored in localStorage
4. Axios interceptor automatically includes access token in requests
5. On 401 response, automatically refresh token and retry
6. On failed refresh, user is redirected to login

## Test Accounts

```
Creator:  username=creator1, password=creator123
User:     username=testuser, password=user123
Admin:    username=admin, password=admin123
```

## Core Hooks

### useAuth()
Global authentication state and methods.

```javascript
const { user, isAuthenticated, login, logout, updateProfile, switchRole } = useAuth()
```

### useSessions()
Session data management.

```javascript
const { sessions, listSessions, getSessionDetail, getMySessions, createSession } = useSessions()
```

### useBookings()
Booking data management.

```javascript
const { bookings, bookSession, getMyBookings, cancelBooking } = useBookings()
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/token/` - Login
- `POST /api/v1/auth/token/refresh/` - Refresh token
- `GET /api/v1/auth/profile/` - Get profile
- `PATCH /api/v1/auth/profile/` - Update profile
- `POST /api/v1/auth/profile/role/` - Switch role
- `POST /api/v1/auth/logout/` - Logout

### Sessions
- `GET /api/v1/sessions/` - List all sessions
- `GET /api/v1/sessions/:id/` - Get session detail
- `GET /api/v1/sessions/mine/` - Get my sessions (creator)
- `POST /api/v1/sessions/` - Create session
- `PATCH /api/v1/sessions/:id/` - Update session
- `POST /api/v1/sessions/:id/cancel/` - Cancel session
- `DELETE /api/v1/sessions/:id/` - Delete session

### Bookings
- `GET /api/v1/bookings/` - List my bookings
- `POST /api/v1/bookings/` - Book session
- `GET /api/v1/bookings/:id/` - Get booking detail
- `POST /api/v1/bookings/:id/cancel/` - Cancel booking
- `GET /api/v1/bookings/creator/` - Creator's bookings

## Pages

- `/` - Session discovery and listing
- `/sessions/:id` - Session detail and booking
- `/login` - Login page
- `/dashboard` - User/Creator dashboard
- `/bookings` - User bookings
- `/profile` - Profile settings
- `/creator` - Creator dashboard
- `/creator/sessions` - Manage sessions
- `/creator/sessions/new` - Create session
- `/creator/bookings` - Creator bookings

## Error Handling

- **401 Unauthorized**: Automatic token refresh or redirect to login
- **403 Forbidden**: Role-based access denied
- **404 Not Found**: Resource not found message
- **400 Bad Request**: Form validation or business logic errors
- **Network Errors**: User-friendly error messages

## Performance Optimization

- Code splitting with React Router
- Lazy component loading
- Debounced search input
- Efficient re-renders with proper dependency arrays
- CSS is inlined for better performance

## Security Features

- JWT token-based authentication
- Secure token storage in localStorage
- Automatic token refresh before expiration
- CORS-friendly Axios configuration
- Protected routes for authenticated users
- Role-based access control

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

### Adding New Features

1. Create feature folder in `src/features/`
2. Create pages in `pages/` subdirectory
3. Create components in `components/` subdirectory
4. Add API service in `src/services/` if needed
5. Add custom hook in `src/hooks/` if needed

### Code Style

- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use custom hooks for logic reuse
- Proper error handling and loading states

## Building for Production

```bash
pnpm run build
```

This creates an optimized production build in the `dist/` directory. The build includes:
- Minified JavaScript and CSS
- Optimized assets
- Code splitting
- Source maps (if enabled)

## Deployment

The built `dist/` folder can be deployed to any static hosting:

```bash
# Deploy to Vercel
vercel

# Or any other hosting provider
```

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.
