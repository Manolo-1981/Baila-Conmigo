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
  },
  {
    id: 'tango',
    nombre: 'Tango',
    pasos: [
      'Salida básica',
      'Abrazo cerrado',
      'Ocho adelante',
      'Ocho atrás',
      'Giro (molinete)',
      'Corte',
      'Sacada',
      'Boleo',
      'Gancho',
      'Parada',
      'Barrida',
      'Caminata hacia adelante',
      'Caminata hacia atrás',
      'Cambio de peso',
      'Pausa (parada en el abrazo)'
    ],
    velocidad: 120,
    categoria: 'Rioplatense'
  },
  {
    id: 'vals',
    nombre: 'Vals',
    pasos: [
      'Paso básico 1-2-3',
      'Giro natural (a la derecha)',
      'Giro reverso (a la izquierda)',
      'Cambio de dirección',
      'Balanceo',
      'Chassé',
      'Paso de caja',
      'Vuelta completa',
      'Paso abierto',
      'Paso cerrado',
      'Giro bajo el brazo',
      'Promenade',
      'Corte lateral',
      'Paso de avance',
      'Paso de retroceso'
    ],
    velocidad: 90,
    categoria: 'Clásico / Europeo'
  }
]

export function getDanza(id: string): Danza | undefined {
  return dances.find(d => d.id === id)
}
