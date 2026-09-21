export interface Plataforma {
  id: string
  nombre: string
  icono: string
  enlaceBase: string
}

export const plataformas: Plataforma[] = [
  { id: 'instagram', nombre: 'Instagram', icono: '📸', enlaceBase: 'https://instagram.com/share?url=' },
  { id: 'tiktok', nombre: 'TikTok', icono: '🎵', enlaceBase: 'https://tiktok.com/share?url=' },
  { id: 'facebook', nombre: 'Facebook', icono: '📘', enlaceBase: 'https://www.facebook.com/sharer/sharer.php?u=' },
  { id: 'whatsapp', nombre: 'WhatsApp', icono: '💬', enlaceBase: 'https://wa.me/?text=' },
  { id: 'youtube', nombre: 'YouTube', icono: '▶️', enlaceBase: 'https://youtube.com/upload?url=' }
]

export function compartir(plataformaId: string, contenido: string, texto?: string) {
  const plataforma = plataformas.find(p => p.id === plataformaId)
  if (!plataforma) return null

  const mensaje = texto ? `${texto} — ${contenido}` : contenido
  return `${plataforma.enlaceBase}${encodeURIComponent(mensaje)}`
}

export function obtenerEnlaceCorto(recurso: string) {
  return `bailaconmigo.app/${btoa(recurso).slice(0, 8).toLowerCase()}`
}
