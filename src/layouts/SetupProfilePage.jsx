// src/pages/SetupProfilePage.jsx
import { Container } from 'react-bootstrap'
import CreateUserInfoForm from '@/components/CreateUserInfoForm'

export default function SetupProfilePage() {
  return (
    <main>
      <Container className="py-5">
        <h2 className="mb-4">Complete Your Profile</h2>
        <CreateUserInfoForm />
      </Container>
    </main>
  )
}
