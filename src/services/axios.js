import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/auth', // ghi đúng host+port + prefix
  headers: { 'Content-Type': 'application/json' },
})

export default api
