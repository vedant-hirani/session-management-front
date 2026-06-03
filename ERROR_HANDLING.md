# Error Handling in Sessions Marketplace Frontend

This document explains how the frontend gracefully handles errors without showing empty pages or exposing raw API errors to users.

## Overview

The application implements a multi-layered error handling strategy:

1. **Error Boundaries** - Catches unexpected component errors
2. **API Error Handling** - Graceful degradation for network failures
3. **User-Friendly Error States** - Clear messaging instead of technical errors
4. **Retry Mechanisms** - Allow users to recover from failures

## Implementation Details

### 1. Global Error Boundary

**File:** `src/components/ErrorBoundary.jsx`

The ErrorBoundary catches unexpected errors at the component level and displays a user-friendly error page:

```jsx
<div style={errorState}>
  <h1>Something Went Wrong</h1>
  <p>We encountered an unexpected error...</p>
  <button>Try Again</button>
  <button>Go Home</button>
</div>
```

**Features:**
- Catches React component errors
- Prevents blank/white screen crashes
- Provides recovery options
- Logs errors to console for debugging

### 2. Page-Level Error States

Each page (SessionsPage, MyBookingsPage, DashboardHome, etc.) implements consistent error handling:

```jsx
{isLoading ? (
  <LoadingState />
) : error && !data.length ? (
  <ErrorState onRetry={handleRetry} />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <DataDisplay />
)}
```

**States Handled:**
- **Loading State** - Shows spinner and "Loading..." message
- **Error State** - Shows warning icon and retry button
- **Empty State** - User-friendly message (no results found)
- **Success State** - Display actual data

### 3. Consistent Error UI

All error states follow a consistent design pattern:

```jsx
<div className="error-state">
  <div className="error-icon">⚠️</div>
  <h2>Unable to Load [Section Name]</h2>
  <p>We're having trouble connecting to our services. Please try again.</p>
  <Button onClick={handleRetry}>Try Again</Button>
</div>
```

**Benefits:**
- Users understand what went wrong (connection issue, not data issue)
- Clear call-to-action (Try Again button)
- No technical jargon or raw error messages
- Consistent styling across all pages

### 4. Fallback Data Display

When errors occur but some data is already loaded, the page shows partial data with a warning:

```jsx
{error && data.length > 0 && (
  <div className="warning-banner">
    <p>Some items couldn't be loaded. Showing available results.</p>
  </div>
)}
```

**Example:** If bookings load but reviews fail, show bookings anyway with a warning.

### 5. API Error Handling

**File:** `src/services/axios.js`

The Axios instance includes:

- **Request Interceptor** - Attaches authentication tokens
- **Response Interceptor** - Handles token refresh and errors
- **401 Handling** - Redirects to login when session expires
- **Generic Error Messages** - Extracts backend messages or provides fallback

### 6. Hook-Level Error Management

Custom hooks (useSessions, useBookings) manage errors properly:

```javascript
const listSessions = useCallback(async (params = {}) => {
  try {
    setIsLoading(true)
    setError(null)  // Clear previous errors
    const data = await sessionService.listAllSessions(params)
    setSessions(data.results)
  } catch (err) {
    const message = err.response?.data?.detail || 'Failed to load sessions'
    setError(message)  // User-friendly fallback
    setSessions([])    // Clear invalid data
  } finally {
    setIsLoading(false)
  }
}, [])
```

## Error Handling by Page

### Sessions Page
- **Loading State:** Spinner with "Loading sessions..."
- **Error State:** Icon + "Unable to Load Sessions" + Retry button
- **Empty State:** "No sessions found" with search tip
- **Partial Error:** Warning banner if some sessions fail to load

### Session Detail Page
- **Loading State:** Spinner with "Loading session..."
- **Error State:** User-friendly "Session Not Available" message
- **Recovery:** Back to Sessions button

### My Bookings Page
- **Loading State:** Spinner with "Loading your bookings..."
- **Error State:** "Unable to Load Bookings" + Retry button
- **Empty State:** "No bookings yet" with action button
- **Partial Error:** Warning if some bookings fail

### Dashboard Pages
- **Loading State:** Spinner with context-specific message
- **Error State:** "Unable to Load Dashboard" + Retry button
- **Creator Dashboard:** Shows stats even if one data source fails
- **Retry Mechanism:** Click "Try Again" to refetch data

## Best Practices for Error Handling

### Do's ✓
- Show user-friendly error messages
- Provide retry mechanisms
- Display partial data when available
- Use consistent error UI components
- Log errors to console for debugging
- Keep loading states visible with text

### Don'ts ✗
- Show raw API error messages to users
- Display empty blank pages on error
- Hide errors without recovery options
- Show technical stack traces
- Mix error messages with normal content
- Expose internal server details

## Testing Error Scenarios

To test error handling:

1. **Network Errors:** Disable network and observe error states
2. **Server Errors:** Backend service returns 500 status
3. **Timeout:** API call takes too long
4. **Partial Failures:** Some endpoints succeed, others fail
5. **Session Expiry:** Token refresh fails

All scenarios should show user-friendly messages and recovery options.

## Future Improvements

- Error analytics tracking
- More granular error categories
- Toast notifications for inline errors
- Network status indicator
- Offline mode support
- Error logging service integration
