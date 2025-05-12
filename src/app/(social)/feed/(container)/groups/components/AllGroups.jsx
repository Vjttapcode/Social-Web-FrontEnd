import { useState, useEffect } from 'react'
import ChoicesFormInput from '@/components/form/ChoicesFormInput'

import useToggle from '@/hooks/useToggle'
import { useAuthContext } from '@/context/useAuthContext'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContainer,
  TabContent,
  TabPane,
  Form,
} from 'react-bootstrap'
import { BsGlobe, BsLock, BsPeople } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import placeholderImg from '@/assets/images/avatar/placeholder.jpg'
import { FaPencil } from 'react-icons/fa6'

const GroupCard = ({ group }) => {
  const { image, logo, memberCount, members, name, ppd, type, isJoin } = group
  return (
    <Card>
      <div
        className="h-80px rounded-top"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <CardBody className="text-center pt-0">
        <div className="avatar avatar-lg mt-n5 mb-3">
          <Link to="/feed/groups/details">
            <img className="avatar-img rounded-circle border border-white border-3 bg-white" src={logo} alt="group" />
          </Link>
        </div>
        <h5 className="mb-0">
          <Link to="/feed/groups/details">{name}</Link>
        </h5>
        <small className="icons-center gap-1">
          {type === 'Private' ? <BsLock size={17} className="pe-1" /> : <BsGlobe size={18} className="pe-1" />} {type} Group
        </small>
        <div className="hstack gap-2 gap-xl-3 justify-content-center mt-3">
          <div>
            <h6 className="mb-0">{memberCount}</h6>
            <small>Members</small>
          </div>
          <div className="vr" />
          <div>
            <h6 className="mb-0">{ppd}</h6>
            <small>Posts per day</small>
          </div>
        </div>
        <ul className="avatar-group list-unstyled align-items-center justify-content-center mb-0 mt-3">
          {members.map((avatar, idx) => (
            <li className="avatar avatar-xs" key={idx}>
              <img className="avatar-img rounded-circle" src={avatar} alt="avatar" />
            </li>
          ))}
          <li className="avatar avatar-xs">
            <div className="avatar-img rounded-circle bg-primary">
              <span className="smaller text-white position-absolute top-50 start-50 translate-middle">+{Math.floor(Math.random() * 30)}</span>
            </div>
          </li>
        </ul>
      </CardBody>
      <CardFooter className="text-center">
        <Button variant={isJoin ? 'danger-soft' : 'success-soft'} size="sm">
          {isJoin ? 'Leave' : 'Join'} group
        </Button>
      </CardFooter>
    </Card>
  )
}

const AllGroups = () => {
  const { user } = useAuthContext()
  const { isTrue: isOpen, toggle } = useToggle()

  // State for fetched groups
  const [allGroups, setAllGroups] = useState([])
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Create Group form state
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  // Effect: fetch all groups directly without helper
  useEffect(() => {
    const fetchGroups = async () => {
      setLoadingGroups(true)
      setLoadError('')
      try {
        const res = await fetch('/api/group/get-all-groups', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const json = await res.json()
        setAllGroups(json.data || [])
      } catch (err) {
        console.error('Fetch groups failed', err)
        setLoadError(err.message)
      } finally {
        setLoadingGroups(false)
      }
    }
    fetchGroups()
  }, [user.token])

  // Image input handler
  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  // Create group API call
  const handleCreateGroup = async () => {
    if (!groupName.trim()) return setError('Group name is required')
    setCreating(true)
    setError('')
    try {
      let imageId = null
      if (file) {
        const fd = new FormData()
        fd.append('image', file)
        const upRes = await fetch('/api/image/post-image', {
          method: 'POST',
          headers: { Authorization: `Bearer ${user.token}` },
          body: fd,
        })
        if (!upRes.ok) throw new Error('Image upload failed')
        const { imageId: id } = await upRes.json()
        imageId = id
      }

      const body = { name: groupName, description, imageId }
      const res = await fetch('/api/group/add-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg || 'Group creation failed')
      }
      // reload list
      toggle()
      setGroupName('')
      setDescription('')
      setFile(null)
      setPreview('')
      // refetch groups
      const reloadRes = await fetch('/api/group/get-all-groups', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })
      const reloadJson = await reloadRes.json()
      setAllGroups(reloadJson.data || [])
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const GroupNotFound = () => (
    <div className="my-sm-5 py-sm-5 text-center">
      <BsPeople className="display-1 text-body-secondary" />
      <h4 className="mt-2 mb-3 text-body">No group found</h4>
      <Button variant="primary-soft" size="sm" onClick={toggle}>
        Click here to add
      </Button>
    </div>
  )

  return (
    <>
      <CardBody>
        <Card>
          <CardHeader className="border-0 pb-0">
            <Row className="g-2">
              <Col lg={2}>
                <h1 className="h4 card-title mb-lg-0">Groups</h1>
              </Col>
              <Col sm={6} lg={3} className="ms-lg-auto">
                <ChoicesFormInput
                  options={{ searchEnabled: false }}
                  className="form-select js-choice choice-select-text-none"
                  data-search-enabled="false">
                  <option value="AB">Alphabetical</option>
                  <option value="NG">Newest group</option>
                  <option value="RA">Recently active</option>
                  <option value="SG">Suggested</option>
                </ChoicesFormInput>
              </Col>
              <Col sm={6} lg={3}>
                <Button variant="primary-soft" className="ms-auto w-100" onClick={toggle}>
                  <FaPlus className="pe-1" /> Create Group
                </Button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <TabContainer defaultActiveKey="tab-1">
              <Nav className="nav-tabs nav-bottom-line justify-content-center justify-content-md-start">
                <NavItem>
                  <NavLink eventKey="tab-1">Friends&apos; groups</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey="tab-2">Suggested for you</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey="tab-3">Popular near you</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink eventKey="tab-4">More suggestions</NavLink>
                </NavItem>
              </Nav>
              <TabContent className="mb-0 pb-0">
                <TabPane eventKey="tab-1" className="fade">
                  <Row className="g-4">
                    {allGroups?.slice(0, 5).map((group, idx) => (
                      <Col sm={6} lg={4} key={idx}>
                        <GroupCard group={group} />
                      </Col>
                    ))}
                  </Row>
                </TabPane>
                <TabPane eventKey="tab-2" className="fade">
                  <Row className="g-4">
                    {allGroups?.slice(5, 8).map((group, idx) => (
                      <Col sm={6} lg={4} key={idx}>
                        <GroupCard group={group} />
                      </Col>
                    ))}
                  </Row>
                </TabPane>
                <TabPane eventKey="tab-3" className="fade">
                  <GroupNotFound />
                </TabPane>
                <TabPane eventKey="tab-4" className="fade">
                  <GroupNotFound />
                </TabPane>
              </TabContent>
            </TabContainer>
          </CardBody>
        </Card>
      </CardBody>

      <Modal show={isOpen} onHide={toggle} centered>
        <ModalHeader closeButton>
          <Modal.Title>Create Group</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Group name</Form.Label>
              <Form.Control type="text" placeholder="Add group name here" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Group picture</Form.Label>
              <Form.Control type="file" accept=".png, .jpg, .jpeg" onChange={handleFileChange} />
              {preview && (
                <div className="mt-3 text-center">
                  <img src={preview} alt="preview" className="img-fluid rounded-circle shadow" width={100} height={100} />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Group description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            {error && <p className="text-danger">{error}</p>}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onClick={toggle} disabled={creating}>
            Cancel
          </Button>
          <Button variant="success-soft" onClick={handleCreateGroup} disabled={creating}>
            {creating ? 'Creating...' : 'Create now'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default AllGroups
