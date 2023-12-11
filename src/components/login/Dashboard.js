import React, { useState } from 'react'
import { Button, Alert } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../Header' // Header コンポーネントをインポート
import './Login.css'


export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            navigate("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    return (
        <>
      <Header />
      <div className="dashboard-container">
        <h2 className='dashboard-title'>Profile</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="text-label"> {/* 新しいクラスを適用 */}
          <strong>Email</strong>
        </div>
        <div className="dashboard-email">
          {currentUser.email}
        </div>
        <div className="centered-container">
      <Link to="/update-profile" className="dashboard-button update">Update Profile</Link>
    </div>
        <Button variant="link" onClick={handleLogout} className="dashboard-button logout">Log Out</Button>
      </div>
    </>
  );
}
