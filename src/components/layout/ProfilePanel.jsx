import { Card, CardBody, CardFooter } from 'react-bootstrap'
import placeholder from '@/assets/images/avatar/placeholder.jpg'
import bgBannerImg from '@/assets/images/bg/01.jpg'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../context/useAuthContext'
const ProfilePanel = ({ links }) => {
  const { userInfo, avatarUrl } = useAuthContext()

  return (
    <>
      <Card className="overflow-hidden h-100">
        <div
          className="h-50px"
          style={{
            backgroundImage: `url(${bgBannerImg})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <CardBody className="pt-0">
          <div className="text-center">
            <div className="avatar avatar-lg mt-n5 mb-3">
              <span role="button">
                <img height={64} width={64} src={avatarUrl || placeholder} alt="avatar" className="avatar-img rounded border border-white border-3" />
              </span>
            </div>

            <h5 className="mb-0">
              <Link to="/profile/feed">{userInfo?.name || 'User'} </Link>
            </h5>
            <small>{userInfo?.university || 'Your school'}</small>
            <p className="mt-3">{userInfo?.bio || 'Love coding!'}</p>

            <div className="hstack gap-2 gap-xl-3 justify-content-center">
              <div>
                <h6 className="mb-0">256</h6>
                <small>Posts</small>
              </div>
              <div className="vr" />
              <div>
                <h6 className="mb-0">2.5K</h6>
                <small>Followers</small>
              </div>
              <div className="vr" />
              <div>
                <h6 className="mb-0">365</h6>
                <small>Following</small>
              </div>
            </div>
          </div>

          <hr />

          <ul className="nav nav-link-secondary flex-column fw-bold gap-2">
            {links.map((item, idx) => (
              <li key={item.name + idx} className="nav-item">
                <Link className="nav-link" to={item.link}>
                  <img src={item.image} alt="icon" height={40} width={40} className="me-2 h-20px fa-fw" />
                  <span>{item.name} </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardBody>

        <CardFooter className="text-center py-2">
          <Link className="btn btn-sm btn-link" to="/profile/feed">
            View Profile
          </Link>
        </CardFooter>
      </Card>
    </>
  )
}
export default ProfilePanel
