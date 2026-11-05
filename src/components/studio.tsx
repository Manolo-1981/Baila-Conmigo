// Pantalla principal: Estudio de Baile
import { useState } from 'react'
import VideoGenerator from './VideoGenerator'
import PracticeMode from './PracticeMode'
import Animation3D from './Animation3D'
import SaveModule from './SaveModule'
import Assistant from './Assistant'
import CharacterLibrary from './CharacterLibrary'

export default function Studio() {
  const [seccion, setSeccion] = useState<'estudio' | 'asistente' | 'practica' | 'animacion' | 'video' | 'personajes' | 'salvar'>('estudio')

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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <button onClick={() => setSeccion('estudio')} style={botonNav(seccion === 'estudio')}>🎥 Estudio</button>
        <button onClick={() => setSeccion('asistente')} style={botonNav(seccion === 'asistente')}>🤖 Asistente</button>
        <button onClick={() => setSeccion('practica')} style={botonNav(seccion === 'practica')}>💃 Práctica</button>
        <button onClick={() => setSeccion('animacion')} style={botonNav(seccion === 'animacion')}>🎭 Animación 3D</button>
        <button onClick={() => setSeccion('video')} style={botonNav(seccion === 'video')}>🎬 Generar Video</button>
        <button onClick={() => setSeccion('personajes')} style={botonNav(seccion === 'personajes')}>👤 Personajes</button>
        <button onClick={() => setSeccion('salvar')} style={botonNav(seccion === 'salvar')}>💾 Salvar</button>
      </div>

      {seccion === 'asistente' && <Assistant />}
      {seccion === 'video' && <VideoGenerator />}
      {seccion === 'practica' && <PracticeMode />}
      {seccion === 'animacion' && <Animation3D />}
      {seccion === 'personajes' && <CharacterLibrary />}
      {seccion === 'salvar' && <SaveModule />}

      {seccion === 'estudio' && (
        <div style={{ opacity: 0.75, maxWidth: '680px', margin: '0 auto', textAlign: 'left' }}>
          <p style={{ textAlign: 'center', marginBottom: '1rem' }}>Selecciona una sección:</p>
          <ul>
            <li><strong>Asistente</strong>: Guía paso a paso para generar videos con consistencia.</li>
            <li><strong>Práctica</strong>: Metrónomo y pasos para entrenar.</li>
            <li><strong>Animación 3D</strong>: Visualización 3D avanzada sincronizada al ritmo.</li>
            <li><strong>Generar Video</strong>: Prompts para Grok Imagine con fotos de referencia.</li>
            <li><strong>Personajes</strong>: Biblioteca para guardar fotos de referencia.</li>
            <li><strong>Salvar</strong>: Descarga prompts, sesiones y videos.</li>
          </ul>
        </div>
      )}
    </div>
  )
}

function botonNav(activo: boolean): React.CSSProperties {
  return {
    padding: '0.65rem 1.2rem',
    background: activo ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,215,0,0.5)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.95rem',
    cursor: 'pointer'
  }
}
