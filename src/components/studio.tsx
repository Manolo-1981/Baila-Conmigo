// Pantalla principal: Estudio de Baile
import { useState } from 'react'
import VideoGenerator from './VideoGenerator'
import PracticeMode from './PracticeMode'

export default function Studio() {
  const [seccion, setSeccion] = useState<'estudio' | 'video' | 'practica'>('estudio')

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      color: 'white',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
        background: 'linear-gradient(90deg, #ffd700, #ff6b00, #ff0066)',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        marginBottom: '1rem'
      }}>
        BAILA CONMIGO
      </h1>
      <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
        Tu estudio de creación y baile en vivo
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <button onClick={() => setSeccion('estudio')} style={botonNav(seccion === 'estudio')}>
          🎥 Estudio
        </button>
        <button onClick={() => setSeccion('practica')} style={botonNav(seccion === 'practica')}>
          💃 Práctica
        </button>
        <button onClick={() => setSeccion('video')} style={botonNav(seccion === 'video')}>
          🎬 Generar Video
        </button>
      </div>

      {seccion === 'video' && <VideoGenerator />}
      {seccion === 'practica' && <PracticeMode />}

      {seccion === 'estudio' && (
        <div style={{ opacity: 0.75, maxWidth: '600px', margin: '0 auto' }}>
          <p>Selecciona una sección:</p>
          <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
            <li><strong>Práctica</strong>: Metrónomo y pasos para entrenar.</li>
            <li><strong>Generar Video</strong>: Crea prompts para Grok Imagine con fotos de referencia.</li>
          </ul>
        </div>
      )}
    </div>
  )
}

function botonNav(activo: boolean): React.CSSProperties {
  return {
    padding: '0.75rem 1.5rem',
    background: activo ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,215,0,0.5)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer'
  }
}
