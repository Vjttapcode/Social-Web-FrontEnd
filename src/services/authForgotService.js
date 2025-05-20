const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const TIMEOUT = 10000

export async function sendForgotPasswordCode(email) {
  const resp = await fetch(`${API_ROOT}/api/auth/send-forgot-password-code`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const data = await resp.json()
  if (!resp.ok) {
    throw new Error(data.message || 'Failed to send reset code')
  }
  return data
}

export async function resetPassword({ email, code, password }) {
  const resp = await fetch(`${API_ROOT}/api/auth/verify-forgot-password-code`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      providedCode: code,
      newPassword: password,
    }),
  })

  const data = await resp.json()
  if (!resp.ok) {
    throw new Error(data.message || 'Failed to reset password')
  }
  return data
}
