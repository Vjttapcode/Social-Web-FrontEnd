import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import { Card, CardBody, CardFooter } from 'react-bootstrap'
const SettingPanel = ({ links }) => {
  const { pathname } = useLocation()
  return (
    <>
      <Card className="w-100">
        <CardBody>
          <ul className="nav nav-tabs nav-pills nav-pills-soft flex-column fw-bold gap-2 border-0">
            {links.map((item, idx) => (
              <li className="nav-item" key={idx}>
                <Link
                  className={clsx('nav-link d-flex mb-0', {
                    active: pathname === item.link,
                  })}
                  to={item.link}>
                  <img height={20} width={19} className="me-2 h-20px fa-fw" src={item.image} alt="image" />
                  <span>{item.name} </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardBody>
        <CardFooter className="text-center py-2">
          <Link to="/profile/feed" className="text-secondary btn btn-link btn-sm">
            View Profile
          </Link>
        </CardFooter>
      </Card>
    </>
  )
}
export default SettingPanel
