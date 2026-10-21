import React, { useMemo, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

const R = 1.5 
const W = 0.74 
const DEPTH = 0.42 

const hex = (deg) => [R * Math.cos((deg * Math.PI) / 180), R * Math.sin((deg * Math.PI) / 180)]
const V = { top: hex(90), ur: hex(30), lr: hex(-30), bot: hex(-90), ll: hex(-150), ul: hex(150) }
const midL = [V.ul[0], 0]
const midR = [V.ur[0], 0]

const BLUE_PATH = [V.ur, V.top, V.ul, midL, [0.12, 0]]
const ORANGE_PATH = [[-0.12, 0], midR, V.lr, V.bot, V.ll]

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const mul = (a, s) => [a[0] * s, a[1] * s]
const len = (a) => Math.hypot(a[0], a[1])
const norm = (a) => mul(a, 1 / (len(a) || 1))

function roundCorners(pts, radius, seg = 8) {
  const out = [pts[0]]
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1]
    const r = Math.min(radius, len(sub(a, b)) / 2, len(sub(c, b)) / 2)
    const p1 = add(b, mul(norm(sub(a, b)), r))
    const p2 = add(b, mul(norm(sub(c, b)), r))
    for (let s = 0; s <= seg; s++) {
      const t = s / seg, u = 1 - t
      out.push([u * u * p1[0] + 2 * u * t * b[0] + t * t * p2[0], u * u * p1[1] + 2 * u * t * b[1] + t * t * p2[1]])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

function bandShape(center, width) {
  const pts = roundCorners(center, 0.34)
  const half = width / 2
  const left = [], right = []
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)], next = pts[Math.min(pts.length - 1, i + 1)]
    const dPrev = norm(sub(pts[i], prev)), dNext = norm(sub(next, pts[i]))
    const t = i === 0 ? dNext : i === pts.length - 1 ? dPrev : norm(add(dPrev, dNext))
    const n = [-t[1], t[0]]
    const nRef = i === 0 ? [-dNext[1], dNext[0]] : [-dPrev[1], dPrev[0]]
    const m = half / Math.max(0.35, n[0] * nRef[0] + n[1] * nRef[1])
    left.push(add(pts[i], mul(n, m)))
    right.push(sub(pts[i], mul(n, m)))
  }
  const shape = new THREE.Shape()
  shape.moveTo(...left[0])
  left.slice(1).forEach((p) => shape.lineTo(...p))
  right.reverse().forEach((p) => shape.lineTo(...p))
  shape.closePath()
  return shape
}

function useHookGeometry(path, light, dark) {
  return useMemo(() => {
    const g = new THREE.ExtrudeGeometry(bandShape(path, W), {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.06,
      bevelSegments: 5,
      curveSegments: 12,
    })
    g.translate(0, 0, -DEPTH / 2)
    g.computeVertexNormals()
    const pos = g.attributes.position
    const cols = new Float32Array(pos.count * 3)
    const c1 = new THREE.Color(light), c2 = new THREE.Color(dark), c = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const t = THREE.MathUtils.clamp(0.5 - (pos.getY(i) - pos.getX(i) * 0.5) / (R * 2.2), 0, 1)
      c.copy(c1).lerp(c2, t)
      cols.set([c.r, c.g, c.b], i * 3)
    }
    g.setAttribute('color', new THREE.BufferAttribute(cols, 3))
    return g
  }, [path, light, dark])
}

function LogoMesh({ input }) {
  const group = useRef()
  const blueGeo = useHookGeometry(BLUE_PATH, '#4FA8FF', '#1236B8')
  const orangeGeo = useHookGeometry(ORANGE_PATH, '#FFA640', '#D9480F')

  const mats = useMemo(() => {
    const face = (emissive) =>
      new THREE.MeshPhysicalMaterial({ vertexColors: true, emissive, emissiveIntensity: 0.3, metalness: 0.3, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.05 })
    const side = new THREE.MeshPhysicalMaterial({ color: '#3A4258', metalness: 0.85, roughness: 0.3, clearcoat: 0.7, envMapIntensity: 1.8 })
    return { blue: [face('#0B3A9E'), side], orange: [face('#7A2A00'), side] }
  }, [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const s = input.current
    const dt = Math.min(delta, 0.05)

    if (!s.dragging) {
      s.velY = THREE.MathUtils.damp(s.velY, 0.45, 1.6, dt)
      s.velX = THREE.MathUtils.damp(s.velX, 0, 3, dt)
    }
    s.rotY += s.velY * dt
    s.rotX = THREE.MathUtils.clamp(s.rotX + s.velX * dt, -0.9, 0.9)
    if (!s.dragging) s.rotX = THREE.MathUtils.damp(s.rotX, 0, 1.5, dt)

    const tiltX = s.hover ? -s.py * 0.35 : 0
    const tiltY = s.hover ? s.px * 0.35 : 0
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, s.rotX + tiltX, 6, dt)
    g.rotation.y = s.rotY + THREE.MathUtils.damp(g.userData.ty || 0, tiltY, 6, dt)
    g.userData.ty = g.rotation.y - s.rotY
    g.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08
  })

  return (
    <group ref={group}>
      <group rotation={[0, 0, -0.38]}>
        <mesh geometry={blueGeo} material={mats.blue} position={[0, 0, -0.07]} />
        <mesh geometry={orangeGeo} material={mats.orange} position={[0, 0, 0.07]} />
      </group>
    </group>
  )
}

export default function Logo3D({ className = '' }) {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(false)
  const input = useRef({ rotY: 0.6, rotX: 0, velY: 0.45, velX: 0, dragging: false, hover: false, px: 0, py: 0, lastX: 0, lastY: 0, lastT: 0 })

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  const onPointerMove = (e) => {
    const s = input.current
    const r = wrap.current.getBoundingClientRect()
    s.px = ((e.clientX - r.left) / r.width) * 2 - 1
    s.py = ((e.clientY - r.top) / r.height) * 2 - 1
    s.hover = true
    if (s.dragging) {
      const now = performance.now()
      const dt = Math.max(1, now - s.lastT) / 1000
      const dx = e.clientX - s.lastX, dy = e.clientY - s.lastY
      s.rotY += dx * 0.012
      s.rotX += dy * 0.008
      s.velY = (dx * 0.012) / dt
      s.velX = (dy * 0.008) / dt
      s.lastX = e.clientX; s.lastY = e.clientY; s.lastT = now
    }
  }
  const onPointerDown = (e) => {
    const s = input.current
    s.dragging = true
    s.lastX = e.clientX; s.lastY = e.clientY; s.lastT = performance.now()
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerUp = (e) => {
    input.current.dragging = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }
  const onPointerLeave = () => { input.current.hover = false }

  return (
    <div
      ref={wrap}
      className={`logo3d ${className}`}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      <Canvas
        dpr={[1, 1.5]}
        resize={{ offsetSize: true }}
        camera={{ position: [0, 0, 7.4], fov: 35 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        frameloop={visible ? 'always' : 'never'}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <pointLight position={[-3, -2, 3]} intensity={14} color="#FF8A2B" distance={10} />
        <pointLight position={[3, 2, 3]} intensity={14} color="#3B7BFF" distance={10} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={4} position={[0, 4, 3]} scale={[8, 1.5, 1]} color="#FFFFFF" />
          <Lightformer form="rect" intensity={2.5} position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[5, 2, 1]} color="#7FA6FF" />
          <Lightformer form="rect" intensity={2} position={[4, -1, 2]} rotation-y={-Math.PI / 2} scale={[5, 2, 1]} color="#FFB070" />
        </Environment>
        <LogoMesh input={input} />
      </Canvas>
    </div>
  )
}
