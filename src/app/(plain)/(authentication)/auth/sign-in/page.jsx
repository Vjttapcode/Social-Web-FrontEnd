import { Card } from 'react-bootstrap'
import LoginForm from './components/LoginForm'
import { Link } from 'react-router-dom'
import PageMetaData from '@/components/PageMetaData'
import AuthLayout from '../components/AuthLayout'
import '../auth.css'
const SignIn = () => {
  return (
    <>
      <PageMetaData title="Sign In" />
      <AuthLayout>
        <Card className="card-body text-center p-4 p-sm-5">
          <h1 className="ulearn-title">Sign in</h1>
          <p className="mb-0">
            Don&apos;t have an account?<Link to="/auth/sign-up"> Click here to sign up</Link>
          </p>
          <LoginForm />
        </Card>
      </AuthLayout>
    </>
  )
}
export default SignIn
