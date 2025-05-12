import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as yup from 'yup'
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import axios from 'axios'
//import httpClient from '@/helpers/httpClient';

const httpClient = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: { 'Content-Type': 'application/json' },
})

const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { saveSession } = useAuthContext()
  const [searchParams] = useSearchParams()
  const { showNotification } = useNotificationContext()
  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
  })
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    // defaultValues: {
    //   email: 'user@demo.com',
    //   password: '123456',
    // },
  })
  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo')
    if (redirectLink) navigate(redirectLink)
    else navigate('/')
  }

  const login = handleSubmit(async (values) => {
    setLoading(true)
    try {
      // URL của bạn
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/signin`

      // Gửi request
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      // Chuyển về JSON
      const data = await resp.json()

      if (resp.ok && data.token) {
        localStorage.setItem('token', data.token)
        // lưu session
        saveSession({ ...data, token: data.token })

        showNotification({
          message: 'Successfully logged in. Redirecting…',
          variant: 'success',
        })

        if (!data.userInfoId) {
          navigate('/setup-profile')
        } else {
          redirectUser()
        }
      } else {
        // hiển thị lỗi từ server
        showNotification({
          message: data.error || data.message || 'Login failed',
          variant: 'danger',
        })
      }
    } catch (err) {
      console.error('[useSignIn] fetch error:', err)
      showNotification({
        message: err.message || 'Login failed',
        variant: 'danger',
      })
    } finally {
      setLoading(false)
    }
  })
  return {
    loading,
    login,
    control,
  }
}
export default useSignIn
