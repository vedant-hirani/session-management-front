import { useState, useCallback } from 'react'
import bookingService from '../services/booking.service'

export function useBookings() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  const bookSession = useCallback(async (sessionId) => {
    try {
      setIsLoading(true)
      setError(null)
      const booking = await bookingService.bookSession(sessionId)
      return booking
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to book session'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getMyBookings = useCallback(async (params = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await bookingService.getMyBookings(params)
      setBookings(data.results)
      setPagination(data.pagination)
      return data
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load bookings'
      setError(message)
      setBookings([])
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getActiveBookings = useCallback(async (params = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await bookingService.getActiveBookings(params)
      setBookings(data.results)
      setPagination(data.pagination)
      return data
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load active bookings'
      setError(message)
      setBookings([])
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getBookingDetail = useCallback(async (bookingId) => {
    try {
      setIsLoading(true)
      setError(null)
      const booking = await bookingService.getBookingDetail(bookingId)
      return booking
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load booking'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      setIsLoading(true)
      setError(null)
      const booking = await bookingService.cancelBooking(bookingId)
      return booking
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to cancel booking'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getCreatorBookings = useCallback(async (params = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await bookingService.getCreatorBookings(params)
      setBookings(data.results)
      setPagination(data.pagination)
      return data
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load creator bookings'
      setError(message)
      setBookings([])
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    bookings,
    isLoading,
    error,
    pagination,
    bookSession,
    getMyBookings,
    getActiveBookings,
    getBookingDetail,
    cancelBooking,
    getCreatorBookings,
  }
}
