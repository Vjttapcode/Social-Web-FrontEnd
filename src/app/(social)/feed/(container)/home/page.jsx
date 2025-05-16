import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Modal, Button, Form } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import Followers from './components/Followers'
import LoadContentButton from '@/components/LoadContentButton'
import { useAuthContext } from '@/context/useAuthContext'

const Home = () => {
  const { user } = useAuthContext()

  // State for creating posts
  const [showModal, setShowModal] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // State for posts list
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingError, setLoadingError] = useState(null)

  // State for new comment inputs
  const [newComments, setNewComments] = useState({})

  // Fetch all posts with comments embedded
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/get-all-posts', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        if (!res.ok) throw new Error(`Error fetching posts: ${res.status}`)
        const { data } = await res.json()
        setPosts(data)
      } catch (err) {
        console.error(err)
        setLoadingError(err.message)
      } finally {
        setLoadingPosts(false)
      }
    }
    fetchPosts()
  }, [user.token])

  // Handle comment input change per post
  const handleCommentChange = (postId, text) => {
    setNewComments((prev) => ({ ...prev, [postId]: text }))
  }

  // Submit new comment and update post.comments
  const handleCommentSubmit = async (postId) => {
    const content = (newComments[postId] || '').trim()
    if (!content) return
    try {
      const res = await fetch('/api/comment/post-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ postId, content }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const { data: newComment } = await res.json()
      setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p)))
      setNewComments((prev) => ({ ...prev, [postId]: '' }))
    } catch (err) {
      console.error('Post comment failed', err)
    }
  }

  // Handle image file selection for new post
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // Open/close create post modal
  const handleOpen = () => setShowModal(true)
  const handleClose = () => {
    setShowModal(false)
    setPostContent('')
    setImageFile(null)
    setPreviewUrl('')
  }

  // Submit new post
  const handleSubmit = async () => {
    // don’t proceed if there’s nothing to post
    if (!postContent.trim() && !imageFile) return
    setSubmitting(true)

    try {
      let imageId = null
      console.log('🔄 Starting submit. imageFile =', imageFile)

      // 1) UPLOAD IMAGE IF PRESENT
      if (imageFile) {
        console.log('➡️ Uploading image…')
        const fd = new FormData()
        fd.append('image', imageFile)

        const uploadRes = await fetch('/api/image/post-image', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'application/json',
            // NOTE: do NOT set Content-Type for FormData here
          },
          body: fd,
        })

        // parse JSON even on error so we can inspect
        const upJson = await uploadRes.json().catch(() => null)
        console.log('📤 uploadRes.ok =', uploadRes.ok, 'upJson =', upJson)

        if (!uploadRes.ok) {
          throw new Error(`Đăng tải ảnh thất bại: ${upJson?.error || JSON.stringify(upJson)}`)
        }
        if (!upJson?.imageId) {
          throw new Error(`Upload response missing imageId: ${JSON.stringify(upJson)}`)
        }

        imageId = upJson.imageId
        console.log('✅ Received imageId =', imageId)
      }

      // 2) BUILD POST BODY (always include imageId for inspection)
      const postBody = {
        userId: user.userId,
        content: postContent,
        comments: [],
        status: true,
        imageId, // will be either an ID string or null
      }
      console.log('📝 postBody =', postBody)

      // 3) CREATE THE POST
      const res = await fetch('/api/post/add-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify(postBody),
      })

      const postJson = await res.json().catch(() => null)
      console.log('✏️ create-post ok =', res.ok, 'response =', postJson)

      if (!res.ok) {
        throw new Error(`Tạo bài viết thất bại: ${postJson?.error || JSON.stringify(postJson)}`)
      }

      const createdPost = postJson.data
      setPosts((prev) => [createdPost, ...prev])
      handleClose()
    } catch (err) {
      console.error('Create post error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Col md={8} lg={6} className="vstack gap-4">
        <div className="mb-3">
          <Button variant="primary" onClick={handleOpen}>
            <FaPlus className="me-2" /> Create a Post
          </Button>
        </div>

        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : loadingError ? (
          <p className="text-danger">Error: {loadingError}</p>
        ) : (
          posts.map((post, idx) => (
            <Card key={`${post._id}-${idx}`} className="mb-3">
              <CardHeader className="d-flex align-items-center">
                <img
                  src={post.userInfo?.imageId ? `/api/image/get-image/${post.userInfo.imageId}` : '/placeholder-avatar.jpg'}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-circle me-2"
                />
                <div>
                  <strong>{post.userInfo?.name || 'Anonymous'}</strong>
                  <br />
                  <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                </div>
              </CardHeader>
              <CardBody>
                <p>{post.content}</p>
                {post.imageId && <img src={`/api/image/get-image/${post.imageId}`} alt="post" className="img-fluid rounded mb-3" />}

                {/* Comments list */}
                {post.comments?.map((c) => (
                  <div key={c._id} className="border rounded p-2 mb-2">
                    <small className="text-muted">{new Date(c.createdAt).toLocaleString()}</small>
                    <p className="mb-0">{c.content}</p>
                  </div>
                ))}

                {/* New comment form */}
                <Form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleCommentSubmit(post._id)
                  }}>
                  <Form.Group className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Add a comment…"
                      value={newComments[post._id] || ''}
                      onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    />
                    <Button size="sm" onClick={() => handleCommentSubmit(post._id)}>
                      Post
                    </Button>
                  </Form.Group>
                </Form>
              </CardBody>
            </Card>
          ))
        )}
      </Col>

      <Col lg={3}>
        <Row className="g-4">
          <Col sm={6} lg={12}>
            <Followers />
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
              <div className="text-center mb-3">
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
