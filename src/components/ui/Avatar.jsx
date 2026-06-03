import React from 'react'
import './Avatar.css'

export default function Avatar({ src, alt, size = 'md', initials }) {
  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img src={src} alt={alt || 'Avatar'} />
      ) : (
        <span className="avatar-initials">{initials}</span>
      )}
    </div>
  )
}
