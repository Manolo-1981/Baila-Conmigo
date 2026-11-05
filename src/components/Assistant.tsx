import { useState } from 'react'

const pasos = [
  {
    titulo: '1. Preparar fotos de referencia',
    descripcion: 'Carga 1 o 2 fotos de archivo de los personajes. Estas se usarán para mantener consistencia facial en Grok Imagine.',
    accion: 'Ve a la sección Generar Video y sube tus fotos.'
  },
  {
    titulo: '2. Generar imagen de referencia',
    descripcion: 'Copia el prompt de imagen y genérala en Grok Imagine (modo imagen). Usa las fotos subidas como referencia.',
    accion: 'Abre Grok Imagine y genera la imagen.'
  },
  {
    titulo: '3. Generar el video',
    descripcion: 'Copia el prompt de video. Usa la imagen generada en el paso anterior como referencia en Grok Imagine (modo video).',
    accion: 'Genera el video en Grok Imagine.'
  },
  {
    titulo: '4. Animación y sincronización',
    descripcion: 'Lleva el video o imagen a Viggle (u otra herramienta). Transfiere el movimiento de un video real de baile y sincroniza con la música.',
    accion: 'Abre Viggle y realiza el motion transfer.'
  },
  {
    titulo: '5. Salvar el resultado',
    descripcion: 'Descarga el video final y guarda el prompt completo para reutilizarlo más adelante.',
    accion: 'Usa la sección Salvar para descargar todo.'
  }
]

export default function Assistant() {
  const [pasoActual, setPasoActual] = useState(0)
  const [completados, setCompletados] = useState<boolean[]>(new Array(pasos.length).fill(false))

  function marcarCompletado() {
    const nuevos = [...completados]
    nuevos[pasoActual] = true
    setCompletados(nuevos)
    if (pasoActual < pasos.length - 1) {
      setPasoActual(pasoActual + 1)
    }
  }

  function irA(index: number) {
    setPasoActual(index)
  }

  const paso = pasos[pasoActual]

  return (
    <div style={{
      maxWidth: '780px',
      margin: '0 auto',
      padding: '1.5rem',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255,215,0,0.2)'
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>🤖 Asistente de Generación de Video</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {pasos.map((_, i) => (
          <button
            key={i}
            onClick={() => irA(i)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid rgba(255,215,0,0.5)',
              background: completados[i] ? 'rgba(255,215,0,0.4)' : pasoActual === i ? 'rgba(255,215,0,0.2)' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div style={{
        padding: '1.25rem',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '12px',
        marginBottom: '1.25rem',
        textAlign: 'left'
      }}>
        <h3 style={{ marginBottom: '0.5rem' }}>{paso.titulo}</h3>
        <p style={{ opacity: 0.9, marginBottom: '0.75rem' }}>{paso.descripcion}</p>
        <p style={{ fontSize: '0.9rem', color: '#ffd700' }}><strong>Acción:</strong> {paso.accion}</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setPasoActual(p => Math.max(0, p - 1))}
          disabled={pasoActual === 0}
          style={botonStyle}
        >
          ← Anterior
        </button>
        <button onClick={marcarCompletado} style={{ ...botonStyle, background: 'rgba(255,215,0,0.3)' }}>
          {pasoActual === pasos.length - 1 ? 'Finalizar' : 'Marcar como hecho y continuar'}
        </button>
        <button
          onClick={() => setPasoActual(p => Math.min(pasos.length - 1, p + 1))}
          disabled={pasoActual === pasos.length - 1}
          style={botonStyle}
        >
          Siguiente →
        </button>
      </div>

      <p style={{ marginTop: '1.25rem', fontSize: '0.85rem', opacity: 0.75 }}>
        Sigue estos pasos en orden para obtener la mejor consistencia de personajes y calidad de video.
      </p>
    </div>
  )
}

const botonStyle: React.CSSProperties = {
  padding: '0.7rem 1.2rem',
  background: 'rgba(255,215,0,0.2)',
  border: '2px solid rgba(255,215,0,0.5)',
  borderRadius: '10px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '0.95rem'
}
