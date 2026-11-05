export interface VideoPromptConfig {
  danza: string
  pasos?: string[]
  estiloVisual: string
  personaje?: string
  duracionSegundos: number
  musica?: string
  ambiente?: string
  acento?: string
}

export interface PromptGenerado {
  promptPrincipal: string
  promptCorto: string
  parametrosSugeridos: {
    duracion: string
    estilo: string
    relacionAspecto: string
  }
  instruccionesUso: string
}

/**
 * Genera prompts optimizados para Grok Imagine (o herramientas similares)
 * orientados a videos educativos/creativos de baile.
 */
export function generarPromptVideo(config: VideoPromptConfig): PromptGenerado {
  const pasosTexto = config.pasos && config.pasos.length > 0
    ? config.pasos.join(', ')
    : 'pasos básicos fluidos y precisos'

  const personaje = config.personaje || 'pareja de bailarines latinos adultos, vestimenta elegante y apropiada para el baile'
  const ambiente = config.ambiente || 'estudio de baile moderno con iluminación cálida y cinemática'
  const musica = config.musica || `ritmo de ${config.danza} a tempo medio`

  const promptPrincipal = [
    `Video cinemático de baile de ${config.danza}, duración ${config.duracionSegundos} segundos.`,
    `Personajes: ${personaje}.`,
    `Movimientos: ${pasosTexto}, ejecutados con técnica clara, fluidez y expresión natural.`,
    `Estilo visual: ${config.estiloVisual}, iluminación profesional, colores vibrantes pero realistas.`,
    `Ambiente: ${ambiente}.`,
    `Música de fondo: ${musica}.`,
    `Cámara: planos medios y planos detalle de pies y manos, transiciones suaves, sin cortes abruptos.`,
    `Calidad: alta definición, movimientos naturales, consistencia de personajes y vestimenta durante todo el video.`,
    `Enfoque educativo: que se aprecien claramente los pasos y la conexión entre los bailarines.`
  ].join(' ')

  const promptCorto = `Video cinemático de ${config.danza}: ${personaje} realizando ${pasosTexto} en ${ambiente}, estilo ${config.estiloVisual}, ${config.duracionSegundos}s, movimientos fluidos y técnicamente claros.`

  return {
    promptPrincipal,
    promptCorto,
    parametrosSugeridos: {
      duracion: `${config.duracionSegundos}s`,
      estilo: config.estiloVisual,
      relacionAspecto: '9:16 (vertical para Reels/TikTok) o 16:9'
    },
    instruccionesUso: 'Copia el prompt principal y pégalo en Grok Imagine (modo video). Ajusta duración y relación de aspecto según la plataforma de destino. Para consistencia de personaje, genera primero una imagen de referencia y úsala como base.'
  }
}

export function generarPromptsPorPasos(danza: string, pasos: string[], estiloVisual = 'cinemático realista'): PromptGenerado[] {
  return pasos.map((paso, index) =>
    generarPromptVideo({
      danza,
      pasos: [paso],
      estiloVisual,
      duracionSegundos: 8,
      ambiente: 'estudio de baile bien iluminado',
      personaje: 'bailarín/a profesional demostrando la técnica'
    })
  )
}

export async function generarVideo(config: VideoPromptConfig) {
  const prompt = generarPromptVideo(config)
  console.log('🎬 Prompt generado:', prompt.promptCorto)
  return {
    estado: 'prompt_listo',
    prompt: prompt.promptPrincipal,
    promptCorto: prompt.promptCorto,
    duracion: config.duracionSegundos,
    formato: 'prompt_para_Grok_Imagine',
    instrucciones: prompt.instruccionesUso
  }
}
