import { Link } from 'react-router-dom'
export const celebrationData = [
  {
    id: '251',
    userId: '101',
    title: (
      <>
        <h6>
          <Link to="">Dangtongthong </Link>
        </h6>
        <p className="small ms-sm-2 mb-0 mb-sm-2">Today is her birthday</p>
      </>
    ),
    placeholder: 'Happy birthday dear...',
  },
  {
    id: '252',
    userId: '102',
    title: (
      <>
        <h6>
          <Link to="">Thuc Anh </Link>
        </h6>
        <p className="small ms-sm-2 mb-0 mb-sm-2">Today is her birthday</p>
      </>
    ),
    placeholder: 'Birthday wish here...',
    textAvatar: {
      text: 'BV',
      variant: 'danger',
    },
  },
  {
    id: '253',
    userId: '103',
    title: (
      <p className="mb-0 mb-sm-2">
        Congratulate
        <Link to="" className="h6">
          Hoang Nghia
        </Link>
        for 3 years at
        <Link className="h6" to="">
          Bootstrap - Front-end framework
        </Link>
      </p>
    ),
    placeholder: 'Congratulate',
  },
  {
    id: '254',
    userId: '104',
    title: (
      <p>
        Khoi Vu and 3 other connections are attending <strong> WordCamps San Francisco.</strong>
      </p>
    ),
    isEvent: true,
  },
  {
    id: '255',
    userId: '105',
    title: (
      <>
        <h6>
          <Link to="">Quoc Anh </Link>
        </h6>
        <p className="small ms-sm-2 mb-0 mb-sm-2">Birthday is in 2 january</p>
      </>
    ),
    placeholder: 'Birthday wish here...',
  },
  {
    id: '256',
    userId: '106',
    title: (
      <>
        <h6>
          <Link to="">Mai Dang</Link>
        </h6>
        <p className="small ms-sm-2 mb-0 mb-sm-2">Birthday is in 10 march</p>
      </>
    ),
    placeholder: 'Happy Birthday dear...',
  },
  {
    id: '257',
    userId: '107',
    title: (
      <p className="mb-0 mb-sm-2">
        Congratulate
        <Link to="" className="h6">
          Khanh Linh
        </Link>
        for 3 years at
        <Link className="h6" to="">
          Bootstrap - Front-end framework
        </Link>
      </p>
    ),
    placeholder: 'Congratulate',
  },
  {
    id: '258',
    userId: '108',
    title: (
      <p>
        Quoc Truong and 5 other connections are attending <strong> WordCamps New York.</strong>
      </p>
    ),
    isEvent: true,
  },
]
