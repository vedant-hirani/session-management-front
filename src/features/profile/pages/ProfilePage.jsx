import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Badge from '../../../components/ui/Badge'
import { getRoleDisplay } from '../../../utils/roleHelpers'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ first_name: '', last_name: '', bio: '', avatar: '' })
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
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    }
  }

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
  const userAvatar = user.avatar || defaultAvatar

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        <div className="profile-header-glass">
          <div className="profile-hero">
            <div className="profile-avatar-wrapper">
              <img src={userAvatar} alt="User Avatar" className="profile-avatar-large" />
              <div className={`role-badge-floating role-${user.role}`}>
                {getRoleDisplay(user.role)}
              </div>
            </div>
            <div className="profile-identity">
              <h2>{user.first_name || user.username ? `${user.first_name} ${user.last_name || ''}` : 'User Profile'}</h2>
              <p className="profile-username">@{user.username}</p>
              <p className="profile-joined">Joined on {new Date(user.date_joined || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`message-banner message-${message.type}`}>
            <span className="message-icon">{message.type === 'success' ? '✓' : '⚠️'}</span>
            <span className="message-text">{message.text}</span>
          </div>
        )}

        <div className="profile-grid">
          
          <div className="profile-main-card">
            <div className="card-header-bar">
              <h3>Personal Information</h3>
              {!isEditing && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Details
                </Button>
              )}
            </div>

            {!isEditing ? (
              <div className="profile-view-fields">
                <div className="profile-field-row">
                  <span className="field-label">Email Address</span>
                  <span className="field-value">{user.email}</span>
                </div>
                <div className="profile-field-row">
                  <span className="field-label">First Name</span>
                  <span className="field-value">{user.first_name || <span className="placeholder-text">Not set</span>}</span>
                </div>
                <div className="profile-field-row">
                  <span className="field-label">Last Name</span>
                  <span className="field-value">{user.last_name || <span className="placeholder-text">Not set</span>}</span>
                </div>
                <div className="profile-field-row">
                  <span className="field-label">About Bio</span>
                  <span className="field-value bio-text">{user.bio || <span className="placeholder-text">Tell us about yourself...</span>}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="profile-edit-form">
                <div className="form-row">
                  <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="e.g. John" />
                  <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="e.g. Doe" />
                </div>
                <Input label="Bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself" />
                <Input label="Avatar Image URL" name="avatar" value={formData.avatar} onChange={handleChange} placeholder="https://example.com/avatar.jpg" />
                
                <div className="form-actions-row">
                  <Button type="submit" isLoading={isLoading}>Save Details</Button>
                  <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </div>

          <div className="profile-sidebar-card">
            <div className="wallet-card-premium">
              <div className="wallet-glow-layer"></div>
              <div className="wallet-header">
                <span className="wallet-label">My Wallet Balance</span>
                <span className="wallet-icon">💳</span>
              </div>
              <div className="wallet-balance-display">
                <span className="currency-symbol">$</span>
                <span className="balance-amount">{parseFloat(user.wallet_balance || 0).toFixed(2)}</span>
              </div>
              <p className="wallet-desc">
                Refunds from cancelled bookings are automatically deposited here and can be used for future bookings.
              </p>
            </div>
            
            <div className="account-summary-card">
              <h4>Security & Role</h4>
              <div className="summary-row">
                <span className="summary-label">Role Status</span>
                <span className="summary-val role-text-highlight">{getRoleDisplay(user.role)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Status</span>
                <span className="summary-val active-status">Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
