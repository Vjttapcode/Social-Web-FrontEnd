import api from './axios'
import axios from 'axios'
export const registerUser = (data) => api.post('/signup', data)

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
      email,
      password,
    })
    return response.data
  } catch (error) {
    return error.response.data
  }
}
