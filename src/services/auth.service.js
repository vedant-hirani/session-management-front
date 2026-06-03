import axiosInstance from './axios'

const authService = {
  login: async (username, password) => {
    const response = await axiosInstance.post('/auth/token/', {
      username,
      password,
    })
    return response.data
  },

  logout: async (refreshToken) => {
    try {
      await axiosInstance.post('/auth/logout/', {
        refresh: refreshToken,
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile/')
    return response.data
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.patch('/auth/profile/', profileData)
    return response.data
  },

  switchRole: async (role) => {
    const response = await axiosInstance.post('/auth/profile/role/', {
      role,
    })
    return response.data
  },

  healthCheck: async () => {
    const response = await axiosInstance.get('/auth/health/')
    return response.data
  },
}

export default authService
