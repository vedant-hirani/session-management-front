import axiosInstance from './axios'

const sessionService = {
  listAllSessions: async (params = {}) => {
    const response = await axiosInstance.get('/sessions/', { params })
    return response.data
  },

  getSessionDetail: async (sessionId) => {
    const response = await axiosInstance.get(`/sessions/${sessionId}/`)
    return response.data
  },

  getMySessions: async (params = {}) => {
    const response = await axiosInstance.get('/sessions/mine/', { params })
    return response.data
  },

  createSession: async (sessionData) => {
    const response = await axiosInstance.post('/sessions/', sessionData)
    return response.data
  },

  updateSession: async (sessionId, sessionData) => {
    const response = await axiosInstance.patch(`/sessions/${sessionId}/`, sessionData)
    return response.data
  },

  cancelSession: async (sessionId) => {
    const response = await axiosInstance.post(`/sessions/${sessionId}/cancel/`)
    return response.data
  },

  deleteSession: async (sessionId) => {
    const response = await axiosInstance.delete(`/sessions/${sessionId}/`)
    return response.data
  },

  searchSessions: async (searchQuery, params = {}) => {
    const response = await axiosInstance.get('/sessions/', {
      params: { ...params, search: searchQuery },
    })
    return response.data
  },

  filterSessionsByTag: async (tag, params = {}) => {
    const response = await axiosInstance.get('/sessions/', {
      params: { ...params, tag },
    })
    return response.data
  },

  filterSessionsByPriceRange: async (minPrice, maxPrice, params = {}) => {
    const response = await axiosInstance.get('/sessions/', {
      params: { ...params, min_price: minPrice, max_price: maxPrice },
    })
    return response.data
  },

  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axiosInstance.post('/sessions/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}


export default sessionService
