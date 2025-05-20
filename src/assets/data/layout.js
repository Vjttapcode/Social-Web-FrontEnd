import homeImg from '@/assets/images/icon/home-outline-filled.svg'
import personImg from '@/assets/images/icon/person-outline-filled.svg'
import medalImg from '@/assets/images/icon/medal-outline-filled.svg'
import clockImg from '@/assets/images/icon/clock-outline-filled.svg'
import chatImg from '@/assets/images/icon/chat-outline-filled.svg'
import notificationImg from '@/assets/images/icon/notification-outlined-filled.svg'
import cogImg from '@/assets/images/icon/cog-outline-filled.svg'
import likeImg from '@/assets/images/icon/like-outline-filled.svg'
import starImg from '@/assets/images/icon/star-outline-filled.svg'
import taskDoneImg from '@/assets/images/icon/task-done-outline-filled.svg'
import arrowBoxedImg from '@/assets/images/icon/arrow-boxed-outline-filled.svg'
import handshakeImg from '@/assets/images/icon/handshake-outline-filled.svg'
import trashImg from '@/assets/images/icon/trash-var-outline-filled.svg'
import logo8 from '@/assets/images/logo/08.svg'
import logo9 from '@/assets/images/logo/09.svg'
import logo10 from '@/assets/images/logo/10.svg'
export const profilePanelLinksData1 = [
  {
    image: homeImg,
    name: 'Personal Feed',
    link: '/profile/feed',
  },
  {
    image: personImg,
    name: 'Chatbot',
    link: '/chatbot',
  },
  {
    image: handshakeImg,
    name: 'Messaging',
    link: '/messaging',
  },
  {
    image: chatImg,
    name: 'Groups',
    link: '/feed/groups',
  },
  {
    image: cogImg,
    name: 'Settings',
    link: '/settings/account',
  },
]
export const profilePanelLinksData2 = [
  {
    image: homeImg,
    name: 'Feed',
    link: '/profile/feed',
  },
  {
    image: medalImg,
    name: 'Popular',
    link: '',
  },
  {
    image: clockImg,
    name: 'Recent',
    link: '',
  },
  {
    image: likeImg,
    name: 'Subscriptions',
    link: '',
  },
  {
    image: starImg,
    name: 'My favorites',
    link: '',
  },
  {
    image: taskDoneImg,
    name: 'Wishlist',
    link: '',
  },
  {
    image: notificationImg,
    name: 'Notifications',
    link: '/notifications',
  },
  {
    image: cogImg,
    name: 'Settings',
    link: '/settings/account',
  },
  {
    image: arrowBoxedImg,
    name: 'Logout',
    link: '/auth/sign-in',
  },
]
export const settingPanelLinksData = [
  {
    image: notificationImg,
    name: 'Notification',
    link: '/settings/notification',
  },
  {
    image: trashImg,
    name: 'Close account',
    link: '/settings/close-account',
  },
]
