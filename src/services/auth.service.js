import axiosInstance from './axios'

const authService = {
  login: async (username, password) => {
    const response = await axiosInstance.post('/auth/token/', {
      username,
      password,
    })
    return response.data
  },

  register: async ({ email, username, password, password2, role }) => {
    const response = await axiosInstance.post('/auth/register/', {
      email,
      username,
      password,
      password2,
      role,
    })
    return response.data
  },

  logout: async (refreshToken) => {
    try {
      await axiosInstance.post('/auth/logout/', {
        refresh: refreshToken,
      })
    } catch (error) {
      // Clean silent logout cleanup
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

  oauthSetup: async ({ username, role }) => {
    const response = await axiosInstance.post('/auth/oauth/setup/', { username, role })
    return response.data
  },

  healthCheck: async () => {
    const response = await axiosInstance.get('/auth/health/')
    return response.data
  },
}

export default authService
