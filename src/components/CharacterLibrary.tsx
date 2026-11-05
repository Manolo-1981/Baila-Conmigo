import { useState, useEffect, ChangeEvent } from 'react'

interface PersonajeGuardado {
  id: string
  nombre: string
  preview: string
  fecha: string
}

export default function CharacterLibrary() {
  const [personajes, setPersonajes] = useState<PersonajeGuardado[]>([])
  const [nombre, setNombre] = useState('')

  useEffect(() => {
    const guardados = localStorage.getItem('baila-personajes')
    if (guardados) {
      try {
        setPersonajes(JSON.parse(guardados))
      } catch {}
    }
  }, [])

  function guardarEnStorage(lista: PersonajeGuardado[]) {
    localStorage.setItem('baila-personajes', JSON.stringify(lista))
    setPersonajes(lista)
  }

  function agregarFoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !nombre.trim()) return

    const reader = new FileReader()
    reader.onload = () => {
      const nuevo: PersonajeGuardado = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        preview: reader.result as string,
        fecha: new Date().toLocaleDateString()
      }
      guardarEnStorage([nuevo, ...personajes])
      setNombre('')
    }
    reader.readAsDataURL(file)
  }

  function eliminar(id: string) {
    guardarEnStorage(personajes.filter(p => p.id !== id))
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
      <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>👤 Biblioteca de Personajes</h2>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre del personaje (ej: Hombre principal)"
          style={selectStyle}
        />
        <input
          type="file"
          accept="image/*"
          onChange={agregarFoto}
          style={{ ...selectStyle, padding: '0.4rem' }}
        />
        <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
          Escribe un nombre y selecciona una foto para guardarla en la biblioteca.
        </p>
      </div>

      {personajes.length === 0 ? (
        <p style={{ opacity: 0.7 }}>Aún no hay personajes guardados.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
          {personajes.map(p => (
            <div key={p.id} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px' }}>
              <img
                src={p.preview}
                alt={p.nombre}
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div style={{ marginTop: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>{p.nombre}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{p.fecha}</div>
              <button onClick={() => eliminar(p.id)} style={{ ...botonStyle, marginTop: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: '1.25rem', fontSize: '0.85rem', opacity: 0.75 }}>
        Las fotos se guardan en el navegador (localStorage). Úsalas como referencia al generar prompts en Grok Imagine.
      </p>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '0.5rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(0,0,0,0.3)',
  color: 'white'
}

const botonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  background: 'rgba(255,215,0,0.2)',
  border: '2px solid rgba(255,215,0,0.5)',
  borderRadius: '8px',
  color: 'white',
  cursor: 'pointer'
}
