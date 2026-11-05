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
  const [resultado, setResultado] = useState<ReturnType<typeof generarPromptVideo> | null>(null)
  const [copiado, setCopiado] = useState<'imagen' | 'video' | null>(null)

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

    setResultado(generarPromptVideo(config))
    setCopiado(null)
  }

  async function copiar(texto: string, tipo: 'imagen' | 'video') {
    await navigator.clipboard.writeText(texto)
    setCopiado(tipo)
    setTimeout(() => setCopiado(null), 2000)
  }

  function abrirGrokImagine() {
    window.open('https://grok.com', '_blank')
  }

  return (
    <div style={{
      maxWidth: '780px',
      margin: '0 auto',
      padding: '1.5rem',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255,215,0,0.2)'
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>🎬 Generador de Prompts para Grok Imagine</h2>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
        <label>
          Danza
          <select value={danzaId} onChange={e => setDanzaId(e.target.value)} style={selectStyle}>
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
          Duración del video (segundos): {duracion}
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
        Generar prompts (imagen + video)
      </button>

      {resultado && (
        <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>1. Prompt de imagen de referencia</h3>
          <textarea
            readOnly
            value={resultado.promptImagenReferencia}
            rows={5}
            style={textareaStyle}
          />
          <button onClick={() => copiar(resultado.promptImagenReferencia, 'imagen')} style={{ ...botonStyle, marginTop: '0.4rem' }}>
            {copiado === 'imagen' ? '✅ Copiado' : '📋 Copiar prompt de imagen'}
          </button>

          <h3 style={{ fontSize: '1.1rem', margin: '1.25rem 0 0.5rem' }}>2. Prompt de video</h3>
          <textarea
            readOnly
            value={resultado.promptVideo}
            rows={8}
            style={textareaStyle}
          />
          <button onClick={() => copiar(resultado.promptVideo, 'video')} style={{ ...botonStyle, marginTop: '0.4rem' }}>
            {copiado === 'video' ? '✅ Copiado' : '📋 Copiar prompt de video'}
          </button>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,215,0,0.08)', borderRadius: '8px', fontSize: '0.9rem' }}>
            <strong>Cómo usarlo en Grok Imagine:</strong>
            <ol style={{ margin: '0.5rem 0 0 1.2rem', padding: 0 }}>
              <li>Copia el prompt de imagen y genérala en <strong>Grok Imagine</strong> (modo imagen).</li>
              <li>Usa la imagen generada como referencia para el video.</li>
              <li>Copia el prompt de video y genéralo en modo video.</li>
              <li>Ajusta duración y relación de aspecto (9:16 o 16:9).</li>
            </ol>
            <button onClick={abrirGrokImagine} style={{ ...botonStyle, marginTop: '0.75rem', fontSize: '0.9rem' }}>
              Abrir grok.com
            </button>
          </div>
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

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(0,0,0,0.3)',
  color: 'white',
  fontFamily: 'inherit',
  resize: 'vertical'
}
