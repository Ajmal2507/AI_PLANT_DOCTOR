import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { historyAPI } from '../services/api'

function HistoryPage() {
  const [analyses,   setAnalyses]   = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading,    setLoading]    = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => { fetchAnalyses() }, [])

  const fetchAnalyses = async (search = '') => {
    setLoading(true)
    try {
      const res = await historyAPI.getAll(search ? { search } : {})
      setAnalyses(res.data.results)
    } catch {
      toast.error('Failed to load history.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const val = e.target.value
    setSearchTerm(val)
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(() => fetchAnalyses(val), 500)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return
    setDeletingId(id)
    try {
      await historyAPI.deleteById(id)
      setAnalyses(prev => prev.filter(i => i.id !== id))
      toast.success('Analysis deleted.')
    } catch {
      toast.error('Failed to delete.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page-container" style={{ background: 'var(--bg-primary)', padding: '90px 0 60px' }}>
      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Analysis History 📋</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>All your past plant disease analyses</p>
          </div>
          <Link to="/" className="btn-green" id="new-analysis-button">
            <i className="bi bi-plus me-2"></i>New Analysis
          </Link>
        </div>

        <div className="mb-4" style={{ maxWidth: '400px' }}>
          <div style={{ position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
            <input type="text" id="history-search" className="app-input"
              placeholder="Search by disease name..." value={searchTerm}
              onChange={handleSearch} style={{ paddingLeft: '40px' }} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="leaf-spinner">🌿</div>
            <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>Loading your history...</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="app-card text-center py-5">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌱</div>
            <h4 style={{ fontWeight: 700 }}>{searchTerm ? 'No results found' : 'No analyses yet'}</h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              {searchTerm ? `No diseases match "${searchTerm}".` : 'Upload your first plant image to get started!'}
            </p>
            {!searchTerm && (
              <Link to="/" className="btn-green" style={{ display: 'inline-block' }}>Analyze a Plant</Link>
            )}
          </div>
        ) : (
          <div className="row g-3">
            {analyses.map(item => (
              <div key={item.id} className="col-md-6 col-lg-4">
                <div className="app-card h-100 fade-in">
                  {item.image && (
                    <img src={item.image} alt={`${item.plant_name} plant`}
                      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }} />
                  )}
                  <div className="mb-2">
                    {item.is_healthy
                      ? <span className="badge-healthy">✅ Healthy</span>
                      : <span className="badge-diseased">⚠️ Diseased</span>
                    }
                  </div>
                  <h6 style={{ fontWeight: 700, marginBottom: '4px' }}>{item.plant_name}</h6>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>{item.disease_name}</p>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between" style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Confidence</span>
                      <span style={{ color: 'var(--color-accent)' }}>{item.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="confidence-bar mt-1">
                      <div className="confidence-fill" style={{ width: `${item.confidence}%` }}></div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="d-flex gap-2">
                    <Link to={`/result/${item.id}`} className="btn-outline-green" id={`view-result-${item.id}`}
                      style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '8px 12px', fontSize: '0.85rem' }}>
                      <i className="bi bi-eye me-1"></i>View
                    </Link>
                    <button id={`delete-${item.id}`} onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      style={{ background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)', color: '#ff6b6b', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      {deletingId === item.id ? '...' : <i className="bi bi-trash"></i>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
