import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { detectionAPI, historyAPI } from '../services/api'
import UploadBox from '../components/UploadBox'
import ResultPanel from '../components/ResultPanel'

const FEATURES = [
  { icon: '👁️', title: 'Vision AI Detection',   desc: 'Upload a plant photo and Llama 4 Scout Vision instantly identifies the plant and any disease.', color: '#4caf63' },
  { icon: '🧪', title: 'Expert AI Advisory',    desc: 'Get detailed causes, symptoms, natural and chemical remedies from the AI agricultural expert.', color: '#2196f3' },
  { icon: '📄', title: 'PDF Reports',           desc: 'Download a formatted PDF report with the full diagnosis, remedies, and prevention tips.', color: '#ff9800' },
  { icon: '📋', title: 'Account History',       desc: 'Every scan is saved to your account. Search and review all past plant analyses anytime.', color: '#9c27b0' },
  { icon: '🔒', title: 'Secure & Private',      desc: 'JWT authentication ensures only you can see your analyses and history.', color: '#00bcd4' },
  { icon: '⚡', title: 'Instant Results',       desc: 'Groq\'s ultra-fast inference gives you results in 15–30 seconds.', color: '#e91e63' },
]

const STEPS = [
  { step: '01', icon: '📸', title: 'Upload a Photo',  desc: 'Take a clear photo of the plant or affected area and upload it here.' },
  { step: '02', icon: '🤖', title: 'AI Analyzes',     desc: 'Llama 4 Scout Vision auto-identifies the plant and detects any disease.' },
  { step: '03', icon: '📋', title: 'Get Your Report', desc: 'Receive full advisory with remedies. Saved to your account history.' },
]

function HomePage() {
  const { user }    = useAuth()
  const resultRef   = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl,   setPreviewUrl]   = useState(null)
  const [isDragOver,   setIsDragOver]   = useState(false)
  const [isLoading,    setIsLoading]    = useState(false)
  const [result,       setResult]       = useState(null)

  const handleFileSelect = (file) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 10 * 1024 * 1024)   { toast.error('Image must be smaller than 10MB'); return }
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
  }

  const handleDetect = async () => {
    if (!selectedFile) { toast.warning('Please select an image first'); return }
    setIsLoading(true)
    setResult(null)
    toast.info('🤖 AI is analyzing your plant... 15–30 seconds.')
    try {
      const res        = await detectionAPI.analyzeImage(selectedFile)
      const resultRes  = await historyAPI.getById(res.data.result.id)
      setResult(resultRes.data)
      toast.success('✅ Analysis complete!')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setIsDragOver(false)
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      <section className="hero-gradient hero-section">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />

        <div className="container">
          <div className="text-center mb-5 fade-in">
            <div className="ai-badge mb-3">
              🤖 Groq Vision AI — Instant Plant Disease Detection
            </div>
            <h1 className="hero-title">
              Detect Plant Diseases{' '}
              <span className="gradient-text">Instantly with AI</span>
            </h1>
            <p className="hero-subtitle">
              Upload a photo of your plant/crop and get an instant diagnosis powered by Llama 4 Scout Vision,
              complete with expert remedies and prevention tips.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {user ? (
              !result ? (
                <div className="glass-card p-4 fade-in">
                  <h5 style={{ fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
                    📸 Upload Plant Photo to Analyze
                  </h5>
                  <UploadBox
                    onFileSelect={handleFileSelect}
                    previewUrl={previewUrl}
                    selectedFile={selectedFile}
                    isDragOver={isDragOver}
                    setIsDragOver={setIsDragOver}
                    isLoading={isLoading}
                  />
                  <div className="tips-box mt-3">
                    💡 <strong style={{ color: 'var(--color-accent)' }}>Tips: </strong>
                    Good lighting · Focus on affected area · Include spots/discoloration
                  </div>
                  <button
                    id="detect-button"
                    className="btn-green w-100 mt-4"
                    onClick={handleDetect}
                    disabled={!selectedFile || isLoading}
                    style={{ fontSize: '1.1rem', padding: '16px', opacity: !selectedFile || isLoading ? 0.6 : 1 }}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center gap-3">
                        <span className="leaf-spinner" style={{ fontSize: '1.4rem' }}>🌿</span>
                        <span>AI is analyzing your plant...</span>
                      </div>
                    ) : (
                      <><i className="bi bi-cpu me-2"></i>Detect Disease</>
                    )}
                  </button>
                  {isLoading && (
                    <p className="text-center mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Vision AI + Advisory Engine processing (15–30 seconds)
                    </p>
                  )}
                </div>
              ) : (
                <div ref={resultRef}>
                  <ResultPanel result={result} onReset={handleReset} />
                </div>
              )
            ) : (
              <div className="glass-card p-5 text-center fade-in">
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌿</div>
                <h3 style={{ fontWeight: 800, marginBottom: '12px' }}>Start Detecting Plant Diseases</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '28px' }}>
                  Create a free account to upload plant images and get instant AI-powered disease detection,
                  expert remedies, and save all your analyses to your personal history.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/auth" className="btn-green" id="hero-login-button"
                    style={{ fontSize: '1rem', padding: '14px 32px' }}>
                    <i className="bi bi-person-plus me-2"></i>Create Free Account
                  </Link>
                  <Link to="/auth" className="btn-outline-green" id="hero-register-button"
                    style={{ fontSize: '1rem', padding: '12px 30px' }}>
                    Login
                  </Link>
                </div>
                <div className="trust-indicators mt-4">
                  {[{ icon: '🌱', text: 'Vision AI' }, { icon: '⚡', text: 'Instant' }, { icon: '📄', text: 'PDF Reports' }, { icon: '🔒', text: 'Private' }].map(i => (
                    <div key={i.text} className="d-flex align-items-center gap-1"
                      style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <span>{i.icon}</span><span>{i.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              Everything You Need to <span className="gradient-text">Protect Your Crops</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '1rem' }}>
              Powered by Groq · Llama 4 Scout Vision
            </p>
          </div>
          <div className="row g-4">
            {FEATURES.map(f => (
              <div key={f.title} className="col-md-6 col-lg-4">
                <div className="app-card h-100">
                  <div className="feature-icon" style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}>
                    {f.icon}
                  </div>
                  <h5 style={{ fontWeight: 700, marginBottom: '8px' }}>{f.title}</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>How It Works</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>3 simple steps</p>
          </div>
          <div className="row g-4 justify-content-center">
            {STEPS.map(s => (
              <div key={s.step} className="col-md-4 text-center">
                <div className="step-circle">{s.icon}</div>
                <span className="step-label">STEP {s.step}</span>
                <h4 style={{ fontWeight: 700, margin: '8px 0' }}>{s.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            {user ? (
              <button className="btn-green" style={{ fontSize: '1.05rem', padding: '14px 40px' }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Start Analyzing Now 🚀
              </button>
            ) : (
              <Link to="/auth" className="btn-green" style={{ fontSize: '1.05rem', padding: '14px 40px' }}>
                Get Started Free 🚀
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}

export default HomePage
