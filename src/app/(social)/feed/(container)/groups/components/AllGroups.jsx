import { useState, useEffect } from 'react'
import { useAuthContext } from '@/context/useAuthContext'
import useToggle from '@/hooks/useToggle'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
import { BsGlobe, BsLock } from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import placeholderImg from '@/assets/images/avatar/placeholder.jpg'

/** Component đại diện cho 1 nhóm */
const GroupCard = ({ group }) => {
  const { bannerUrl, logoUrl, memberCount, members = [], name, ppd, type, isJoin } = group

  return (
    <Card className="h-100">
      <div
        className="h-80px rounded-top"
        style={{
          backgroundImage: `url(${bannerUrl || placeholderImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <CardBody className="text-center pt-0">
        <div className="avatar avatar-lg mt-n5 mb-3">
          <Link to={`/feed/groups/${group._id}`}>
            <img className="avatar-img rounded-circle border border-white border-3 bg-white" src={logoUrl || placeholderImg} alt={name} />
          </Link>
        </div>
        <h5 className="mb-0">
          <Link to={`/feed/groups/${group._id}`}>{name}</Link>
        </h5>
        <small className="d-flex align-items-center justify-content-center gap-1 text-muted">
          {type === 'Private' ? <BsLock /> : <BsGlobe />} {type} Group
        </small>
        <div className="hstack gap-2 gap-xl-3 justify-content-center mt-3">
          <div>
            <h6 className="mb-0">{memberCount}</h6>
            <small>Members</small>
          </div>
          <div className="vr" />
          <div>
            <h6 className="mb-0">{ppd}</h6>
            <small>Posts/day</small>
          </div>
        </div>
        <ul className="avatar-group list-unstyled align-items-center justify-content-center mb-0 mt-3">
          {members.slice(0, 5).map((m, i) => (
            <li className="avatar avatar-xs" key={i}>
              <img className="avatar-img rounded-circle" src={m.avatarUrl || placeholderImg} alt={m.name} />
            </li>
          ))}
          {members.length > 5 && (
            <li className="avatar avatar-xs">
              <div className="avatar-img rounded-circle bg-primary">
                <span className="smaller text-white position-absolute top-50 start-50 translate-middle">+{members.length - 5}</span>
              </div>
            </li>
          )}
        </ul>
      </CardBody>
      <CardFooter className="text-center">
        <Button variant={isJoin ? 'danger-soft' : 'success-soft'} size="sm">
          {isJoin ? 'Leave' : 'Join'}
        </Button>
      </CardFooter>
    </Card>
  )
}

/** Component chính hiển thị & tạo nhóm */
const AllGroups = () => {
  const { user } = useAuthContext()
  const { isTrue: isOpen, toggle } = useToggle()

  // 1. Tab active
  const [activeTab, setActiveTab] = useState('created')

  // 2. States nhóm
  const [allGroups, setAllGroups] = useState([])
  const [createdGroups, setCreatedGroups] = useState([])
  const [otherGroups, setOtherGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // 3. States Create Group
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  /** Fetch và phân tách groups */
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true)
      setLoadError('')
      try {
        const res = await fetch('/api/group/get-all-groups', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || `Error ${res.status}`)

        const groups = json.data || []
        setAllGroups(groups)

        // **CHÍNH XÁC** filter theo creator ID
        setCreatedGroups(groups.filter((g) => g.admins?.[0]?._id === user.userId))
        setOtherGroups(groups.filter((g) => g.admins?.[0]?._id !== user.userId))
      } catch (err) {
        console.error('Fetch groups failed', err)
        setLoadError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchGroups()
  }, [user.token, user.id])

  /** Preview file */
  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  /** Tạo group mới, chỉ cập nhật state cục bộ */
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setCreateError('Group name is required')
      return
    }
    setCreating(true)
    setCreateError('')

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
        const upJson = await upRes.json()
        if (!upRes.ok) throw new Error(upJson.message || 'Image upload failed')
        imageId = upJson.imageId
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
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Group creation failed')

      const newGroup = json.data

      // **CẬP NHẬT LOCAL STATE**
      setAllGroups((prev) => [newGroup, ...prev])
      setCreatedGroups((prev) => [newGroup, ...prev])
      setOtherGroups((prev) => prev.filter((g) => g._id !== newGroup._id))

      // Chuyển về tab "My Created"
      setActiveTab('created')

      // Đóng modal & reset form
      toggle()
      setGroupName('')
      setDescription('')
      setFile(null)
      setPreview('')
    } catch (err) {
      console.error('Create group failed', err)
      setCreateError(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <>
      <CardBody>
        <Card>
          <CardHeader className="d-flex align-items-center justify-content-between border-0 pb-0">
            <h4 className="card-title mb-0">Groups</h4>
            <Button variant="primary-soft" onClick={toggle} type="button">
              <FaPlus className="me-1" /> Create Group
            </Button>
          </CardHeader>

          <CardBody>
            {loading && <p>Loading groups...</p>}
            {loadError && <p className="text-danger">Error: {loadError}</p>}

            {!loading && !loadError && (
              <TabContainer activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="tabs">
                  <NavItem>
                    <NavLink eventKey="created">My Groups</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="others">Other Groups</NavLink>
                  </NavItem>
                </Nav>

                <TabContent className="mt-4">
                  <TabPane eventKey="created">
                    {createdGroups.length > 0 ? (
                      <Row className="g-4">
                        {createdGroups.map((grp, i) => (
                          <Col sm={6} lg={4} key={i}>
                            <GroupCard group={grp} />
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div className="text-center py-5">Bạn chưa tạo nhóm nào.</div>
                    )}
                  </TabPane>

                  <TabPane eventKey="others">
                    {otherGroups.length > 0 ? (
                      <Row className="g-4">
                        {otherGroups.map((grp, i) => (
                          <Col sm={6} lg={4} key={i}>
                            <GroupCard group={grp} />
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div className="text-center py-5">Không có nhóm nào khác.</div>
                    )}
                  </TabPane>
                </TabContent>
              </TabContainer>
            )}
          </CardBody>
        </Card>
      </CardBody>

      {/* Modal tạo nhóm */}
      <Modal show={isOpen} onHide={toggle} centered>
        <ModalHeader closeButton>
          <Modal.Title>Create Group</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3">
              <Form.Label>Group name</Form.Label>
              <Form.Control type="text" placeholder="Add group name here" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Group picture</Form.Label>
              <Form.Control type="file" accept=".png,.jpg,.jpeg" onChange={handleFileChange} />
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

            {createError && <p className="text-danger">{createError}</p>}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onClick={toggle} disabled={creating} type="button">
            Cancel
          </Button>
          <Button variant="success-soft" onClick={handleCreateGroup} disabled={creating} type="button">
            {creating ? 'Creating...' : 'Create now'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default AllGroups
