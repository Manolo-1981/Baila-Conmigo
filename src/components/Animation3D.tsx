import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { dances } from '../lib/dances'

export default function Animation3D() {
  const [danzaId, setDanzaId] = useState(dances[0]?.id || '')
  const [activo, setActivo] = useState(false)
  const [bpm, setBpm] = useState(120)
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    dancer: THREE.Group
    clock: THREE.Clock
  } | null>(null)

  const danza = dances.find(d => d.id === danzaId)

  useEffect(() => {
    if (danza) setBpm(danza.velocidad)
  }, [danzaId])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = 380

    // Escena
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f0c29)
    scene.fog = new THREE.Fog(0x0f0c29, 8, 20)

    // Cámara
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 1.6, 5)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    // Luces
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffd700, 1.2)
    dirLight.position.set(3, 6, 4)
    dirLight.castShadow = true
    scene.add(dirLight)

    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4)
    fillLight.position.set(-4, 3, 2)
    scene.add(fillLight)

    // Suelo
    const floorGeo = new THREE.PlaneGeometry(12, 12)
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8 })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Bailarín 3D (grupo de meshes)
    const dancer = new THREE.Group()

    // Cabeza
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.4 })
    )
    head.position.y = 1.65
    head.castShadow = true
    dancer.add(head)

    // Torso
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.32, 0.7, 16),
      new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.5, metalness: 0.2 })
    )
    torso.position.y = 1.15
    torso.castShadow = true
    dancer.add(torso)

    // Brazos
    const armMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.5 })
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.55, 12), armMat)
    leftArm.position.set(-0.45, 1.25, 0)
    leftArm.rotation.z = 0.3
    leftArm.castShadow = true
    dancer.add(leftArm)

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.55, 12), armMat)
    rightArm.position.set(0.45, 1.25, 0)
    rightArm.rotation.z = -0.3
    rightArm.castShadow = true
    dancer.add(rightArm)

    // Piernas
    const legMat = new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.6 })
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.75, 12), legMat)
    leftLeg.position.set(-0.15, 0.4, 0)
    leftLeg.castShadow = true
    dancer.add(leftLeg)

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.75, 12), legMat)
    rightLeg.position.set(0.15, 0.4, 0)
    rightLeg.castShadow = true
    dancer.add(rightLeg)

    scene.add(dancer)

    const clock = new THREE.Clock()

    sceneRef.current = { scene, camera, renderer, dancer, clock }

    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      camera.aspect = w / height
      camera.updateProjectionMatrix()
      renderer.setSize(w, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    if (!sceneRef.current) return

    let frameId: number
    const { renderer, scene, camera, dancer, clock } = sceneRef.current

    const animate = () => {
      frameId = requestAnimationFrame(animate)

      if (activo) {
        const t = clock.getElapsedTime()
        const speed = bpm / 60

        // Movimiento de baile
        dancer.rotation.y = Math.sin(t * speed * 0.8) * 0.4
        dancer.position.y = Math.sin(t * speed * 2) * 0.08

        // Brazos
        const leftArm = dancer.children[2] as THREE.Mesh
        const rightArm = dancer.children[3] as THREE.Mesh
        if (leftArm && rightArm) {
          leftArm.rotation.z = 0.3 + Math.sin(t * speed * 2) * 0.6
          rightArm.rotation.z = -0.3 - Math.sin(t * speed * 2) * 0.6
          leftArm.rotation.x = Math.sin(t * speed * 1.5) * 0.3
          rightArm.rotation.x = Math.sin(t * speed * 1.5 + Math.PI) * 0.3
        }

        // Piernas
        const leftLeg = dancer.children[4] as THREE.Mesh
        const rightLeg = dancer.children[5] as THREE.Mesh
        if (leftLeg && rightLeg) {
          leftLeg.rotation.x = Math.sin(t * speed * 2) * 0.5
          rightLeg.rotation.x = Math.sin(t * speed * 2 + Math.PI) * 0.5
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => cancelAnimationFrame(frameId)
  }, [activo, bpm])

  return (
    <div style={{
      maxWidth: '780px',
      margin: '0 auto',
      padding: '1.5rem',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255,215,0,0.2)'
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>🎭 Animación 3D Avanzada</h2>

      <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <label>
          Danza
          <select value={danzaId} onChange={e => setDanzaId(e.target.value)} style={selectStyle}>
            {dances.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </label>

        <label>
          BPM: {bpm}
          <input
            type="range"
            min={60}
            max={220}
            value={bpm}
            onChange={e => setBpm(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
      </div>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '380px',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '1.25rem',
          background: '#0f0c29'
        }}
      />

      <button
        onClick={() => setActivo(a => !a)}
        style={{
          ...botonStyle,
          background: activo ? 'rgba(255,100,100,0.3)' : 'rgba(255,215,0,0.25)',
          fontSize: '1.1rem'
        }}
      >
        {activo ? '⏹ Detener animación' : '▶ Iniciar animación 3D'}
      </button>

      <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.75 }}>
        Escena 3D con Three.js: iluminación, sombras y movimiento de baile sincronizado al BPM.
        {danza && ` Danza actual: ${danza.nombre}.`}
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
  padding: '0.75rem 1.5rem',
  background: 'rgba(255,215,0,0.2)',
  border: '2px solid rgba(255,215,0,0.5)',
  borderRadius: '10px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '1rem'
}
