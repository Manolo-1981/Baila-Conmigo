import { useState, ChangeEvent } from 'react'

export default function SaveModule() {
  const [nombreArchivo, setNombreArchivo] = useState('baila-conmigo-prompt')
  const [contenido, setContenido] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [mensaje, setMensaje] = useState('')

  function descargarTexto() {
    if (!contenido.trim()) {
      setMensaje('No hay contenido para guardar')
      return
    }

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${nombreArchivo || 'prompt'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setMensaje('Prompt descargado correctamente')
  }

  function manejarVideo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setMensaje(`Video seleccionado: ${file.name}`)
    }
  }

  function descargarVideo() {
    if (!videoFile) {
      setMensaje('Selecciona un video primero')
      return
    }

    const url = URL.createObjectURL(videoFile)
    const a = document.createElement('a')
    a.href = url
    a.download = videoFile.name || 'video-baila-conmigo.mp4'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setMensaje('Video descargado')
  }

  function guardarEnLocal() {
    if (!contenido.trim()) return
    localStorage.setItem('baila-ultimo-prompt', contenido)
    setMensaje('Prompt guardado en el navegador (localStorage)')
  }

  function cargarDeLocal() {
    const guardado = localStorage.getItem('baila-ultimo-prompt')
    if (guardado) {
      setContenido(guardado)
      setMensaje('Prompt cargado desde el navegador')
    } else {
      setMensaje('No hay prompt guardado')
    }
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
      <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>💾 Salvar Video y Prompts</h2>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
        <label>
          Nombre del archivo
          <input
            type="text"
            value={nombreArchivo}
            onChange={e => setNombreArchivo(e.target.value)}
            style={selectStyle}
            placeholder="nombre-del-archivo"
          />
        </label>

        <label>
          Contenido del prompt / notas
          <textarea
            value={contenido}
            onChange={e => setContenido(e.target.value)}
            rows={6}
            placeholder="Pega aquí el prompt generado o notas del video..."
            style={textareaStyle}
          />
        </label>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={descargarTexto} style={botonStyle}>📥 Descargar prompt (.txt)</button>
          <button onClick={guardarEnLocal} style={botonStyle}>💾 Guardar en navegador</button>
          <button onClick={cargarDeLocal} style={botonStyle}>📂 Cargar guardado</button>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,215,0,0.2)', margin: '1.25rem 0' }} />

      <div>
        <label>
          Subir / seleccionar video generado
          <input
            type="file"
            accept="video/*"
            onChange={manejarVideo}
            style={{ ...selectStyle, padding: '0.4rem' }}
          />
        </label>

        {videoFile && (
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.85 }}>
            Archivo: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}

        <button onClick={descargarVideo} style={{ ...botonStyle, marginTop: '0.75rem' }}>
          📥 Descargar video
        </button>
      </div>

      {mensaje && (
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#ffd700' }}>
          {mensaje}
        </p>
      )}

      <p style={{ marginTop: '1.25rem', fontSize: '0.85rem', opacity: 0.75 }}>
        Usa este módulo para guardar los prompts generados en Grok Imagine y descargar los videos resultantes de Grok o Viggle.
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
  padding: '0.6rem 1.1rem',
  background: 'rgba(255,215,0,0.2)',
  border: '2px solid rgba(255,215,0,0.5)',
  borderRadius: '10px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '0.95rem'
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
