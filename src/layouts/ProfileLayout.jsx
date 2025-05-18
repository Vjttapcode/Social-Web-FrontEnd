import { lazy, Suspense, useState } from 'react'
const TopHeader = lazy(() => import('@/components/layout/TopHeader'))
import GlightBox from '@/components/GlightBox'
import { useFetchData } from '@/hooks/useFetchData'
import clsx from 'clsx'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Container, Row } from 'react-bootstrap'
import { BsChatLeftText, BsPatchCheckFill, BsPencilFill, BsPersonX, Bs0CircleFill } from 'react-icons/bs'
import { PROFILE_MENU_ITEMS } from '@/assets/data/menu-items'
import { getAllUsers } from '@/helpers/data'
import placeholder from '@/assets/images/avatar/placeholder.jpg'
import background5 from '@/assets/images/bg/05.jpg'
import { Link, useLocation } from 'react-router-dom'
import FallbackLoading from '@/components/FallbackLoading'
import Preloader from '@/components/Preloader'
import EditProfileModal from '../components/EditProfileModal'
import { useAuthContext } from '../context/useAuthContext'
import { useEffect } from 'react'
const Photos = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  // Decode JWT to extract userId
  const token = localStorage.getItem('token')
  let userId = null
  if (token) {
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      userId = payload.userId
    } catch (e) {
      console.error('Invalid token format', e)
    }
  }

  useEffect(() => {
    const fetchImages = async () => {
      if (!userId) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/post/get-post/${userId}`)
        if (!res.ok) throw new Error(`Error fetching posts: ${res.status}`)
        const json = await res.json()
        const posts = Array.isArray(json.data) ? json.data : [json.data]
        // Gather image IDs
        const ids = posts.reduce((acc, p) => {
          if (Array.isArray(p.imageId) && p.imageId.length) acc.push(...p.imageId)
          else if (typeof p.imageId === 'string') acc.push(p.imageId)
          return acc
        }, [])
        setImages(ids)
      } catch (err) {
        console.error('Failed to load images:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [userId])

  if (loading) {
    return <div className="text-center py-5">Loading photos...</div>
  }

  return (
    <>
      <Card>
        <CardHeader className="d-sm-flex justify-content-between border-0">
          <CardTitle>Photos</CardTitle>
          <Link to="/profile/media">
            <Button variant="primary-soft" size="sm">
              See all photos
            </Button>
          </Link>
        </CardHeader>
        <CardBody className="position-relative pt-0">
          <Row className="g-2">
            {images.length === 0 && <p className="text-center w-100">No photos to display.</p>}
            {images.map((id) => (
              <Col xs={6} md={4} lg={3} key={id}>
                <GlightBox href={`/api/image/get-image/${id}`} data-gallery="image-popup">
                  <img
                    src={`/api/image/get-image/${id}`}
                    alt="album"
                    className="rounded img-fluid"
                    style={{ maxHeight: 150, objectFit: 'cover', width: '100%' }}
                  />
                </GlightBox>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </>
  )
}
// const Friends = () => {
//   const allFriends = useFetchData(getAllUsers)
//   return (
//     <Card>
//       <CardHeader className="d-sm-flex justify-content-between align-items-center border-0">
//         <CardTitle>
//           Friends <span className="badge bg-danger bg-opacity-10 text-danger">230</span>
//         </CardTitle>
//         <Button variant="primary-soft" size="sm">
//           See all friends
//         </Button>
//       </CardHeader>
//       <CardBody className="position-relative pt-0">
//         <Row className="g-3">
//           {allFriends?.slice(0, 4).map((friend, idx) => (
//             <Col xs={6} key={idx}>
//               <Card className="shadow-none text-center h-100">
//                 <CardBody className="p-2 pb-0">
//                   <div
//                     className={clsx('avatar avatar-xl', {
//                       'avatar-story': friend.isStory,
//                     })}>
//                     <span role="button">
//                       <img className="avatar-img rounded-circle" src={friend.avatar} alt="" />
//                     </span>
//                   </div>
//                   <h6 className="card-title mb-1 mt-3">
//                     <Link to=""> {friend.name} </Link>
//                   </h6>
//                   <p className="mb-0 small lh-sm">{friend.mutualCount} mutual connections</p>
//                 </CardBody>
//                 <div className="card-footer p-2 border-0">
//                   <button className="btn btn-sm btn-primary me-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Send message">
//                     <BsChatLeftText />
//                   </button>
//                   <button className="btn btn-sm btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Remove friend">
//                     <BsPersonX />
//                   </button>
//                 </div>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </CardBody>
//     </Card>
//   )
// }
const ProfileLayout = ({ children }) => {
  const { pathname } = useLocation()
  const [editShow, setEditShow] = useState(false)
  const { userInfo, avatarUrl } = useAuthContext()
  return (
    <>
      <Suspense fallback={<Preloader />}>
        <TopHeader />
      </Suspense>

      <main>
        <Container>
          <Row className="g-4">
            <Col lg={8} className="vstack gap-4">
              <Card>
                <div
                  className="h-200px rounded-top"
                  style={{
                    backgroundImage: `url(${background5})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <CardBody className="py-0">
                  <div className="d-sm-flex align-items-start text-center text-sm-start">
                    <div>
                      <div className="avatar avatar-xxl mt-n5 mb-3">
                        <img className="avatar-img rounded-circle border border-white border-3" src={avatarUrl || placeholder} alt="avatar" />
                      </div>
                    </div>
                    <div className="ms-sm-4 mt-sm-3">
                      <h1 className="mb-0 h5">
                        {userInfo?.name || 'User'} <BsPatchCheckFill className="text-success small" />
                      </h1>
                      <p>{userInfo?.university || 'Your school'}</p>
                    </div>
                    <div className="d-flex mt-3 justify-content-center ms-sm-auto">
                      <Button variant="danger-soft" className="me-2" type="button" onClick={() => setEditShow(true)}>
                        <BsPencilFill size={19} className="pe-1" /> Edit profile
                      </Button>
                      <EditProfileModal show={editShow} onHide={() => setEditShow(false)} />
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="card-footer mt-3 pt-2 pb-0">
                  <ul className="nav nav-bottom-line align-items-center justify-content-center justify-content-md-start mb-0 border-0">
                    {PROFILE_MENU_ITEMS.map((item, idx) => (
                      <li className="nav-item" key={idx}>
                        <Link
                          className={clsx('nav-link', {
                            active: pathname === item.url,
                          })}
                          to={item.url ?? ''}>
                          {item.label} {item.badge && <span className="badge bg-success bg-opacity-10 text-success small"> {item.badge.text}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardFooter>
              </Card>
              <Suspense fallback={<FallbackLoading />}> {children}</Suspense>
            </Col>
            <Col lg={4}>
              <Row className="g-4">
                <Col md={6} lg={12}>
                  <Card>
                    <CardHeader className="border-0 pb-0">
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardBody className="position-relative pt-0">
                      <p>{userInfo?.bio || 'Your description'}</p>
                      <ul className="list-unstyled mt-3 mb-0">
                        <li className="mb-2">
                          <Bs0CircleFill size={18} className="fa-fw pe-1" /> Name: <strong> {userInfo?.name || 'Your name'} </strong>
                        </li>
                        <li className="mb-2">
                          <Bs0CircleFill size={18} className="fa-fw pe-1" /> Uni: <strong> {userInfo?.university || 'Your school'} </strong>
                        </li>
                      </ul>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6} lg={12}>
                  <Photos />
                </Col>
                {/* <Col md={6} lg={12}>
                  <Friends />
                </Col> */}
              </Row>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}
export default ProfileLayout
