import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

function Navbar() {
  const { user, logout } = useAuth()
  const location         = useLocation()
  const navigate         = useNavigate()

  const [menuOpen,    setMenuOpen]    = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setProfileOpen(false)
    await logout()
    toast.info('You have been logged out.')
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg fixed-top" id="main-navbar">
      <div className="container">

        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <span className="brand-text">AI Plant Doctor</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: 'var(--text-secondary)' }}
        >
          <i className={`bi bi-${menuOpen ? 'x' : 'list'}`} style={{ fontSize: '1.5rem' }}></i>
        </button>

        <div className={`${menuOpen ? 'd-block' : 'd-none'} d-lg-block`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">

            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                to="/"
                onClick={() => setMenuOpen(false)}
              >
                <i className="bi bi-house me-1"></i>Home
              </Link>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/history') ? 'active' : ''}`}
                    to="/history"
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="bi bi-clock-history me-1"></i>History
                  </Link>
                </li>

                <li className="nav-item" ref={profileRef} style={{ position: 'relative' }}>
                  <button
                    id="profile-menu-btn"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="profile-btn"
                  >
                    <div className="avatar">
                      {user.username[0].toUpperCase()}
                    </div>
                    <span className="username-text">{user.username}</span>
                    <i className={`bi bi-chevron-${profileOpen ? 'up' : 'down'}`}
                       style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}></i>
                  </button>

                  {profileOpen && (
                    <div className="profile-dropdown">
                      <div className="profile-dropdown-header">
                        <div className="avatar avatar-lg">
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.username}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user.email}</div>
                        </div>
                      </div>
                      <hr className="dropdown-divider-custom" />
                      <Link
                        to="/profile"
                        className="dropdown-item-custom"
                        onClick={() => { setProfileOpen(false); setMenuOpen(false) }}
                      >
                        <i className="bi bi-person me-2"></i>My Profile
                      </Link>
                      <Link
                        to="/history"
                        className="dropdown-item-custom"
                        onClick={() => { setProfileOpen(false); setMenuOpen(false) }}
                      >
                        <i className="bi bi-clock-history me-2"></i>My History
                      </Link>
                      <hr className="dropdown-divider-custom" />
                      <button
                        className="dropdown-item-custom danger"
                        onClick={handleLogout}
                        id="logout-button"
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            )}

            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn-green" to="/auth"
                    style={{ textDecoration: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '0.9rem' }}
                    onClick={() => setMenuOpen(false)}>
                    Get Started
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
