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
  const [numeroPersonajes, setNumeroPersonajes] = useState<1 | 2>(2)
  const [descripcionPersonaje, setDescripcionPersonaje] = useState('')
  const [relacionAspecto, setRelacionAspecto] = useState<'9:16' | '16:9' | '1:1'>('9:16')
  const [resultado, setResultado] = useState<ReturnType<typeof generarPromptVideo> | null>(null)
  const [copiado, setCopiado] = useState<'imagen' | 'video' | 'animacion' | null>(null)

  const danzaSeleccionada = dances.find(d => d.id === danzaId)

  function generar() {
    if (!danzaSeleccionada) return

    const config: VideoPromptConfig = {
      danza: danzaSeleccionada.nombre,
      pasos: danzaSeleccionada.pasos,
      estiloVisual: estilo,
      numeroPersonajes,
      descripcionPersonaje: descripcionPersonaje.trim() || undefined,
      duracionSegundos: duracion,
      relacionAspecto,
      ambiente: 'estudio de baile moderno con iluminación profesional'
    }

    setResultado(generarPromptVideo(config))
    setCopiado(null)
  }

  async function copiar(texto: string, tipo: 'imagen' | 'video' | 'animacion') {
    await navigator.clipboard.writeText(texto)
    setCopiado(tipo)
    setTimeout(() => setCopiado(null), 2000)
  }

  function abrirGrokImagine() {
    window.open('https://grok.com', '_blank')
  }

  function abrirViggle() {
    window.open('https://viggle.ai', '_blank')
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
          Número de personajes
          <select
            value={numeroPersonajes}
            onChange={e => setNumeroPersonajes(Number(e.target.value) as 1 | 2)}
            style={selectStyle}
          >
            <option value={1}>1 personaje (solo)</option>
            <option value={2}>2 personajes (pareja)</option>
          </select>
        </label>

        <label>
          Descripción del personaje (opcional)
          <input
            type="text"
            value={descripcionPersonaje}
            onChange={e => setDescripcionPersonaje(e.target.value)}
            placeholder={numeroPersonajes === 1
              ? 'Ej: hombre adulto con barba, vestido de negro...'
              : 'Ej: pareja elegante, él con traje y ella con vestido rojo...'}
            style={selectStyle}
          />
        </label>

        <label>
          Estilo visual
          <select value={estilo} onChange={e => setEstilo(e.target.value)} style={selectStyle}>
            {estilos.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label>
          Relación de aspecto
          <select
            value={relacionAspecto}
            onChange={e => setRelacionAspecto(e.target.value as '9:16' | '16:9' | '1:1')}
            style={selectStyle}
          >
            <option value="9:16">9:16 (Reels / TikTok / vertical)</option>
            <option value="16:9">16:9 (horizontal / YouTube)</option>
            <option value="1:1">1:1 (cuadrado)</option>
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
        Generar prompts (imagen + video + animación)
      </button>

      {resultado && (
        <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.75rem' }}>
            Configuración: {resultado.parametrosSugeridos.personajes} • {resultado.parametrosSugeridos.relacionAspecto}
          </p>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>1. Prompt de imagen de referencia</h3>
          <textarea readOnly value={resultado.promptImagenReferencia} rows={5} style={textareaStyle} />
          <button onClick={() => copiar(resultado.promptImagenReferencia, 'imagen')} style={{ ...botonStyle, marginTop: '0.4rem' }}>
            {copiado === 'imagen' ? '✅ Copiado' : '📋 Copiar prompt de imagen'}
          </button>

          <h3 style={{ fontSize: '1.1rem', margin: '1.25rem 0 0.5rem' }}>2. Prompt de video</h3>
          <textarea readOnly value={resultado.promptVideo} rows={8} style={textareaStyle} />
          <button onClick={() => copiar(resultado.promptVideo, 'video')} style={{ ...botonStyle, marginTop: '0.4rem' }}>
            {copiado === 'video' ? '✅ Copiado' : '📋 Copiar prompt de video'}
          </button>

          <h3 style={{ fontSize: '1.1rem', margin: '1.25rem 0 0.5rem' }}>3. Animación y sincronización</h3>
          <textarea readOnly value={resultado.instruccionesAnimacion} rows={10} style={textareaStyle} />
          <button onClick={() => copiar(resultado.instruccionesAnimacion, 'animacion')} style={{ ...botonStyle, marginTop: '0.4rem' }}>
            {copiado === 'animacion' ? '✅ Copiado' : '📋 Copiar instrucciones de animación'}
          </button>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,215,0,0.08)', borderRadius: '8px', fontSize: '0.9rem' }}>
            <strong>Flujo recomendado:</strong>
            <ol style={{ margin: '0.5rem 0 0 1.2rem', padding: 0 }}>
              <li>Genera la imagen de referencia en Grok Imagine.</li>
              <li>Genera el video usando esa imagen como referencia.</li>
              <li>Usa Viggle (u otra herramienta de motion transfer) con un video real de baile para animar y sincronizar con la música.</li>
            </ol>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              <button onClick={abrirGrokImagine} style={{ ...botonStyle, fontSize: '0.9rem' }}>
                Abrir Grok
              </button>
              <button onClick={abrirViggle} style={{ ...botonStyle, fontSize: '0.9rem' }}>
                Abrir Viggle
              </button>
            </div>
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
