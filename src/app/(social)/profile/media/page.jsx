import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Row, Col, Modal } from 'react-bootstrap'
import PageMetaData from '@/components/PageMetaData'

const Media = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  // Decode JWT to get userId
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
        console.warn('No userId, skipping fetchImages')
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/post/get-post/${userId}`)
        if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`)
        const json = await res.json()
        const posts = Array.isArray(json.data) ? json.data : [json.data]

        const ids = posts.reduce((acc, p) => {
          if (Array.isArray(p.imageId) && p.imageId.length > 0) {
            acc.push(...p.imageId)
          } else if (typeof p.imageId === 'string' && p.imageId) {
            acc.push(p.imageId)
          }
          return acc
        }, [])

        setImages(ids)
      } catch (err) {
        console.error('Error loading images:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [userId])

  const handleImageClick = (id) => {
    setSelectedImage(id)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setSelectedImage(null)
  }

  if (loading) return <div className="text-center py-5">Loading album...</div>

  return (
    <>
      <PageMetaData title="Photos" />
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Photos</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-3">
            {images.length === 0 && <p className="text-center w-100">No photos to display.</p>}
            {images.map((id, idx) => (
              <Col key={idx} xs={6} sm={4} md={3} lg={2}>
                <img
                  src={`/api/image/get-image/${id}`}
                  alt={`img-${idx}`}
                  className="img-fluid rounded"
                  style={{ maxHeight: '150px', objectFit: 'cover', width: '100%', cursor: 'pointer' }}
                  onClick={() => handleImageClick(id)}
                />
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>

      {/* Modal for full-size image */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Body className="p-0">
          {selectedImage && <img src={`/api/image/get-image/${selectedImage}`} alt="Selected" className="w-100" style={{ objectFit: 'contain' }} />}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Media
