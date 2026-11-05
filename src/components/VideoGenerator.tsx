import { useState } from 'react'
import { dances } from '../lib/dances'
import { generarPromptVideo, type VideoPromptConfig } from '../lib/imagine-video'

const estilos = [
  'cinemático realista',
  'documental educativo',
  'vibrante latinoamericano',
  'elegante de estudio',
  'UGC / estilo iPhone'
]

export default function VideoGenerator() {
  const [danzaId, setDanzaId] = useState(dances[0]?.id || '')
  const [estilo, setEstilo] = useState(estilos[0])
  const [duracion, setDuracion] = useState(10)
  const [prompt, setPrompt] = useState('')
  const [copiado, setCopiado] = useState(false)

  const danzaSeleccionada = dances.find(d => d.id === danzaId)

  function generar() {
    if (!danzaSeleccionada) return

    const config: VideoPromptConfig = {
      danza: danzaSeleccionada.nombre,
      pasos: danzaSeleccionada.pasos,
      estiloVisual: estilo,
      duracionSegundos: duracion,
      ambiente: 'estudio de baile moderno con iluminación profesional',
      personaje: 'pareja de bailarines adultos latinos, vestimenta elegante y apropiada'
    }

    const resultado = generarPromptVideo(config)
    setPrompt(resultado.promptPrincipal)
    setCopiado(false)
  }

  async function copiar() {
    if (!prompt) return
    await navigator.clipboard.writeText(prompt)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '1.5rem',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255,215,0,0.2)'
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>🎬 Generador de Prompts para Video</h2>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
        <label>
          Danza
          <select
            value={danzaId}
            onChange={e => setDanzaId(e.target.value)}
            style={selectStyle}
          >
            {dances.map(d => (
              <option key={d.id} value={d.id}>{d.nombre} ({d.categoria})</option>
            ))}
          </select>
        </label>

        <label>
          Estilo visual
          <select value={estilo} onChange={e => setEstilo(e.target.value)} style={selectStyle}>
            {estilos.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label>
          Duración (segundos): {duracion}
          <input
            type="range"
            min={6}
            max={30}
            value={duracion}
            onChange={e => setDuracion(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
      </div>

      <button onClick={generar} style={botonStyle}>
        Generar prompt
      </button>

      {prompt && (
        <div style={{ marginTop: '1.25rem' }}>
          <textarea
            readOnly
            value={prompt}
            rows={8}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(0,0,0,0.3)',
              color: 'white',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <button onClick={copiar} style={{ ...botonStyle, marginTop: '0.5rem' }}>
            {copiado ? '✅ Copiado' : '📋 Copiar prompt'}
          </button>
          <p style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: '0.5rem' }}>
            Pega este prompt en Grok Imagine (modo video). Para mayor consistencia, genera primero una imagen de referencia del personaje.
          </p>
        </div>
      )}
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
