export interface Danza {
  id: string
  nombre: string
  pasos: string[]
  velocidad: number
  categoria: string
}

export const dances: Danza[] = [
  {
    id: 'salsa',
    nombre: 'Salsa',
    pasos: ['Paso básico', 'Giro a la derecha', 'Giro a la izquierda', 'Cambio de pareja'],
    velocidad: 180,
    categoria: 'Caribeña'
  },
  {
    id: 'bachata',
    nombre: 'Bachata',
    pasos: ['Tres pasos', 'Toque lateral', 'Cambio de lado'],
    velocidad: 140,
    categoria: 'Caribeña'
  },
  {
    id: 'merengue',
    nombre: 'Merengue',
    pasos: ['Paso rápido', 'Cambio de peso', 'Giro simple'],
    velocidad: 160,
    categoria: 'Caribeña'
  },
  {
    id: 'cumbia',
    nombre: 'Cumbia',
    pasos: ['Paso al frente', 'Paso atrás', 'Giro suave'],
    velocidad: 150,
    categoria: 'Latinoamericana'
  }
]

export function getDanza(id: string): Danza | undefined {
  return dances.find(d => d.id === id)
}
