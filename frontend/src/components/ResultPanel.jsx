import { Link } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import { toast } from 'react-toastify'
import { useState } from 'react'

function ResultPanel({ result, onReset }) {
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleDownloadPDF = async () => {
    setPdfLoading(true)
    try {
      const res = await reportsAPI.downloadPDF(result.id)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${result.plant_name}_${result.disease_name}_report.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded!')
    } catch {
      toast.error('Failed to download PDF.')
    } finally {
      setPdfLoading(false)
    }
  }

  const sections = [
    { icon: '', title: result.is_healthy ? 'Health Status' : 'Description',       content: result.description },
    { icon: '', title: result.is_healthy ? 'Growth Factors' : 'Causes',            content: result.causes },
    { icon: '', title: result.is_healthy ? 'Healthy Signs' : 'Symptoms',         content: result.symptoms },
    { icon: '', title: result.is_healthy ? 'Organic Care & Growth Boosters' : 'Natural Remedies',  content: result.natural_remedies },
    { icon: '', title: result.is_healthy ? 'Nutrients & Maintenance' : 'Chemical Remedies', content: result.chemical_remedies },
    { icon: '', title: result.is_healthy ? 'Protection & Prevention' : 'Prevention',       content: result.prevention },
  ].filter(s => s.content)

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
    <div className="fade-in">
      <div className="result-header">
        <h4 style={{ fontWeight: 600, margin: 0 }}>Analysis Result</h4>
        <div className="d-flex gap-2">
          <button className="btn-outline-green" onClick={onReset}
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
            <i className="bi bi-arrow-repeat me-1"></i>Analyze Another
          </button>
          <Link to="/history" className="btn-outline-green"
            style={{ padding: '8px 18px', fontSize: '0.88rem', textDecoration: 'none' }}>
            <i className="bi bi-clock-history me-1"></i>History
          </Link>
        </div>
      </div>

      <div className="app-card fade-in result-summary-card"
        style={{ border: `1px solid ${result.is_healthy ? 'rgba(67,160,71,0.3)' : 'rgba(229,57,53,0.3)'}` }}>
        <div className="row align-items-center">
          {result.image && (
            <div className="col-md-4 mb-3 mb-md-0">
              <img src={result.image} alt="plant"
                style={{ width: '100%', height: '190px', objectFit: 'cover', borderRadius: '12px' }} />
            </div>
          )}
          <div className={result.image ? 'col-md-8' : 'col-12'}>
            <div className="mb-2">
              {result.is_healthy
                ? <span className="badge-healthy">Healthy Plant</span>
                : <span className="badge-diseased">Disease Detected</span>
              }
            </div>
            <h3 style={{ fontWeight: 800, marginBottom: '4px' }}>{result.disease_name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Plant: <strong style={{ color: 'var(--text-primary)' }}>{result.plant_name}</strong>
              {' · '}
              {new Date(result.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="d-flex justify-content-between" style={{ fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Confidence</span>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{result.confidence.toFixed(1)}%</span>
            </div>
            <div className="confidence-bar mt-1">
              <div className="confidence-fill" style={{ width: `${result.confidence}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3 mt-1">
        {sections.map(s => (
          <div key={s.title} className="col-md-6">
            <div className="app-card h-100" style={{ padding: '18px' }}>
              <h6 style={{ fontWeight: 700, marginBottom: '8px' }}>{s.icon} {s.title}</h6>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.9rem' }}>
                {renderContent(s.content)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex gap-3 flex-wrap">
        <button id="download-pdf-button" className="btn-green" onClick={handleDownloadPDF}
          disabled={pdfLoading} style={{ flex: 1, minWidth: '180px' }}>
          {pdfLoading
            ? <><span className="spinner-border spinner-border-sm me-2"></span>Generating PDF...</>
            : <><i className="bi bi-download me-2"></i>Download PDF Report</>
          }
        </button>
        <Link to={`/result/${result.id}`} className="btn-outline-green"
          style={{ flex: 1, minWidth: '180px', textAlign: 'center', textDecoration: 'none' }}>
          <i className="bi bi-eye me-2"></i>View Full Result
        </Link>
      </div>

      <div className="saved-note mt-3">
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Saved to{' '}
          <Link to="/history" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
            your history
          </Link>
        </span>
      </div>
    </div>
  )
}

export default ResultPanel
