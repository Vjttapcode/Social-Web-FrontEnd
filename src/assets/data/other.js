import { addOrSubtractDaysFromDate, addOrSubtractMinutesFromDate } from '@/utils/date'
import avatar1 from '@/assets/images/avatar/01.jpg'
import avatar2 from '@/assets/images/avatar/02.jpg'
import avatar3 from '@/assets/images/avatar/03.jpg'
import avatar4 from '@/assets/images/avatar/04.jpg'
import avatar5 from '@/assets/images/avatar/05.jpg'
import avatar6 from '@/assets/images/avatar/06.jpg'
import avatar7 from '@/assets/images/avatar/07.jpg'
import avatar8 from '@/assets/images/avatar/08.jpg'
import avatar9 from '@/assets/images/avatar/09.jpg'
import avatar10 from '@/assets/images/avatar/10.jpg'
import avatar11 from '@/assets/images/avatar/11.jpg'
import avatar12 from '@/assets/images/avatar/12.jpg'
import placeholder from '@/assets/images/avatar/placeholder.jpg'
import album1 from '@/assets/images/albums/01.jpg'
import album2 from '@/assets/images/albums/02.jpg'
import album3 from '@/assets/images/albums/03.jpg'
import album4 from '@/assets/images/albums/04.jpg'
import album5 from '@/assets/images/albums/05.jpg'
import album6 from '@/assets/images/albums/06.jpg'
import element14 from '@/assets/images/elements/14.svg'
export const users = [
  {
    id: '101',
    name: 'Dang',
    avatar: placeholder,
    mutualCount: 50,
    role: 'Student',
    status: 'online',
    lastMessage: 'Frances sent a photo.',
    lastActivity: addOrSubtractMinutesFromDate(0),
  },
  {
    id: '102',
    name: 'Duong',
    avatar: placeholder,
    mutualCount: 33,
    isStory: true,
    role: 'Student',
    status: 'online',
    lastMessage: 'You missed a call form Carolyn🤙',
    lastActivity: addOrSubtractMinutesFromDate(1),
  },
  {
    id: '103',
    name: 'Tien',
    avatar: placeholder,
    mutualCount: 21,
    hasRequested: true,
    role: 'Student',
    status: 'offline',
    lastMessage: 'Day sweetness why cordially 😊',
    lastActivity: addOrSubtractMinutesFromDate(2),
  },
  {
    id: '104',
    name: 'Mai',
    avatar: placeholder,
    mutualCount: 45,
    role: 'Student',
    status: 'offline',
    lastMessage: 'Happy birthday🎂',
    lastActivity: addOrSubtractMinutesFromDate(10),
  },
  {
    id: '105',
    name: 'Hien',
    avatar: placeholder,
    mutualCount: 35,
    role: 'Student',
    status: 'online',
    lastMessage: 'Thank you!',
    lastActivity: addOrSubtractMinutesFromDate(120),
  },
  {
    id: '106',
    name: 'Huyen Trang',
    avatar: placeholder,
    mutualCount: 50,
    role: 'Student',
    status: 'online',
    lastMessage: 'Greetings from Webestica.',
    lastActivity: addOrSubtractDaysFromDate(1),
  },
  {
    id: '107',
    name: 'Truc',
    avatar: placeholder,
    mutualCount: 33,
    role: 'Student',
    status: 'offline',
    lastMessage: 'Btw are you looking for job change?',
    lastActivity: addOrSubtractDaysFromDate(4),
  },
  {
    id: '108',
    name: 'Khanh Minh',
    avatar: placeholder,
    mutualCount: 33,
    role: 'Student',
    status: 'offline',
    lastMessage: 'if you are available to discuss🙄',
    lastActivity: addOrSubtractDaysFromDate(4),
  },
  {
    id: '109',
    name: 'Hung Manh',
    avatar: placeholder,
    mutualCount: 33,
    role: 'Student',
    status: 'online',
    lastMessage: '🙌Congrats on your work anniversary!',
    lastActivity: addOrSubtractDaysFromDate(6),
  },
  {
    id: '110',
    name: 'Quoc Khanh',
    avatar: placeholder,
    mutualCount: 33,
    role: 'Student',
    status: 'online',
    lastMessage: 'No sorry, Thanks.',
    lastActivity: addOrSubtractDaysFromDate(10),
  },
  {
    id: '111',
    name: 'Quang Dang',
    avatar: placeholder,
    mutualCount: 33,
    role: 'Student',
    status: 'offline',
    lastMessage: 'Interested can share CV at.',
    lastActivity: addOrSubtractDaysFromDate(18),
  },
]
export const userConnections = [
  {
    id: '251',
    userId: '101',
    role: 'Full Stack Web Developer',
    sharedConnectionAvatars: [placeholder, placeholder, placeholder, placeholder, placeholder],
    description: 'Carolyn Ortiz, Frances Guerrero, and 20 other shared connections',
  },
  {
    id: '252',
    userId: '102',
    role: 'Web Developer | Freelancer',
    sharedConnectionAvatars: [placeholder, placeholder, placeholder, placeholder],
    description: 'Amanda Reed, Lori Stevens, and 10 other shared connections',
  },
  {
    id: '253',
    userId: '103',
    role: 'Full Stack Web Developer',
    description: 'Joan Wallace and Larry Lawson shared connections',
  },
  {
    id: '254',
    userId: '104',
    role: 'Full Stack Web Developer',
    description: 'Samuel Bishop, Judy Nguyen, and 115 other shared connections',
  },
  {
    id: '255',
    userId: '105',
    role: 'Full Stack Web Developer',
    description: 'Bryan Knight and Billy Vasquez shared connections',
  },
]
export const eventScheduleData = [
  {
    id: '901',
    userId: '101',
    date: addOrSubtractDaysFromDate(1, true),
    title: 'Express besides it present',
    description:
      'Particular way thoroughly unaffected projection favorable Mrs can be projecting own. Thirty it matter enable become admire in giving. See resolved goodness felicity shy civility domestic had but. Drawings offended yet answered Jennings perceive laughing six did far.',
    speakerId: ['101', '102'],
  },
  {
    id: '902',
    userId: '102',
    date: addOrSubtractDaysFromDate(380),
    title: 'Making it over 2000 years',
    description:
      'Particular way thoroughly unaffected projection favorable Mrs can be projecting own. Thirty it matter enable become admire in giving. See resolved goodness felicity shy civility domestic had but. Drawings offended yet answered Jennings perceive laughing six did far.',
    speakerId: ['103', '104'],
  },
  {
    id: '903',
    userId: '103',
    date: addOrSubtractDaysFromDate(980),
    title: 'The furnished she concluded depending',
    description:
      'Particular way thoroughly unaffected projection favorable Mrs can be projecting own. Thirty it matter enable become admire in giving. See resolved goodness felicity shy civility domestic had but. Drawings offended yet answered Jennings perceive laughing six did far.',
    speakerId: ['105', '106'],
  },
  {
    id: '904',
    userId: '104',
    date: addOrSubtractDaysFromDate(480),
    title: 'Particular way thoroughly',
    description:
      'Particular way thoroughly unaffected projection favorable Mrs can be projecting own. Thirty it matter enable become admire in giving. See resolved goodness felicity shy civility domestic had but. Drawings offended yet answered Jennings perceive laughing six did far.',
    speakerId: ['106', '107'],
  },
]
export const mediaData = [
  {
    id: '851',
    image: album1,
    comments: 3000,
    likes: 22000,
    time: '02:20',
    title: 'Cover Photos',
    count: 5,
  },
  {
    id: '852',
    image: album2,
    comments: 12000,
    likes: 32000,
    time: '01:15',
    title: 'Profile pictures',
    count: 20,
  },
  {
    id: '853',
    image: album3,
    comments: 4000,
    likes: 21000,
    time: '02:00',
    title: 'Untitled pictures',
    count: 12,
  },
  {
    id: '854',
    image: album4,
    comments: 16000,
    likes: 32000,
    time: '01:00',
  },
  {
    id: '855',
    image: album5,
    comments: 8000,
    likes: 20000,
    time: '02:20',
  },
  {
    id: '856',
    image: album6,
    comments: 12000,
    likes: 56000,
    time: '02:20',
  },
]
export const messages = []
const defaultTo = {
  id: '108',
  lastActivity: addOrSubtractMinutesFromDate(0),
  lastMessage: 'Hey! Okay, thank you for letting me know. See you!',
  status: 'online',
  avatar: avatar10,
  mutualCount: 30,
  name: 'Judy Nguyen',
  role: 'web',
}
for (const user of users) {
  messages.push(
    {
      id: '451',
      to: defaultTo,
      from: user,
      message: 'Applauded no discovery in newspaper allowance am northward😊',
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '452',
      to: user,
      from: defaultTo,
      message: 'With pleasure',
      sentOn: addOrSubtractMinutesFromDate(100),
      isRead: true,
    },
    {
      id: '454',
      to: user,
      from: defaultTo,
      message: 'No visited raising gravity outward subject my cottage Mr be.',
      sentOn: addOrSubtractMinutesFromDate(100),
      isRead: true,
    },
    {
      id: '455',
      to: defaultTo,
      from: user,
      message: 'Please find the attached updated files',
      sentOn: addOrSubtractMinutesFromDate(90),
    },
    {
      id: '456',
      to: defaultTo,
      from: user,
      message: 'How promotion excellent curiosity yet attempted happiness Gay prosperous impression😮',
      sentOn: addOrSubtractMinutesFromDate(80),
    },
    {
      id: '457',
      to: defaultTo,
      from: user,
      message: 'Congratulations:)',
      sentOn: addOrSubtractMinutesFromDate(80),
      image: element14,
    },
    {
      id: '458',
      to: user,
      from: defaultTo,
      message: 'And sir dare view but over man So at within mr to simple assure Mr disposing.',
      sentOn: addOrSubtractMinutesFromDate(80),
      isSend: true,
    },
    // {
    //   id: '458',
    //   to: user,
    //   from: defaultTo,
    //   message: 'And sir dare view but over man So at within mr to simple assure Mr disposing.',
    //   sentOn: addOrSubtractMinutesFromDate(80),
    // },
    {
      id: '459',
      to: defaultTo,
      from: user,
      message: 'Traveling alteration impression 🤐 six all uncommonly Chamber hearing inhabit joy highest private.',
      sentOn: addOrSubtractMinutesFromDate(80),
    },
  )
}
