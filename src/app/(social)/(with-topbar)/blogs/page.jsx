import { useState } from 'react'
import { Card, Form, Button, InputGroup, Container, Row, Col, ListGroup } from 'react-bootstrap'
import { FaPaperPlane } from 'react-icons/fa'

export default function ChatbotPage() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' }])
  const [input, setInput] = useState('')
  const getBotResponse = async (userText) => {
    try {
      const res = await fetch('/api/chat-bot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      })
      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()
      return data.reply
    } catch (err) {
      console.error('Error fetching bot reply:', err)
      return 'Xin lỗi, đã xảy ra lỗi kết nối với dịch vụ chat.'
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMessage = { sender: 'user', text: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    const botText = await getBotResponse(userMessage.text)
    setMessages((prev) => [...prev, { sender: 'bot', text: botText }])
  }

  const faqs = [
    { question: 'HTML, CSS là gì?', time: '2hr' },
    { question: 'Javascript là gì?', time: '3hr' },
    { question: 'Điện toán đám mây (Cloud computing) là gì?', time: '4hr' },
    { question: 'Thế nào là An ninh mạng?', time: '6hr' },
    { question: 'Mạng máy tính là gì?', time: '6hr' },
    { question: 'Big Data (Dữ liệu lớn) là gì?', time: '6hr' },
    { question: 'Devops là gì?', time: '6hr' },
    { question: 'BlockChain là gì?', time: '6hr' },
  ]

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-4 pb-4" style={{ paddingTop: '6rem' }}>
      <header className="mb-4 text-center">
        <h2>Chatbot Hỏi Đáp Bài Tập</h2>
      </header>

      <Row className="flex-fill gx-4">
        <Col md={9} xs={12} className="mb-4">
          <Card className="h-100 bg-light border">
            <Card.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div
                    className={`p-2 rounded ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                    style={{ maxWidth: '75%' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={handleSend}>
                <InputGroup>
                  <Form.Control type="text" placeholder="Nhập câu hỏi của bạn..." value={input} onChange={(e) => setInput(e.target.value)} />
                  <Button type="submit" variant="primary">
                    <FaPaperPlane />
                  </Button>
                </InputGroup>
              </Form>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={3} xs={12} className="mb-4">
          <Card className="h-100">
            <Card.Header>Frequently Asked Questions</Card.Header>
            <ListGroup variant="flush">
              {faqs.map((faq, i) => (
                <ListGroup.Item key={i} className="d-flex justify-content-between">
                  <div>{faq.question}</div>
                  <small className="text-muted">{faq.time}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <footer className="mt-auto text-center py-2">Developed by PTIT_WEB_GROUP_11</footer>
    </Container>
  )
}
