import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  TabContainer,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'react-bootstrap'
import GlightBox from '@/components/GlightBox'
import PageMetaData from '@/components/PageMetaData'
import useToggle from '@/hooks/useToggle'

const AllPhotos = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { isTrue: isOpen, toggle } = useToggle()

  let userId = null
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      userId = payload.userId
    } catch (e) {
      console.error('Invalid token', e)
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/post/get-post/${userId}`)
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const json = await res.json()
        const data = Array.isArray(json.data) ? json.data : [json.data]
        setPosts(data)
      } catch (err) {
        console.error('Failed to load posts:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [userId])

  if (loading) return <div className="text-center py-5">Loading photos...</div>

  const allIds = posts.reduce((acc, p) => {
    if (Array.isArray(p.imageId)) acc.push(...p.imageId)
    else if (typeof p.imageId === 'string') acc.push(p.imageId)
    return acc
  }, [])

  return (
    <>
      <PageMetaData title="Photos" />
      <Card>
        <CardHeader className="border-0 pb-0">
          <h4 className="card-title mb-0">Photos</h4>
        </CardHeader>
        <CardBody>
          <TabContainer defaultActiveKey="your-photos">
            <Nav className="nav-tabs nav-bottom-line mb-3">
              <NavItem>
                <NavLink eventKey="your-photos">Your Photos</NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey="recently-added">Recently Added</NavLink>
              </NavItem>
            </Nav>
            <TabContent>
              <TabPane eventKey="your-photos">
                <Row className="g-3">
                  {allIds.map((id) => (
                    <Col xs={6} lg={3} key={id} className="position-relative">
                      <GlightBox href={`/api/image/get-image/${id}`} data-gallery="photos">
                        <img src={`/api/image/get-image/${id}`} alt="user-photo" className="rounded img-fluid" />
                      </GlightBox>
                    </Col>
                  ))}
                  {allIds.length === 0 && <p className="text-center w-100">No photos to display.</p>}
                </Row>
              </TabPane>
              <TabPane eventKey="recently-added">
                <Row className="g-3">
                  {allIds.slice(-4).map((id) => (
                    <Col xs={6} lg={3} key={id}>
                      <GlightBox href={`/api/image/get-image/${id}`} data-gallery="recent">
                        <img src={`/api/image/get-image/${id}`} alt="recent-photo" className="rounded img-fluid" />
                      </GlightBox>
                    </Col>
                  ))}
                  {allIds.slice(-4).length === 0 && <p className="text-center w-100">No recent photos.</p>}
                </Row>
              </TabPane>
            </TabContent>
          </TabContainer>
        </CardBody>
      </Card>

      <Modal show={isOpen} onHide={toggle} centered>
        <ModalHeader closeButton>Modal</ModalHeader>
        <ModalBody>Content here</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default AllPhotos
