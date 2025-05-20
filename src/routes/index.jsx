import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

//home page
const HomeDemo = lazy(() => import('@/app/(social)/feed/(container)/home/page'))
const HomePost = lazy(() => import('@/app/(social)/(with-topbar)/posts/page'))

//pages
const Albums = lazy(() => import('@/app/(social)/feed/(container)/albums/page'))
const Messaging = lazy(() => import('@/app/(social)/(with-topbar)/messaging/page'))
const Groups = lazy(() => import('@/app/(social)/feed/(container)/groups/page'))
const PostDetails = lazy(() => import('@/app/(social)/(with-topbar)/feed/post-details/page'))
const Blogs = lazy(() => import('@/app/(social)/(with-topbar)/blogs/page'))

//profile pages
const ProfileFeed = lazy(() => import('@/app/(social)/profile/feed/page'))
const ProfileAbout = lazy(() => import('@/app/(social)/profile/about/page'))
const ProfileMedia = lazy(() => import('@/app/(social)/profile/media/page'))

//account pages
const AccountSetting = lazy(() => import('@/app/(social)/settings/account/page'))
const AccountNotifications = lazy(() => import('@/app/(social)/settings/notification/page'))
const AccountClose = lazy(() => import('@/app/(social)/settings/close-account/page'))
const NotificationPage = lazy(() => import('@/app/(social)/(with-topbar)/notifications/page'))

//auth routes
const ForgotPass = lazy(() => import('@/app/(plain)/(authentication)/auth/forgot-pass/page'))
const SignInAdvance = lazy(() => import('@/app/(plain)/(authentication)/auth-advance/sign-in/page'))
const SignUpAdvance = lazy(() => import('@/app/(plain)/(authentication)/auth-advance/sign-up/page'))
const ForgotPassAdvance = lazy(() => import('@/app/(plain)/(authentication)/auth-advance/forgot-pass/page'))
const NotFoundPage = lazy(() => import('@/app/(social)/(with-topbar)/not-found/page'))
const OfflinePage = lazy(() => import('@/app/(plain)/offline/page'))
const initialRoutes = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/feed/home" />,
  },
]

// feed with container
const generalRoutes = [
  {
    path: '/feed/home',
    name: 'Demo Home',
    element: <HomeDemo />,
  },
  {
    path: '/feed/albums',
    name: 'Albums',
    element: <Albums />,
  },
  {
    path: '/feed/groups',
    name: 'Groups',
    element: <Groups />,
  },
]

//plain routes
const otherRoutes = [
  {
    path: '/offline',
    name: 'Offline',
    element: <OfflinePage />,
  },
]
export const settingPagesRoutes = [
  {
    path: '/settings/account',
    name: 'Account Settings',
    element: <AccountSetting />,
  },
  {
    path: '/settings/notification',
    name: 'Account Notification',
    element: <AccountNotifications />,
  },
  {
    path: '/settings/close-account',
    name: 'Account Close',
    element: <AccountClose />,
  },
]

//social pages with topbar
export const socialWithTopbarRoutes = [
  {
    path: '/posts',
    name: 'Home Posts',
    element: <HomePost />,
  },
  {
    path: '/messaging',
    name: 'Messaging',
    element: <Messaging />,
  },
  {
    path: '/notifications',
    name: 'Notification',
    element: <NotificationPage />,
  },
  {
    path: '/feed/post-details',
    name: 'Post Details',
    element: <PostDetails />,
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    element: <Blogs />,
  },
  {
    path: '*',
    name: 'not-found',
    element: <NotFoundPage />,
  },
  {
    path: '/not-found',
    name: 'Not Found',
    element: <NotFoundPage />,
  },
]
export const profilePagesRoutes = [
  {
    path: '/profile/feed',
    name: 'Feed',
    element: <ProfileFeed />,
  },
  {
    path: '/profile/about',
    name: 'About',
    element: <ProfileAbout />,
  },
  {
    path: '/profile/media',
    name: 'Media',
    element: <ProfileMedia />,
  },
]
export const authRoutes = [
  {
    path: '/auth/forgot-pass',
    name: 'Sign In',
    element: <ForgotPass />,
  },
  {
    path: '/auth-advance/sign-in',
    name: 'Sign In Advance',
    element: <SignInAdvance />,
  },
  {
    path: '/auth-advance/sign-up',
    name: 'Sign Up Advance',
    element: <SignUpAdvance />,
  },
  {
    path: '/auth-advance/forgot-pass',
    name: 'Sign Up Advance',
    element: <ForgotPassAdvance />,
  },
]
export const appRoutes = [...otherRoutes]
export const feedRoutes = [...initialRoutes, ...generalRoutes]
