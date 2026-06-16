import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ bio: '', phone: '' })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile()
        setProfile(response.data)
        setFormData({
          bio: response.data.bio || '',
          phone: response.data.phone || '',
        })
      } catch {
        toast.error('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authAPI.updateProfile(formData)
      toast.success('Profile updated successfully! ✅')
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center">
        <div className="leaf-spinner">🌿</div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ background: 'var(--bg-primary)', padding: '90px 0 60px' }}>
      <div className="container">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>
            My Profile 👤
          </h1>
          <div className="app-card mb-4">
            <div className="d-flex align-items-center gap-4">
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2d7a3a, #4caf63)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'white',
                flexShrink: 0,
              }}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontWeight: 700, margin: 0 }}>{profile?.username}</h4>
                <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '0.9rem' }}>
                  {profile?.email}
                </p>
                <p style={{ color: 'var(--text-muted)', margin: '2px 0 0', fontSize: '0.8rem' }}>
                  Member since {new Date(profile?.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long'
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="app-card">
            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Edit Profile</h5>
            <form onSubmit={handleSave} id="profile-form">
              <div className="mb-3">
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>
                  Bio <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
                </label>
                <textarea
                  name="bio"
                  id="bio-input"
                  className="app-input"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="mb-4">
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>
                  Phone <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone-input"
                  className="app-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                id="save-profile-button"
                className="btn-green"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <><i className="bi bi-check-circle me-2"></i>Save Changes</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
