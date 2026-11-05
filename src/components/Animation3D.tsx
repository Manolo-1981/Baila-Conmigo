import { useState, useEffect } from 'react'
import { dances } from '../lib/dances'

export default function Animation3D() {
  const [danzaId, setDanzaId] = useState(dances[0]?.id || '')
  const [activo, setActivo] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [rotacion, setRotacion] = useState(0)

  const danza = dances.find(d => d.id === danzaId)

  useEffect(() => {
    if (danza) setBpm(danza.velocidad)
  }, [danzaId])

  useEffect(() => {
    if (!activo) return

    const intervalo = 60000 / bpm
    const id = window.setInterval(() => {
      setRotacion(r => r + 15)
    }, intervalo / 4)

    return () => clearInterval(id)
  }, [activo, bpm])

  return (
    <div style={{
      maxWidth: '780px',
      margin: '0 auto',
      padding: '1.5rem',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255,215,0,0.2)'
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>🎭 Animación 3D</h2>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <label>
          Danza
          <select value={danzaId} onChange={e => setDanzaId(e.target.value)} style={selectStyle}>
            {dances.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </label>

        <label>
          BPM: {bpm}
          <input
            type="range"
            min={60}
            max={220}
            value={bpm}
            onChange={e => setBpm(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
      </div>

      {/* Escena 3D simplificada con CSS transforms */}
      <div style={{
        height: '320px',
        perspective: '1000px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0f0c29, #302b63)',
        borderRadius: '12px',
        marginBottom: '1.25rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '120px',
          height: '200px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotacion}deg) rotateX(10deg)`,
          transition: activo ? 'none' : 'transform 0.3s'
        }}>
          {/* Cuerpo */}
          <div style={{
            position: 'absolute',
            width: '60px',
            height: '90px',
            background: 'linear-gradient(180deg, #ffd700, #ff6b00)',
            left: '30px',
            top: '40px',
            borderRadius: '8px',
            transform: 'translateZ(0)'
          }} />
          {/* Cabeza */}
          <div style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            background: '#ffdbac',
            left: '40px',
            top: '5px',
            borderRadius: '50%',
            transform: 'translateZ(10px)'
          }} />
          {/* Brazos */}
          <div style={{
            position: 'absolute',
            width: '80px',
            height: '12px',
            background: '#ffd700',
            left: '20px',
            top: '55px',
            borderRadius: '6px',
            transform: `rotateZ(${Math.sin(rotacion * 0.05) * 30}deg) translateZ(5px)`
          }} />
          {/* Piernas */}
          <div style={{
            position: 'absolute',
            width: '14px',
            height: '70px',
            background: '#333',
            left: '38px',
            top: '125px',
            borderRadius: '4px',
            transform: `rotateZ(${Math.sin(rotacion * 0.08) * 20}deg)`
          }} />
          <div style={{
            position: 'absolute',
            width: '14px',
            height: '70px',
            background: '#333',
            left: '68px',
            top: '125px',
            borderRadius: '4px',
            transform: `rotateZ(${Math.sin(rotacion * 0.08 + 1) * 20}deg)`
          }} />
        </div>

        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          fontSize: '0.85rem',
          opacity: 0.8
        }}>
          {danza?.nombre || 'Danza'} • {bpm} BPM
        </div>
      </div>

      <button
        onClick={() => setActivo(a => !a)}
        style={{
          ...botonStyle,
          background: activo ? 'rgba(255,100,100,0.3)' : 'rgba(255,215,0,0.25)',
          fontSize: '1.1rem'
        }}
      >
        {activo ? '⏹ Detener animación' : '▶ Iniciar animación 3D'}
      </button>

      <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.75 }}>
        Visualización 3D simplificada sincronizada al BPM. Ideal para practicar ritmo mientras se generan videos en Grok Imagine.
      </p>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: '0.25rem',
  padding: '0.5rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(0,0,0,0.3)',
  color: 'white'
}

const botonStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  background: 'rgba(255,215,0,0.2)',
  border: '2px solid rgba(255,215,0,0.5)',
  borderRadius: '10px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '1rem'
}
