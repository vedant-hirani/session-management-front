import axiosInstance from './axios'

const bookingService = {
  bookSession: async (sessionId) => {
    const response = await axiosInstance.post('/bookings/', {
      session_id: sessionId,
    })
    return response.data
  },

  getMyBookings: async (params = {}) => {
    const response = await axiosInstance.get('/bookings/', { params })
    return response.data
  },

  getActiveBookings: async (params = {}) => {
    const response = await axiosInstance.get('/bookings/', {
      params: { ...params, active: true },
    })
    return response.data
  },

  getBookingDetail: async (bookingId) => {
    const response = await axiosInstance.get(`/bookings/${bookingId}/`)
    return response.data
  },

  cancelBooking: async (bookingId) => {
    const response = await axiosInstance.post(`/bookings/${bookingId}/cancel/`)
    return response.data
  },

  getCreatorBookings: async (params = {}) => {
    const response = await axiosInstance.get('/bookings/creator/', { params })
    return response.data
  },
}

export default bookingService
