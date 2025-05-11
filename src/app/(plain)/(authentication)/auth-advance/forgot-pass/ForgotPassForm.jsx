import PasswordFormInput from '@/components/form/PasswordFormInput'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import TextFormInput from '@/components/form/TextFormInput'
import { sendForgotPasswordCode, resetPassword } from '../../../../../services/authForgotService'

const ForgotPassForm = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [firstPassword, setFirstPassword] = useState('')

  // Buoc 1
  const emailSchema = yup.object({
    email: yup.string().email('Invalid email').required('Please enter your email'),
  })
  const {
    control: controlEmail,
    handleSubmit: submitEmail,
    formState: { errors: emailErrors },
  } = useForm({ resolver: yupResolver(emailSchema) })

  // Buoc 2
  const resetSchema = yup.object({
    email: yup.string().email('Invalid Email').required('Please enter your email'),
    code: yup.string().required('Please enter the code'),
    password: yup.string().required('Please enter your new password'),
  })

  const {
    control: resetControl,
    handleSubmit: onResetSubmit,
    watch: resetWatch,
    getValues: resetGetValues,
    formState: { errors: resetErrors },
  } = useForm({
    resolver: yupResolver(resetSchema),
    defaultValues: {
      email: '',
      code: '',
      password: '',
    },
  })

  useEffect(() => {
    setFirstPassword(resetGetValues().password || '')
  }, [resetWatch('password')])

  const onSendCode = async ({ email }) => {
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await sendForgotPasswordCode(email)
      setMessage(res.message)
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onReset = async ({ email, code, password }) => {
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res = await resetPassword({ email, code, password })
      setMessage(res.message)
      // chuyển về trang đăng nhập sau 2s
      setTimeout(() => navigate('/auth-advance/sign-in'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-pass-form">
      {step === 1 && (
        <form onSubmit={submitEmail(onSendCode)} noValidate className="mt-3">
          <TextFormInput name="email" control={controlEmail} placeholder="Enter your email" containerClassName="mb-3 input-group-lg" />
          {emailErrors.email && <p className="text-danger">{emailErrors.email.message}</p>}
          <div className="d-grid">
            <Button variant="primary" size="lg" type="submit" disabled={loading}>
              {loading ? 'Sending code…' : 'Send code'}
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={onResetSubmit(onReset)} noValidate className="mt-3">
          <h4>Reset Password</h4>

          {/* 1. Email */}
          <TextFormInput name="email" control={resetControl} placeholder="Enter your email" containerClassName="mb-3 input-group-lg" />
          {resetErrors.email && <p className="text-danger">{resetErrors.email.message}</p>}

          {/* 2. Code */}
          <TextFormInput name="code" control={resetControl} placeholder="Enter verification code" containerClassName="mb-3 input-group-lg" />
          {resetErrors.code && <p className="text-danger">{resetErrors.code.message}</p>}

          {/* 3. New Password */}
          <PasswordFormInput name="password" control={resetControl} placeholder="Enter new password" size="lg" containerClassName="mb-3" />
          {resetErrors.password && <p className="text-danger">{resetErrors.password.message}</p>}

          <div className="mb-2">
            <PasswordStrengthMeter password={firstPassword} />
          </div>

          <div className="d-grid">
            <Button variant="primary" size="lg" type="submit" disabled={loading}>
              {loading ? 'Resetting…' : 'Reset password'}
            </Button>
          </div>
        </form>
      )}

      {message && <p className="text-success mt-3">{message}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}

      <p className="mt-3">
        Back to <Link to="/auth-advance/sign-in">Sign in</Link>
      </p>
    </div>
  )
}
export default ForgotPassForm
