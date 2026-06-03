export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export const ROLES = {
  USER: 'user',
  CREATOR: 'creator',
}

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

export const SESSION_STATUS = {
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  DRAFT: 'draft',
}

export const PAGINATION_PAGE_SIZE = 20
