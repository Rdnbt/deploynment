import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import Header from '../Header'

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] =useState(false)
  const navigate = useNavigate()


  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      navigate('/subjects');
    } catch {
      setError("Failed to login in")
    }
    setLoading(false)
  }

  return (
    <>
      <Header />
      <div className="login-container">
        <h2 className='dashboard-title'>Log In</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
        <div className="text-label">
          <strong>Email</strong>
        </div>
        <Form.Control type="email" ref={emailRef} required className="dashboard-email" />
        <div className="text-label">
          <strong>Password</strong>
        </div>
        <Form.Control type="password" ref={passwordRef} required className="dashboard-email" />
          <Button disabled={loading} className="login-button-container" type="submit">
            Log In 
          </Button>
        </Form>
        <div className='w-100 text-center mt-3'>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to='/signup'>Sign Up</Link>
        </div>
      </div>
    </>
  );
}

