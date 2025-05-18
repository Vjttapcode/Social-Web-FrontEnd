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
const GroupCard = ({ group, onJoin, onLeave, processingGroupId, onDelete, deletingGroupId }) => {
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
        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant={isJoin ? 'secondary' : 'success-soft'}
            size="sm"
            disabled={isJoin || processingGroupId === group._id}
            onClick={() => !isJoin && onJoin(group._id)}
            type="button">
            {isJoin ? 'Joined' : processingGroupId === group._id ? 'Joining...' : 'Join'}
          </Button>

          {isJoin && (
            <Button variant="danger-soft" size="sm" disabled={processingGroupId === group._id} onClick={() => onLeave(group._id)} type="button">
              {processingGroupId === group._id ? 'Leaving...' : 'Leave'}
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" disabled={deletingGroupId === group._id} onClick={() => onDelete(group._id)}>
              {deletingGroupId === group._id ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

/** Component chính hiển thị & tạo nhóm */
const AllGroups = () => {
  const { user } = useAuthContext()
  const { isTrue: isOpen, toggle } = useToggle()

  // Tab active
  const [activeTab, setActiveTab] = useState('created')

  // States nhóm
  const [allGroups, setAllGroups] = useState([])
  const [createdGroups, setCreatedGroups] = useState([])
  const [otherGroups, setOtherGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // States Create Group
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const [processingGroupId, setProcessingGroupId] = useState(null)
  const [deletingGroupId, setDeletingGroupId] = useState(null)

  // Fetch và phân tách groups
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
  }, [user.token, user.userId])

  // Preview file
  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  // Tạo group mới, cập nhật state cục bộ
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

      const res = await fetch('/api/group/add-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: groupName, description, imageId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Group creation failed')

      const newGroup = json.data
      setAllGroups((prev) => [newGroup, ...prev])
      setCreatedGroups((prev) => [newGroup, ...prev])
      setOtherGroups((prev) => prev.filter((g) => g._id !== newGroup._id))
      setActiveTab('created')
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

  // Tham gia group
  const handleJoinGroup = async (groupId) => {
    setProcessingGroupId(groupId)
    try {
      const res = await fetch(`/api/group/join-group/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || json.message || 'Join failed')

      setAllGroups((prev) => prev.map((g) => (g._id === groupId ? { ...g, isJoin: true, memberCount: g.memberCount + 1 } : g)))
      setOtherGroups((prev) => prev.map((g) => (g._id === groupId ? { ...g, isJoin: true, memberCount: g.memberCount + 1 } : g)))
    } catch (err) {
      console.error('Join group failed', err)
    } finally {
      setProcessingGroupId(null)
    }
  }

  const handleLeaveGroup = async (groupId) => {
    setProcessingGroupId(groupId)
    try {
      const res = await fetch(`/api/group/leave-group/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (!res.ok) {
        // Nếu không phải JSON, lấy raw text để xem thông báo
        const errText = await res.text()
        throw new Error(`Leave failed: ${errText}`)
      }

      await res.json()

      // Cập nhật lại state như trước
      setAllGroups((prev) => prev.map((g) => (g._id === groupId ? { ...g, isJoin: false, memberCount: g.memberCount - 1 } : g)))
      setCreatedGroups((prev) => prev.map((g) => (g._id === groupId ? { ...g, isJoin: false, memberCount: g.memberCount - 1 } : g)))
      setOtherGroups((prev) => prev.map((g) => (g._id === groupId ? { ...g, isJoin: false, memberCount: g.memberCount - 1 } : g)))
    } catch (err) {
      console.error('Leave group failed', err)
    } finally {
      setProcessingGroupId(null)
    }
  }

  const handleDeleteGroup = async (groupId) => {
    setDeletingGroupId(groupId)
    try {
      const res = await fetch(`/api/group/delete-group/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })
      if (!res.ok) throw new Error('Delete failed')
      await res.json()

      // remove group khỏi tất cả các list
      setAllGroups((prev) => prev.filter((g) => g._id !== groupId))
      setCreatedGroups((prev) => prev.filter((g) => g._id !== groupId))
      setOtherGroups((prev) => prev.filter((g) => g._id !== groupId))
    } catch (err) {
      console.error('Delete group failed', err)
    } finally {
      setDeletingGroupId(null)
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
                    <NavLink eventKey="created">My Created Groups</NavLink>
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
                            <GroupCard
                              group={grp}
                              onJoin={handleJoinGroup}
                              processingGroupId={processingGroupId}
                              onDelete={handleDeleteGroup}
                              deletingGroupId={deletingGroupId}
                            />
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
                            <GroupCard group={grp} onJoin={handleJoinGroup} onLeave={handleLeaveGroup} processingGroupId={processingGroupId} />
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
