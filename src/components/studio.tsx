// Pantalla principal: Estudio de Baile
import { useState } from 'react'
import VideoGenerator from './VideoGenerator'

export default function Studio() {
  const [activo, setActivo] = useState(false)
  const [seccion, setSeccion] = useState<'estudio' | 'video'>('estudio')

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
        <button onClick={() => setSeccion('video')} style={botonNav(seccion === 'video')}>
          🎬 Generar Video
        </button>
        <button onClick={() => setActivo(!activo)} style={botonNav(activo)}>
          {activo ? 'Detener' : 'Iniciar'} Estudio
        </button>
      </div>

      {seccion === 'video' && <VideoGenerator />}

      {seccion === 'estudio' && activo && (
        <p style={{ opacity: 0.7 }}>Estudio activo — aquí irá la práctica de pasos y metrónomo.</p>
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
