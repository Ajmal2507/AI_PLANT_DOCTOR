import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

function AuthPage() {
  const [mode,     setMode]     = useState('login')
  const [formData, setFormData] = useState({ username: '', email: '', password: '', password2: '' })
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState({})

  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      let res
      if (mode === 'login') {
        res = await authAPI.login({ username: formData.username, password: formData.password })
      } else {
        res = await authAPI.register({ username: formData.username, email: formData.email, password: formData.password, password2: formData.password2 })
      }
      const { user, tokens, message } = res.data
      login(user, tokens)
      toast.success(message || 'Welcome to AI Crop Doctor! 🌿')
      navigate('/')
    } catch (error) {
      const data = error.response?.data
      if (!data) { toast.error('Something went wrong. Please try again.'); return }
      if (typeof data === 'string' || data.error) {
        toast.error(data.error || data)
      } else {
        setErrors(data)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div className="text-center mb-4">
          <Link to="/" style={{ textDecoration: 'none', fontSize: '2.5rem' }}>🌿</Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            {mode === 'login' ? 'Login to access your plant analyses' : 'Join thousands of farmers using AI'}
          </p>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
          {['login', 'register'].map(m => (
            <button key={m} id={`${m}-tab`} onClick={() => { setMode(m); setErrors({}) }} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.3s ease',
              background: mode === m ? 'var(--color-primary)' : 'transparent',
              color: mode === m ? 'white' : 'var(--text-secondary)',
            }}>
              {m === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-4" id={`${mode}-form`}>

          <div className="mb-3">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>Username</label>
            <input type="text" name="username" id="username-input" className="app-input"
              placeholder="Enter your username" value={formData.username} onChange={handleChange} required />
            {errors.username && <p style={{ color: 'var(--color-danger)', fontSize: '0.82rem', marginTop: '4px' }}>
              {Array.isArray(errors.username) ? errors.username[0] : errors.username}
            </p>}
          </div>

          {mode === 'register' && (
            <div className="mb-3">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>Email</label>
              <input type="email" name="email" id="email-input" className="app-input"
                placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
              {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: '0.82rem', marginTop: '4px' }}>
                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
              </p>}
            </div>
          )}

          <div className="mb-3">
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>Password</label>
            <input type="password" name="password" id="password-input" className="app-input"
              placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
            {errors.password && <p style={{ color: 'var(--color-danger)', fontSize: '0.82rem', marginTop: '4px' }}>
              {Array.isArray(errors.password) ? errors.password[0] : errors.password}
            </p>}
          </div>

          {mode === 'register' && (
            <div className="mb-3">
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>Confirm Password</label>
              <input type="password" name="password2" id="password2-input" className="app-input"
                placeholder="Repeat your password" value={formData.password2} onChange={handleChange} required />
            </div>
          )}

          <button type="submit" id="submit-auth-button" className="btn-green w-100 mt-2"
            disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>
              {mode === 'login' ? 'Logging in...' : 'Creating account...'}</>
            ) : (
              mode === 'login' ? 'Login' : 'Create Account'
            )}
          </button>
        </form>

      </div>
    </div>
  )
}

export default AuthPage
