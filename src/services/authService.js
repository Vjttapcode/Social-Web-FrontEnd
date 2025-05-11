import api from './axios'
import axios from 'axios'
export const registerUser = (data) => api.post('/signup', data)

// export const registerUser = (data) => {
//   console.log('➤ axios.post to:', 'http://localhost:8080/api/auth/signup', data)
//   return axios.post('http://localhost:8080/api/auth/signup', data)
// }
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// export const registerUser = async (formData) => {
//   try {
//     const response = await axios.post(`http://localhost:8080/api/auth/signup`, formData)
//     return response.data
//   } catch (error) {
//     return error.response.data
//   }
// }

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
