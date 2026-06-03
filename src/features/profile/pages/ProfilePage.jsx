import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Badge from '../../../components/ui/Badge'
import { getRoleDisplay } from '../../../utils/roleHelpers'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, updateProfile, isLoading, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    avatar: '',
  })
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      setMessage(null)
      await updateProfile(formData)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    }
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <Badge variant="primary">{getRoleDisplay(user.role)}</Badge>
        </div>

        {message && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-card">
          {!isEditing ? (
            <div className="profile-view">
              <div className="profile-info-item">
                <span className="label">Email</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="profile-info-item">
                <span className="label">First Name</span>
                <span className="value">{user.first_name || 'Not set'}</span>
              </div>
              <div className="profile-info-item">
                <span className="label">Last Name</span>
                <span className="value">{user.last_name || 'Not set'}</span>
              </div>
              <div className="profile-info-item">
                <span className="label">Bio</span>
                <span className="value">{user.bio || 'Not set'}</span>
              </div>
              <div className="profile-info-item">
                <span className="label">Account Type</span>
                <span className="value">{getRoleDisplay(user.role)}</span>
              </div>
              <div className="profile-actions">
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="profile-form">
              <Input
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <Input
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              <Input
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
              <Input
                label="Avatar URL"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
              />
              <div className="form-actions">
                <Button type="submit" isLoading={isLoading}>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-card danger">
          <h2>Logout</h2>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
