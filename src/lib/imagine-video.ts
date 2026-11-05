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
  promptImagenReferencia: string
  promptVideo: string
  promptVideoCorto: string
  parametrosSugeridos: {
    duracion: string
    estilo: string
    relacionAspecto: string
  }
  instruccionesUso: string
}

/**
 * Genera prompts optimizados para Grok Imagine (imagen de referencia + video)
 * orientados a videos educativos/creativos de baile.
 */
export function generarPromptVideo(config: VideoPromptConfig): PromptGenerado {
  const pasosTexto = config.pasos && config.pasos.length > 0
    ? config.pasos.slice(0, 6).join(', ') + (config.pasos.length > 6 ? ' y otros pasos característicos' : '')
    : 'pasos básicos fluidos y precisos'

  const personaje = config.personaje || 'pareja de bailarines latinos adultos, vestimenta elegante y apropiada para el baile'
  const ambiente = config.ambiente || 'estudio de baile moderno con iluminación cálida y cinemática'
  const musica = config.musica || `ritmo de ${config.danza} a tempo medio`

  const promptImagenReferencia = [
    `Retrato cinemático de ${personaje}, posando en ${ambiente}.`,
    `Estilo: ${config.estiloVisual}, iluminación profesional, colores realistas y vibrantes.`,
    `Vestimenta apropiada para baile de ${config.danza}, expresión natural y segura.`,
    `Alta calidad, detalle en rostros, manos y postura, fondo ligeramente desenfocado.`,
    `Ideal como imagen de referencia para generar video consistente en Grok Imagine.`
  ].join(' ')

  const promptVideo = [
    `Video cinemático de baile de ${config.danza}, duración ${config.duracionSegundos} segundos.`,
    `Usa como referencia la imagen del personaje generada previamente para mantener consistencia de rostros, vestimenta y estilo.`,
    `Personajes: ${personaje}.`,
    `Movimientos: ${pasosTexto}, ejecutados con técnica clara, fluidez y expresión natural.`,
    `Estilo visual: ${config.estiloVisual}, iluminación profesional, colores vibrantes pero realistas.`,
    `Ambiente: ${ambiente}.`,
    `Música de fondo: ${musica}.`,
    `Cámara: planos medios y planos detalle de pies y manos, transiciones suaves, sin cortes abruptos.`,
    `Calidad: alta definición, movimientos naturales, consistencia de personajes y vestimenta durante todo el video.`,
    `Enfoque educativo: que se aprecien claramente los pasos y la conexión entre los bailarines.`
  ].join(' ')

  const promptVideoCorto = `Video cinemático de ${config.danza} (${config.duracionSegundos}s): ${personaje} realizando ${pasosTexto} en ${ambiente}, estilo ${config.estiloVisual}. Usa imagen de referencia para consistencia.`

  return {
    promptImagenReferencia,
    promptVideo,
    promptVideoCorto,
    parametrosSugeridos: {
      duracion: `${config.duracionSegundos}s`,
      estilo: config.estiloVisual,
      relacionAspecto: '9:16 (Reels/TikTok) o 16:9'
    },
    instruccionesUso: '1) Copia el prompt de imagen y genérala en Grok Imagine (modo imagen). 2) Usa esa imagen como referencia. 3) Copia el prompt de video y genéralo en modo video. Ajusta duración y relación de aspecto según necesites.'
  }
}

export function generarPromptsPorPasos(danza: string, pasos: string[], estiloVisual = 'cinemático realista'): PromptGenerado[] {
  return pasos.map((paso) =>
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
  console.log('🎬 Prompt de video generado:', prompt.promptVideoCorto)
  return {
    estado: 'prompts_listos',
    promptImagen: prompt.promptImagenReferencia,
    promptVideo: prompt.promptVideo,
    promptCorto: prompt.promptVideoCorto,
    duracion: config.duracionSegundos,
    formato: 'Grok_Imagine',
    instrucciones: prompt.instruccionesUso
  }
}
