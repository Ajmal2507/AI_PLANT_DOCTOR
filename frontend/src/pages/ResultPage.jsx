import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { historyAPI, reportsAPI } from '../services/api'

function ResultPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await historyAPI.getById(id)
        setResult(response.data)
      } catch {
        toast.error('Could not load the analysis result.')
        navigate('/history')
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [id, navigate])

  const handleDownloadPDF = async () => {
    setPdfLoading(true)
    try {
      const response = await reportsAPI.downloadPDF(id)
      const url = URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `${result.plant_name}_${result.disease_name}_report.pdf`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded successfully.')
    } catch {
      toast.error('Failed to download PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-secondary"></div>
          <p className="mt-3" style={{ color: 'var(--text-secondary)' }}>Loading result...</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  const isHealthy = result.is_healthy
  
  const renderContent = (text) => {
    if (!text) return null;
    let items = text.split('\n').map(l => l.trim()).filter(Boolean);
    
    if (items.length <= 1) {
      items = text.split('.').map(s => s.trim()).filter(Boolean).map(s => s + '.');
    }

    if (items.length > 1) {
      return (
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {items.map((item, idx) => {
            const cleanItem = item.replace(/^[-*•\d\.]+\s*/, '');
            return <li key={idx} style={{ marginBottom: '6px' }}>{cleanItem}</li>;
          })}
        </ul>
      );
    }
    return <p style={{ margin: 0 }}>{text}</p>;
  };

  return (
    <div className="page-container" style={{ background: 'var(--bg-primary)', padding: '100px 0 60px' }}>
      <div className="container">
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <Link
            to="/history"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            <i className="bi bi-arrow-left me-2"></i>Back to History
          </Link>
          <div className="app-card mt-3 fade-in" style={{
            border: `1px solid ${isHealthy ? 'rgba(67,160,71,0.3)' : 'rgba(229,57,53,0.3)'}`,
          }}>
            <div className="row align-items-center">
              {result.image && (
                <div className="col-md-4 mb-3 mb-md-0">
                  <img
                    src={result.image}
                    alt={`${result.plant_name} plant`}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                    }}
                  />
                </div>
              )}
              <div className={result.image ? 'col-md-8' : 'col-12'}>
                <div className="mb-2">
                  {isHealthy
                    ? <span className="badge-healthy">Healthy Plant</span>
                    : <span className="badge-diseased">Disease Detected</span>
                  }
                </div>
                <h2 style={{ fontWeight: 800, fontSize: '1.6rem', marginBottom: '4px' }}>
                  {result.disease_name}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Plant: <strong style={{ color: 'var(--text-primary)' }}>{result.plant_name}</strong>
                  {' · '}
                  {new Date(result.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <div>
                  <div className="d-flex justify-content-between" style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Confidence</span>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                      {result.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="confidence-bar mt-1">
                    <div className="confidence-fill" style={{ width: `${result.confidence}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {[
            { icon: '', title: isHealthy ? 'Health Status' : 'Disease Description', content: result.description },
            { icon: '', title: isHealthy ? 'Growth Factors' : 'Causes', content: result.causes },
            { icon: '', title: isHealthy ? 'Healthy Signs' : 'Symptoms', content: result.symptoms },
            { icon: '', title: isHealthy ? 'Organic Care & Growth Boosters' : 'Natural Remedies', content: result.natural_remedies },
            { icon: '', title: isHealthy ? 'Nutrients & Maintenance' : 'Chemical Remedies', content: result.chemical_remedies },
            { icon: '', title: isHealthy ? 'Protection & Prevention' : 'Prevention Tips', content: result.prevention },
          ].map((section) => (
            section.content && (
              <div key={section.title} className="app-card mt-3 fade-in">
                <h5 style={{ fontWeight: 700, marginBottom: '10px' }}>
                  {section.icon} {section.title}
                </h5>
                <div style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.8,
                  fontSize: '0.95rem'
                }}>
                  {renderContent(section.content)}
                </div>
              </div>
            )
          ))}
          <div className="d-flex gap-3 mt-4 flex-wrap">
            <button
              id="download-pdf-button"
              className="btn-green"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              style={{ flex: 1 }}
            >
              {pdfLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Generating PDF...
                </>
              ) : (
                <><i className="bi bi-download me-2"></i>Download PDF Report</>
              )}
            </button>
            <Link
              to="/"
              className="btn-outline-green"
              id="analyze-another-button"
              style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
            >
              <i className="bi bi-camera me-2"></i>Analyze Another Plant
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultPage
