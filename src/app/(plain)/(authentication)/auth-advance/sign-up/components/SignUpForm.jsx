import PasswordFormInput from '@/components/form/PasswordFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { Button, FormCheck } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { registerUser } from '../../../../../../services/authService'
import { useNavigate } from 'react-router-dom'

const SignUpForm = () => {
  const navigate = useNavigate()
  const [firstPassword, setFirstPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const signUpSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('please enter your email'),
    password: yup.string().required('Please enter your password'),
  })
  const { control, watch, getValues, handleSubmit } = useForm({
    resolver: yupResolver(signUpSchema),
  })
  useEffect(() => {
    setFirstPassword(getValues().password)
  }, [watch('password')])

  // const onSubmit = async (data) => {
  //   console.log(data)
  //   setMessage('')
  //   setErrorMessage('')
  //   try {
  //     const response = await registerUser(data)
  //     if (response.data.success) {
  //       setMessage('Account Registered successfully')
  //       setTimeout(() => navigate('/auth-advance/sign-in'), 1000)
  //     } else {
  //       setTimeout(() => setErrorMessage(response.data.message), 3000)
  //     }
  //   } catch (error) {
  //     setTimeout(() => setErrorMessage(error.response?.data?.message || 'Registration failed'), 1000)
  //   }
  // }
  const onSubmit = async (data) => {
    setMessage('')
    setErrorMessage('')

    try {
      const resp = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await resp.json()

      if (resp.ok) {
        // đăng ký thành công (201 hoặc 200)
        setMessage('Account registered successfully!')
        setErrorMessage('')
      } else {
        // resp không ok (4xx, 5xx)
        setErrorMessage(result.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Fetch signup error:', err)
      setErrorMessage(err.message || 'Registration failed')
    }
  }
  return (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-3 text-start">
        <TextFormInput name="email" control={control} containerClassName="input-group-lg" placeholder="Enter email" />
        <small>We&apos;ll never share your email with anyone else.</small>
      </div>
      <div className="mb-3 position-relative">
        <PasswordFormInput name="password" control={control} size="lg" placeholder="Enter new password" />
        <div className="mt-2">
          <PasswordStrengthMeter password={firstPassword} />
        </div>
      </div>
      <div className="d-grid">
        <Button variant="primary" size="lg" type="submit">
          Sign me up
        </Button>
      </div>
      {message && <p className="text-success mt-3">{message}</p>}
      {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
    </form>
  )
}
export default SignUpForm
