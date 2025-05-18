import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, CardFooter, Form, Button, Image } from 'react-bootstrap'
import PageMetaData from '@/components/PageMetaData'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Decode JWT to extract userId only
  let userId
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      userId = payload.userId
    } catch (err) {
      console.error('Invalid token format', err)
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) {
        console.error('User ID not found in token')
        setLoading(false)
        return
      }
      try {
        const response = await fetch(`/api/post/get-post/${userId}`)
        if (!response.ok) throw new Error(`Network error: ${response.status}`)
        const json = await response.json()
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

  if (loading) {
    return <div className="text-center py-5">Loading posts...</div>
  }

  return (
    <>
      <PageMetaData title="Posts" />
      {posts.map((post, idx) => (
        <Card className="mb-4" key={idx}>
          <CardHeader>
            <div className="ms-2">
              <strong>{post.userName}</strong>
              <div className="text-muted small">{new Date(post.createdAt).toLocaleString()}</div>
            </div>
          </CardHeader>
          <CardBody>
            {post.content && <p>{post.content}</p>}
            {/* Post Image */}
            {post.imageId && post.imageId.length > 0 && (
              <Image
                src={`/api/image/get-image/${post.imageId}`}
                fluid
                rounded
                alt="post"
                style={{ maxWidth: '600px', height: 'auto', margin: '0 auto' }}
              />
            )}
          </CardBody>
          <CardFooter>
            <Form>
              <Form.Control type="text" placeholder="Add a comment..." className="mb-2" />
              <Button type="submit" size="sm">
                Post
              </Button>
            </Form>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}

export default Posts
