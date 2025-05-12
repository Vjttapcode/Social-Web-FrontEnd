import { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap'
import { useAuthContext } from '@/context/useAuthContext'

export default function EditProfileModal({ show, onHide, onSave }) {
  const { user, userInfo, saveSession, avatarUrl } = useAuthContext()

  // form state
  const [form, setForm] = useState({
    name: '',
    university: '',
    bio: '',
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [saving, setSaving] = useState(false)

  // initialize form and avatar when modal opens
  useEffect(() => {
    if (show && userInfo) {
      setForm({
        name: userInfo.name || '',
        university: userInfo.university || '',
        bio: userInfo.bio || '',
      })
      setAvatarPreview(avatarUrl || '')
    }
  }, [show, userInfo, avatarUrl])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let imageId = userInfo.imageId
      // 1) If new avatar selected, update it
      if (avatarFile) {
        const fd = new FormData()
        fd.append('image', avatarFile)
        const res = await fetch(`/api/image/update-image/${userInfo.imageId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: fd,
        })
        if (!res.ok) throw new Error('Upload avatar failed')
        const data = await res.json()
        imageId = data.imageId
      }

      // 2) Update userInfo
      const updateRes = await fetch(`/api/user-info/update-user-info/${user.userInfoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: form.name,
          university: form.university,
          bio: form.bio,
          imageId,
        }),
      })
      if (!updateRes.ok) {
        const errText = await updateRes.text()
        throw new Error(errText || 'Update user info failed')
      }
      const json = await updateRes.json()

      // 3) Update context and parent
      saveSession({ ...user, ...json.data })
      onSave && onSave(json.data)
      onHide()
    } catch (err) {
      console.error(err)
      // TODO: show error notification
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col className="text-center mb-3">
              <Image src={avatarPreview || '/placeholder-avatar.png'} roundedCircle width={80} height={80} className="mb-2" />
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="editName">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="editUniversity">
                <Form.Label>University</Form.Label>
                <Form.Control name="university" value={form.university} onChange={handleChange} placeholder="Your university" />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="editBio" className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control as="textarea" rows={3} name="bio" value={form.bio} onChange={handleChange} placeholder="A short bio..." />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
