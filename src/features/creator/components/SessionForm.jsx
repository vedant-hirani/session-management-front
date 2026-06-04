import React, { useState, useRef } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useSessions } from '../../../hooks/useSessions'
import './SessionForm.css'

const DEFAULT_FORM = {
  title: '',
  description: '',
  cover_image: '',
  price: '',
  duration_minutes: '',
  max_attendees: '',
  scheduled_at: '',
  status: 'published',
  tags: '',
}

export default function SessionForm({ initialData = {}, onSubmit, isLoading, submitLabel = 'Save Session', serverErrors = {} }) {
  const { uploadFile } = useSessions()
  const fileInputRef = useRef(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const [form, setForm] = useState({
    ...DEFAULT_FORM,
    ...initialData,
    // Convert tags array → comma string for editing
    tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
    // Normalize datetime for input
    scheduled_at: initialData.scheduled_at
      ? new Date(initialData.scheduled_at).toISOString().slice(0, 16)
      : '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    setUploadError('')
    try {
      const response = await uploadFile(file)
      setForm((prev) => ({ ...prev, cover_image: response.url }))
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Failed to upload image. Please try again.')
    } finally {
      setUploadingFile(false)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) e.price = 'Valid price is required'
    if (!form.duration_minutes || parseInt(form.duration_minutes) < 1) e.duration_minutes = 'Duration must be at least 1 minute'
    if (!form.max_attendees || parseInt(form.max_attendees) < 1) e.max_attendees = 'At least 1 attendee required'
    if (!form.scheduled_at) e.scheduled_at = 'Schedule date and time is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Parse tags from comma-separated string → array
    const tagsArray = form.tags
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      cover_image: form.cover_image.trim() || null,
      price: parseFloat(form.price).toFixed(2),
      duration_minutes: parseInt(form.duration_minutes),
      max_attendees: parseInt(form.max_attendees),
      scheduled_at: new Date(form.scheduled_at).toISOString(),
      status: form.status,
      tags: tagsArray,
    })
  }

  const allErrors = { ...errors, ...serverErrors }

  return (
    <form className="session-form" onSubmit={handleSubmit} noValidate>
      <div className="form-section">
        <h3 className="form-section-title">Basic Info</h3>
        <div className="form-grid">
          <div className="form-field form-field--full">
            <Input
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={allErrors.title}
              placeholder="e.g. Live Yoga for Beginners"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-field form-field--full">
            <label className="input-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your session — what will attendees learn or experience?"
              disabled={isLoading}
              className={`form-textarea ${allErrors.description ? 'textarea-error' : ''}`}
              rows={4}
            />
            {allErrors.description && (
              <span className="input-error-message">{allErrors.description}</span>
            )}
          </div>

          <div className="form-field form-field--full cover-image-uploader-field">
            <label className="input-label">Cover Image</label>
            <div className="uploader-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                disabled={isLoading || uploadingFile}
              />
              <div className="uploader-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={triggerFileSelect}
                  isLoading={uploadingFile}
                  disabled={isLoading || uploadingFile}
                >
                  {uploadingFile ? 'Uploading...' : 'Choose Local Image'}
                </Button>
                <span className="uploader-or">or</span>
                <Input
                  name="cover_image"
                  value={form.cover_image}
                  onChange={handleChange}
                  error={allErrors.cover_image || uploadError}
                  placeholder="Paste external image URL here"
                  disabled={isLoading || uploadingFile}
                  style={{ flexGrow: 1, marginBottom: 0 }}
                />
              </div>

              {form.cover_image && (
                <div className="uploader-preview">
                  <img src={form.cover_image} alt="Session Cover Preview" />
                  <button
                    type="button"
                    className="remove-preview-btn"
                    onClick={() => setForm((prev) => ({ ...prev, cover_image: '' }))}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="form-section">
        <h3 className="form-section-title">Schedule & Capacity</h3>
        <div className="form-grid form-grid--2">
          <Input
            label="Date & Time"
            name="scheduled_at"
            type="datetime-local"
            value={form.scheduled_at}
            onChange={handleChange}
            error={allErrors.scheduled_at}
            disabled={isLoading}
            required
          />

          <Input
            label="Duration (minutes)"
            name="duration_minutes"
            type="number"
            value={form.duration_minutes}
            onChange={handleChange}
            error={allErrors.duration_minutes}
            placeholder="e.g. 60"
            disabled={isLoading}
            min="1"
            required
          />

          <Input
            label="Max Attendees"
            name="max_attendees"
            type="number"
            value={form.max_attendees}
            onChange={handleChange}
            error={allErrors.max_attendees}
            placeholder="e.g. 20"
            disabled={isLoading}
            min="1"
            required
          />

          <Input
            label="Price (USD)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            error={allErrors.price}
            placeholder="e.g. 9.99"
            disabled={isLoading}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Tags & Status</h3>
        <div className="form-grid form-grid--2">
          <Input
            label="Tags (comma separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            error={allErrors.tags}
            placeholder="e.g. yoga, wellness, beginner"
            disabled={isLoading}
          />

          <div className="form-field">
            <label className="input-label">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={isLoading}
              className="form-select"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button type="submit" isLoading={isLoading} size="lg">
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
