import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Modal, Button, Form } from 'react-bootstrap'
import Feeds from './components/Feeds'
import Followers from './components/Followers'
import LoadContentButton from '@/components/LoadContentButton'
import { FaPlus } from 'react-icons/fa'
import { useAuthContext } from '@/context/useAuthContext'
import placeholder from '@/assets/images/avatar/placeholder.jpg'

const Home = () => {
  const { user } = useAuthContext()

  // State for Create Post modal
  const [showModal, setShowModal] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // State for all posts
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingError, setLoadingError] = useState(null)

  // Fetch all posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/get-all-posts', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const json = await res.json()
        // assume API returns { success, data: [posts] }
        setPosts(json.data || [])
      } catch (err) {
        console.error('Fetch posts error:', err)
        setLoadingError(err.message)
      } finally {
        setLoadingPosts(false)
      }
    }
    fetchPosts()
  }, [user.token])

  const handleOpen = () => setShowModal(true)
  const handleClose = () => {
    setShowModal(false)
    setPostContent('')
    setImageFile(null)
    setPreviewUrl('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!postContent.trim() && !imageFile) return
    setSubmitting(true)
    try {
      let imageId = null
      if (imageFile) {
        const fd = new FormData()
        fd.append('image', imageFile)
        const uploadRes = await fetch('/api/image/post-image', {
          method: 'POST',
          headers: { Authorization: `Bearer ${user.token}` },
          body: fd,
        })
        if (!uploadRes.ok) throw new Error('Image upload failed')
        const uploadData = await uploadRes.json()
        imageId = uploadData.imageId
      }
      const postBody = { userId: user.userId, content: postContent, comments: [], status: 'public' }
      if (imageId) postBody.imageId = imageId
      const postRes = await fetch('/api/post/add-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(postBody),
      })
      if (!postRes.ok) throw new Error('Failed to create post')

      // Refresh posts list
      setLoadingPosts(true)
      setLoadingError(null)
      const refreshRes = await fetch('/api/post/get-all-posts', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      if (!refreshRes.ok) throw new Error(`Error ${refreshRes.status}`)
      const refreshJson = await refreshRes.json()
      setPosts(refreshJson.data || [])

      handleClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
      setLoadingPosts(false)
    }
  }

  return (
    <>
      <Col md={8} lg={6} className="vstack gap-4">
        {/* Create a Post Button */}
        <div className="mb-3 text-center">
          <Button variant="primary" onClick={handleOpen}>
            <FaPlus className="me-2" /> Create a Post
          </Button>
        </div>

        {/* Display all posts */}
        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : loadingError ? (
          <p className="text-danger">Error: {loadingError}</p>
        ) : (
          posts.map((post, idx) => (
            <Card key={`${post._id}-${idx}`}>
              <CardHeader className="d-flex align-items-center">
                <img
                  src={post.info?.imageId ? `/api/image/get-image/${post.info.imageId}` : '/placeholder-avatar.jpg'}
                  className="rounded-circle me-2"
                  width={40}
                  height={40}
                />
                <div>
                  <strong>{post.info?.name || 'Anonymous'}</strong>
                  <br />
                  <small>{new Date(post.createdAt).toLocaleString()}</small>
                </div>
              </CardHeader>
              <CardBody>
                <p>{post.content}</p>
                {post.imageId && <img src={`/api/image/get-image/${post.imageId}`} alt="post" className="img-fluid rounded" />}
              </CardBody>
            </Card>
          ))
        )}
      </Col>

      {/* Sidebar */}
      <Col lg={3}>
        <Row className="g-4">
          <Col sm={6} lg={12}>
            <Followers />
          </Col>
          <Col sm={6} lg={12}>
            <Card>
              <CardHeader className="pb-0 border-0">
                <CardTitle className="mb-0">Today’s news</CardTitle>
              </CardHeader>
              <CardBody>
                <LoadContentButton name="View all latest news" />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>

      {/* Create Post Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="postContent" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
              />
            </Form.Group>
            <Form.Group controlId="postImage" className="mb-3">
              <Form.Label>Image (optional)</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>
            {previewUrl && (
              <div className="mb-3 text-center">
                <img src={previewUrl} alt="preview" className="img-fluid rounded" />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Posting...' : 'Post'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Home
