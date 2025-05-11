import { useForm } from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const useLogin = () => {
  const { control, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const login = handleSubmit(async (data) => {
    setLoading(true)
    try {
      // Gọi API đăng nhập
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email: data.email,
        password: data.password,
      })

      const { token, user } = response.data

      // Lưu token vào localStorage
      localStorage.setItem('token', token)

      // Gắn token vào axios cho các request sau
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Điều hướng sau khi đăng nhập thành công
      navigate('/dashboard') // hoặc bất kỳ route nào bạn muốn
    } catch (error) {
      // Hiển thị lỗi (tuỳ ý xử lý chi tiết)
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  })

  return { control, login, loading }
}

export default useLogin
