'use client'

import { useEffect, useRef } from 'react'

// Perlin noise — matches the `new Noise(seed).perlin2()` API from the original CodePen
class PerlinNoise {
  private p: number[]

  constructor(seed: number) {
    const perm = Array.from({ length: 256 }, (_, i) => i)
    let s = Math.floor(seed * 2147483647)
    for (let i = 255; i > 0; i--) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0
      const j = s % (i + 1)
      ;[perm[i], perm[j]] = [perm[j], perm[i]]
    }
    this.p = [...perm, ...perm]
  }

  private fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10) }
  private lerp(t: number, a: number, b: number) { return a + t * (b - a) }
  private grad(hash: number, x: number, y: number) {
    const h = hash & 3
    const u = h < 2 ? x : y
    const v = h < 2 ? y : x
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
  }

  perlin2(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    x -= Math.floor(x)
    y -= Math.floor(y)
    const u = this.fade(x)
    const v = this.fade(y)
    const a = this.p[X] + Y
    const b = this.p[X + 1] + Y
    return this.lerp(v,
      this.lerp(u, this.grad(this.p[a], x, y), this.grad(this.p[b], x - 1, y)),
      this.lerp(u, this.grad(this.p[a + 1], x, y - 1), this.grad(this.p[b + 1], x - 1, y - 1))
    )
  }
}

type Point = {
  x: number
  y: number
  wave: { x: number; y: number }
  cursor: { x: number; y: number; vx: number; vy: number }
}

export default function WavyBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current!
    const svg = svgRef.current!
    if (!container || !svg) return

    const mouse = { x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false }
    let lines: Point[][] = []
    let paths: SVGPathElement[] = []
    const noise = new PerlinNoise(Math.random())
    let animId: number

    function setSize() {
      const b = container.getBoundingClientRect()
      svg.style.width = `${b.width}px`
      svg.style.height = `${b.height}px`
    }

    function setLines() {
      const b = container.getBoundingClientRect()
      const { width, height } = b

      lines = []
      paths.forEach((p) => p.remove())
      paths = []

      const xGap = 10
      const yGap = 32
      const oWidth = width + 200
      const oHeight = height + 30
      const totalLines = Math.ceil(oWidth / xGap)
      const totalPoints = Math.ceil(oHeight / yGap)
      const xStart = (width - xGap * totalLines) / 2
      const yStart = (height - yGap * totalPoints) / 2

      for (let i = 0; i <= totalLines; i++) {
        const points: Point[] = []
        for (let j = 0; j <= totalPoints; j++) {
          points.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          })
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('fill', 'none')
        path.setAttribute('stroke', 'white')
        path.setAttribute('stroke-width', '1')
        path.setAttribute('stroke-opacity', '0.2')
        svg.appendChild(path)
        paths.push(path)
        lines.push(points)
      }
    }

    function updateMousePosition(x: number, y: number) {
      const b = container.getBoundingClientRect()
      mouse.x = x - b.left
      mouse.y = y - b.top + window.scrollY
      if (!mouse.set) {
        mouse.sx = mouse.x
        mouse.sy = mouse.y
        mouse.lx = mouse.x
        mouse.ly = mouse.y
        mouse.set = true
      }
    }

    function movePoints(time: number) {
      lines.forEach((points) => {
        points.forEach((p) => {
          const move =
            noise.perlin2(
              (p.x + time * 0.0125) * 0.002,
              (p.y + time * 0.005) * 0.0015
            ) * 12
          p.wave.x = Math.cos(move) * 32
          p.wave.y = Math.sin(move) * 16

          const dx = p.x - mouse.sx
          const dy = p.y - mouse.sy
          const d = Math.hypot(dx, dy)
          const l = Math.max(175, mouse.vs)

          if (d < l) {
            const s = 1 - d / l
            const f = Math.cos(d * 0.001) * s
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065
          }

          p.cursor.vx += (0 - p.cursor.x) * 0.005
          p.cursor.vy += (0 - p.cursor.y) * 0.005
          p.cursor.vx *= 0.925
          p.cursor.vy *= 0.925
          p.cursor.x += p.cursor.vx * 2
          p.cursor.y += p.cursor.vy * 2
          p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x))
          p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y))
        })
      })
    }

    function moved(point: Point, withCursorForce = true) {
      return {
        x: Math.round((point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0)) * 10) / 10,
        y: Math.round((point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0)) * 10) / 10,
      }
    }

    function drawLines() {
      lines.forEach((points, lIndex) => {
        const p1 = moved(points[0], false)
        let d = `M ${p1.x} ${p1.y}`
        points.forEach((pt, pIndex) => {
          const isLast = pIndex === points.length - 1
          const mp1 = moved(pt, !isLast)
          d += ` L ${mp1.x} ${mp1.y}`
        })
        paths[lIndex].setAttribute('d', d)
      })
    }

    function tick(time: number) {
      mouse.sx += (mouse.x - mouse.sx) * 0.1
      mouse.sy += (mouse.y - mouse.sy) * 0.1

      const dx = mouse.x - mouse.lx
      const dy = mouse.y - mouse.ly
      const d = Math.hypot(dx, dy)
      mouse.v = d
      mouse.vs += (d - mouse.vs) * 0.1
      mouse.vs = Math.min(100, mouse.vs)
      mouse.lx = mouse.x
      mouse.ly = mouse.y
      mouse.a = Math.atan2(dy, dx)

      movePoints(time)
      drawLines()

      animId = requestAnimationFrame(tick)
    }

    setSize()
    setLines()

    const onResize = () => { setSize(); setLines() }
    const onMouseMove = (e: MouseEvent) => updateMousePosition(e.pageX, e.pageY)
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      updateMousePosition(touch.clientX, touch.clientY)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    container.addEventListener('touchmove', onTouchMove, { passive: false } as AddEventListenerOptions)

    animId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('touchmove', onTouchMove)
      paths.forEach((p) => p.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg ref={svgRef} className="block" />
    </div>
  )
}
