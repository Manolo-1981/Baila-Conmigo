import { useState, useEffect, useRef } from 'react'
import { dances } from '../lib/dances'

export default function PracticeMode() {
  const [danzaId, setDanzaId] = useState(dances[0]?.id || '')
  const [pasoActual, setPasoActual] = useState(0)
  const [activo, setActivo] = useState(false)
  const [bpm, setBpm] = useState(dances[0]?.velocidad || 120)
  const [contador, setContador] = useState(0)
  const [beat, setBeat] = useState(1)
  const [pulsando, setPulsando] = useState(false)

  const intervalRef = useRef<number | null>(null)

  const danza = dances.find(d => d.id === danzaId)

  useEffect(() => {
    if (danza) {
      setBpm(danza.velocidad)
      setPasoActual(0)
    }
  }, [danzaId])

  useEffect(() => {
    if (activo) {
      const intervalo = 60000 / bpm
      intervalRef.current = window.setInterval(() => {
        setContador(c => c + 1)
        setBeat(b => (b % 4) + 1)
        setPulsando(true)
        setTimeout(() => setPulsando(false), 120)
        reproducirClick()
      }, intervalo)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [activo, bpm])

  function reproducirClick() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 800
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
    } catch {
      // Silencioso
    }
  }

  function toggleMetronomo() {
    setActivo(a => !a)
    if (!activo) {
      setContador(0)
      setBeat(1)
    }
  }

  function siguientePaso() {
    if (!danza) return
    setPasoActual(p => (p + 1) % danza.pasos.length)
  }

  function pasoAnterior() {
    if (!danza) return
    setPasoActual(p => (p - 1 + danza.pasos.length) % danza.pasos.length)
  }

  if (!danza) return null

  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '1.5rem',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255,215,0,0.2)'
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>💃 Modo Práctica</h2>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <label>
          Danza
          <select value={danzaId} onChange={e => setDanzaId(e.target.value)} style={selectStyle}>
            {dances.map(d => (
              <option key={d.id} value={d.id}>{d.nombre} ({d.velocidad} BPM)</option>
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

      <div style={{
        padding: '1.25rem',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '12px',
        marginBottom: '1.25rem'
      }}>
        <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>
          Paso {pasoActual + 1} de {danza.pasos.length}
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '1rem', minHeight: '3rem' }}>
          {danza.pasos[pasoActual]}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={pasoAnterior} style={botonStyle}>← Anterior</button>
          <button onClick={siguientePaso} style={botonStyle}>Siguiente →</button>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={toggleMetronomo}
          style={{
            ...botonStyle,
            background: activo ? 'rgba(255,100,100,0.3)' : 'rgba(255,215,0,0.25)',
            fontSize: '1.1rem',
            padding: '1rem 2rem'
          }}
        >
          {activo ? '⏹ Detener metrónomo' : '▶ Iniciar metrónomo'}
        </button>

        {activo && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              margin: '0 auto 0.75rem',
              background: pulsando ? 'rgba(255,215,0,0.8)' : 'rgba(255,215,0,0.2)',
              border: '3px solid #ffd700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              transition: 'all 0.1s'
            }}>
              {beat}
            </div>
            <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>
              Pulsos: {contador}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.75 }}>
        <strong>Todos los pasos de {danza.nombre}:</strong>
        <ul style={{ textAlign: 'left', marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
          {danza.pasos.map((p, i) => (
            <li key={i} style={{ opacity: i === pasoActual ? 1 : 0.6, fontWeight: i === pasoActual ? 'bold' : 'normal' }}>
              {p}
            </li>
          ))}
        </ul>
      </div>
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
  padding: '0.75rem 1.25rem',
  background: 'rgba(255,215,0,0.2)',
  border: '2px solid rgba(255,215,0,0.5)',
  borderRadius: '10px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '1rem'
}
