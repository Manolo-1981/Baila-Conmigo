export interface VideoPromptConfig {
  danza: string
  pasos?: string[]
  estiloVisual: string
  numeroPersonajes: 1 | 2
  descripcionPersonaje?: string
  duracionSegundos: number
  musica?: string
  ambiente?: string
  relacionAspecto?: '9:16' | '16:9' | '1:1'
}

export interface PromptGenerado {
  promptImagenReferencia: string
  promptVideo: string
  promptVideoCorto: string
  instruccionesAnimacion: string
  parametrosSugeridos: {
    duracion: string
    estilo: string
    relacionAspecto: string
    personajes: string
  }
  instruccionesUso: string
}

function construirDescripcionPersonaje(numero: 1 | 2, custom?: string): string {
  if (custom && custom.trim()) return custom.trim()

  if (numero === 1) {
    return 'un/a bailarín/a profesional adulto/a latino/a, vestimenta elegante y apropiada para el baile'
  }
  return 'pareja de bailarines adultos latinos (hombre y mujer), vestimenta elegante y apropiada para el baile, con buena conexión'
}

/**
 * Genera prompts optimizados para Grok Imagine (imagen + video) + instrucciones de animación/sincronización.
 * Soporta 1 o 2 personajes.
 */
export function generarPromptVideo(config: VideoPromptConfig): PromptGenerado {
  const pasosTexto = config.pasos && config.pasos.length > 0
    ? config.pasos.slice(0, 6).join(', ') + (config.pasos.length > 6 ? ' y otros pasos característicos' : '')
    : 'pasos básicos fluidos y precisos'

  const personaje = construirDescripcionPersonaje(config.numeroPersonajes, config.descripcionPersonaje)
  const ambiente = config.ambiente || 'estudio de baile moderno con iluminación cálida y cinemática'
  const musica = config.musica || `ritmo de ${config.danza} a tempo medio`
  const aspecto = config.relacionAspecto || '9:16'

  const textoConexion = config.numeroPersonajes === 2
    ? 'con clara conexión, contacto visual y sincronía entre ambos bailarines'
    : 'con técnica clara y expresión natural'

  const promptImagenReferencia = [
    `Retrato cinemático de ${personaje}, posando en ${ambiente}.`,
    `Estilo: ${config.estiloVisual}, iluminación profesional, colores realistas y vibrantes.`,
    `Vestimenta apropiada para baile de ${config.danza}, expresión natural y segura.`,
    `Alta calidad, detalle en rostros, manos y postura, fondo ligeramente desenfocado.`,
    `Ideal como imagen de referencia para generar video consistente en Grok Imagine.`
  ].join(' ')

  const promptVideo = [
    `Video cinemático de baile de ${config.danza}, duración ${config.duracionSegundos} segundos, relación de aspecto ${aspecto}.`,
    `Usa como referencia la imagen del personaje generada previamente para mantener consistencia de rostros, vestimenta y estilo.`,
    `Personajes: ${personaje}.`,
    `Movimientos: ${pasosTexto}, ejecutados con técnica clara, fluidez y expresión natural, ${textoConexion}.`,
    `Estilo visual: ${config.estiloVisual}, iluminación profesional, colores vibrantes pero realistas.`,
    `Ambiente: ${ambiente}.`,
    `Música de fondo: ${musica}.`,
    `Cámara: planos medios y planos detalle de pies y manos, transiciones suaves, sin cortes abruptos.`,
    `Calidad: alta definición, movimientos naturales, consistencia de personajes y vestimenta durante todo el video.`,
    `Enfoque educativo: que se aprecien claramente los pasos${config.numeroPersonajes === 2 ? ' y la conexión entre los bailarines' : ''}.`
  ].join(' ')

  const promptVideoCorto = `Video cinemático de ${config.danza} (${config.duracionSegundos}s, ${aspecto}): ${personaje} realizando ${pasosTexto} en ${ambiente}, estilo ${config.estiloVisual}. Usa imagen de referencia para consistencia.`

  const instruccionesAnimacion = [
    `Paso 3 – Animación y sincronización (recomendado con Viggle AI, Seedance u herramienta similar de motion transfer):`,
    `1. Toma el video generado en Grok Imagine (o la imagen de referencia si prefieres partir de estática).`,
    `2. Sube un video de referencia de baile real de ${config.danza} (puede ser corto, de 5-15 segundos) que tenga los movimientos que deseas.`,
    `3. Usa la función de motion transfer / animación de personaje para aplicar los movimientos del video de referencia al personaje generado.`,
    `4. Conserva o reemplaza el audio original con la música de ${config.danza} deseada (ritmo ${musica}).`,
    `5. Ajusta la sincronización si es necesario (algunas herramientas permiten alinear el beat).`,
    `6. Exporta en la relación de aspecto ${aspecto} y revisa que los rostros y vestimenta se mantengan consistentes.`,
    `Consejo: para mejor resultado, el video de referencia debe tener movimientos claros y el personaje generado debe tener buena calidad de rostro y cuerpo.`
  ].join('\n')

  return {
    promptImagenReferencia,
    promptVideo,
    promptVideoCorto,
    instruccionesAnimacion,
    parametrosSugeridos: {
      duracion: `${config.duracionSegundos}s`,
      estilo: config.estiloVisual,
      relacionAspecto: aspecto,
      personajes: config.numeroPersonajes === 1 ? '1 personaje' : '2 personajes (pareja)'
    },
    instruccionesUso: '1) Genera la imagen de referencia en Grok Imagine. 2) Genera el video usando esa imagen. 3) Usa Viggle (u otra herramienta) para transferir movimiento de un video de baile real y sincronizar con la música.'
  }
}

export function generarPromptsPorPasos(
  danza: string,
  pasos: string[],
  estiloVisual = 'cinemático realista',
  numeroPersonajes: 1 | 2 = 1
): PromptGenerado[] {
  return pasos.map((paso) =>
    generarPromptVideo({
      danza,
      pasos: [paso],
      estiloVisual,
      numeroPersonajes,
      duracionSegundos: 8,
      ambiente: 'estudio de baile bien iluminado',
      descripcionPersonaje: numeroPersonajes === 1
        ? 'bailarín/a profesional demostrando la técnica'
        : undefined
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
    instruccionesAnimacion: prompt.instruccionesAnimacion,
    duracion: config.duracionSegundos,
    formato: 'Grok_Imagine + animación',
    personajes: prompt.parametrosSugeridos.personajes,
    instrucciones: prompt.instruccionesUso
  }
}
