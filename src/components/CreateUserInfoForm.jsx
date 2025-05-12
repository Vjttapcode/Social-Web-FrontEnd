// src/components/CreateUserInfoForm.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Form, Button, Image, Row, Col } from 'react-bootstrap'
import { useAuthContext } from '@/context/useAuthContext'
import { useNavigate } from 'react-router-dom'

const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const schema = yup.object({
  name: yup.string().required('Vui lòng nhập tên'),
  bio: yup.string().required('Vui lòng nhập tiểu sử'),
  university: yup.string().required('Vui lòng nhập trường'),
})

export default function CreateUserInfoForm() {
  const { user, saveSession } = useAuthContext()
  const navigate = useNavigate()

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async ({ name, bio, university }) => {
    setLoading(true)
    setError('')

    // 1️⃣ Debug: in token để chắc chắn không undefined
    const token = localStorage.getItem('token')
    console.log('🔑 Using token from localStorage:', token)

    if (!token) {
      setError('No auth token found. Please login again.')
      setLoading(false)
      return
    }

    try {
      let imageId = null
      if (avatarFile) {
        const fd = new FormData()
        fd.append('image', avatarFile)

        const uploadRes = await fetch(`/api/image/post-image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        })
        if (!uploadRes.ok) {
          const txt = await uploadRes.text()
          throw new Error(`Upload avatar thất bại: ${txt}`)
        }
        const { imageId: id } = await uploadRes.json()
        imageId = id
      }

      // 2️⃣ Gọi API post-user-info với header Authorization
      const infoRes = await fetch(`/api/user-info/post-user-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ← cực kỳ quan trọng
        },
        body: JSON.stringify({ name, bio, university, imageId }),
      })
      console.log('📡 POST /api/user-info/post-user-info →', infoRes.status)
      const raw = await infoRes.text()
      console.log('📄 response body:', raw)

      if (!infoRes.ok) {
        // parse hoặc hiển thị nguyên raw
        let msg
        try {
          msg = JSON.parse(raw).message || JSON.parse(raw).error
        } catch {
          msg = raw
        }
        throw new Error(`Saving profile failed: ${msg}`)
      }
      const infoData = JSON.parse(raw)

      // 3️⃣ Cập nhật session và redirect
      saveSession({
        ...user,
        userInfoId: infoData.data._id,
      })
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="inputName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Your name" isInvalid={!!errors.name} {...register('name')} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="inputUniversity">
            <Form.Label>University</Form.Label>
            <Form.Control type="text" placeholder="Your university" isInvalid={!!errors.university} {...register('university')} />
            <Form.Control.Feedback type="invalid">{errors.university?.message}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="inputBio">
        <Form.Label>Bio</Form.Label>
        <Form.Control as="textarea" rows={3} placeholder="A short bio" isInvalid={!!errors.bio} {...register('bio')} />
        <Form.Control.Feedback type="invalid">{errors.bio?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="inputAvatar" className="mb-4">
        <Form.Label>Avatar Image</Form.Label>
        <div className="d-flex align-items-center gap-3">
          {avatarPreview && <Image src={avatarPreview} roundedCircle width={80} height={80} />}
          <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      </Form.Group>

      {error && <p className="text-danger mb-3">{error}</p>}

      <div className="d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save Profile'}
        </Button>
      </div>
    </Form>
  )
}
