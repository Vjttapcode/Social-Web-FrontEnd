import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next'
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAvatarBlob, fetchUserInfo } from '../services/UserInfoService'

const AuthContext = createContext()

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

const authSessionKey = '_SOCIAL_AUTH_KEY_'

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const getSession = () => {
    const cookie = getCookie(authSessionKey)?.toString()
    const session = cookie ? JSON.parse(cookie) : {}
    const token = localStorage.getItem('token')
    if (token) session.token = token
    return Object.keys(session).length ? session : null
  }
  const [user, setUser] = useState(getSession())
  const [userInfo, setUserInfo] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  const loadUserInfo = async (session) => {
    if (!session?.userInfoId || !session.token) return
    try {
      const info = await fetchUserInfo(session.userInfoId, session.token)
      setUserInfo(info)
      if (info.imageId) {
        const blob = await fetchAvatarBlob(info.imageId, session.token)
        setAvatarUrl(URL.createObjectURL(blob))
      }
    } catch (err) {
      console.error('Lỗi loadUserInfo:', err)
    }
  }

  const saveSession = (session) => {
    localStorage.setItem('token', session.token)
    const { token, ...rest } = session
    setCookie(authSessionKey, JSON.stringify(rest))
    setUser({ ...rest, token })
    loadUserInfo({ ...rest, token })
  }

  const removeSession = () => {
    deleteCookie(authSessionKey)
    localStorage.removeItem('token')
    setUser(null)
    setUserInfo(null)
    setAvatarUrl(null)
    navigate('/auth-advance/sign-in')
  }

  useEffect(() => {
    if (user) loadUserInfo(user)
  }, [])
  return (
    <AuthContext.Provider
      value={{
        user,
        userInfo,
        avatarUrl,
        isAuthenticated: !!user,
        saveSession,
        removeSession,
      }}>
      {children}
    </AuthContext.Provider>
  )
}
