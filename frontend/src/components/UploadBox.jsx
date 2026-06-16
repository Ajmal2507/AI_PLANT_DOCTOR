import { useState, useCallback } from 'react'

function UploadBox({ onFileSelect, previewUrl, selectedFile, isDragOver, setIsDragOver, isLoading }) {

  const handleDragOver  = useCallback((e) => { e.preventDefault(); setIsDragOver(true) }, [])
  const handleDragLeave = useCallback(() => setIsDragOver(false), [])
  const handleDrop      = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files[0]) onFileSelect(e.dataTransfer.files[0])
  }, [])

  return (
    <div
      id="drop-zone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isLoading && document.getElementById('home-file-input').click()}
      className="upload-dropzone"
      style={{
        border: `2px dashed ${isDragOver ? 'var(--color-primary-light)' : 'var(--border-green)'}`,
        background: isDragOver ? 'rgba(45,122,58,0.1)' : 'rgba(13,17,23,0.5)',
        minHeight: previewUrl ? 'auto' : '220px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
      }}
    >
      <input
        type="file"
        id="home-file-input"
        accept="image/*"
        onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])}
        style={{ display: 'none' }}
      />

      {previewUrl ? (
        <div style={{ width: '100%' }}>
          <img src={previewUrl} alt="Selected plant" className="preview-image" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            <i className="bi bi-check-circle-fill me-2" style={{ color: '#4caf63' }}></i>
            {selectedFile.name} — Click to change
          </p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '4rem', marginBottom: '12px' }}>
            {isDragOver ? '📂' : '🌿'}
          </div>
          <h5 style={{ fontWeight: 700, marginBottom: '8px' }}>
            {isDragOver ? 'Drop it here!' : 'Drag & Drop or Click to Upload'}
          </h5>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
            Supports JPG, PNG, WebP · Max 10MB
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['JPG', 'PNG', 'WebP'].map(fmt => (
              <span key={fmt} className="format-badge">{fmt}</span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default UploadBox
