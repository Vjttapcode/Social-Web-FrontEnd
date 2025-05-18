import { Card, CardHeader, CardBody, CardSubtitle, CardTitle, CardText, Container } from 'react-bootstrap'
import PageMetaData from '@/components/PageMetaData'
import { useAuthContext } from '../../../../context/useAuthContext'

const About = () => {
  const { userInfo, avatarUrl } = useAuthContext()

  return (
    <>
      <PageMetaData title="About" />
      <Container className="py-4">
        <Card className="text-center shadow-sm mb-5 position-relative">
          <div className="bg-primary w-100" style={{ height: '120px', borderTopLeftRadius: '.25rem', borderTopRightRadius: '.25rem' }} />
          <img
            src={avatarUrl}
            alt="User Avatar"
            style={{
              position: 'absolute',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '5px solid white',
              backgroundColor: '#fff',
            }}
          />
          <CardHeader className="border-0 pt-5" />
          <CardBody className="pt-3">
            <CardTitle as="h3" className="mb-1">
              {userInfo?.name || 'Your name'}
            </CardTitle>
            <CardSubtitle className="mb-3 text-muted">{userInfo?.university || 'Your school'}</CardSubtitle>
            <CardText className="mx-auto px-3" style={{ maxWidth: 600 }}>
              {userInfo?.bio || 'Tell us more about you'}
            </CardText>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export default About
