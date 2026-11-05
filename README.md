# BAILA CONMIGO

Aplicación educativa de baile (React + Vite + TypeScript) para practicar pasos, generar prompts de video con Grok Imagine y visualizar animaciones 3D.

## Funcionalidades

- **Asistente paso a paso**: Guía completa para generar videos con consistencia de personajes.
- **Generador de prompts**: Crea prompts optimizados para Grok Imagine (imagen de referencia + video) con soporte para 1 o 2 personajes y fotos de archivo.
- **Biblioteca de personajes**: Guarda fotos de referencia en el navegador.
- **Modo práctica**: Metrónomo, lista de pasos, navegación y conteo de tiempos.
- **Animación 3D**: Escena avanzada con Three.js sincronizada al BPM.
- **Módulo de salvar**: Descarga de prompts y videos.

## Danzas incluidas

Salsa, Bachata, Merengue, Cumbia, Tango y Vals (con listas de pasos ampliadas).

## Instalación

```bash
npm install
npm run dev
```

## Flujo recomendado de generación de video

1. Usa el **Asistente** para seguir los pasos.
2. Guarda fotos en la **Biblioteca de personajes**.
3. Ve a **Generar Video**, carga las fotos y genera los prompts.
4. Genera imagen y video en Grok Imagine.
5. Anima y sincroniza en Viggle.
6. Guarda el resultado en la sección **Salvar**.

## Tecnologías

- React 18
- Vite
- TypeScript
- Three.js

## Notas

Los datos (fotos y prompts) se guardan localmente en el navegador (localStorage). No se envían a ningún servidor.

---

> *"Que el ritmo nunca falte"*
