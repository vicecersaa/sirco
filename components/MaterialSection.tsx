'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const materials = [
  {
    id: '01',
    name: 'Limestone',
    description: 'Rough cut natural limestone with warm cream tones and organic imperfections.',
    x: 9,   // % dari kiri
    y: 18,  // % dari atas
    cardSide: 'right' as const,
  },
  {
    id: '02',
    name: 'Oak Wood',
    description: 'Natural oak with visible grain and subtle knots, finished in a soft matte.',
    x: 68,
    y: 20,
    cardSide: 'right' as const,
  },
  {
    id: '03',
    name: 'Linen',
    description: 'Raw linen fabric with a relaxed texture and natural irregularities.',
    x: 60,
    y: 55,
    cardSide: 'left' as const,
  },
  {
    id: '04',
    name: 'Microcement',
    description: 'Seamless microcement flooring in a warm beige tone with a smooth, natural finish.',
    x: 28,
    y: 80,
    cardSide: 'left' as const,
  },
  {
    id: '05',
    name: 'Jute Rug',
    description: 'Handwoven natural jute with organic texture and earthy character.',
    x: 50,
    y: 80,
    cardSide: 'right' as const,
  },
  {
    id: '06',
    name: 'Ceramic',
    description: 'Handmade ceramic pieces with a raw, earthy texture and timeless appeal.',
    x: 78,
    y: 72,
    cardSide: 'left' as const,
  },
]

// Panjang garis dalam px
const LINE_LEN = 120

export default function MaterialSection() {
  const sectionRef = useRef<HTMLElement>(null)

 useEffect(() => {
  const section = sectionRef.current
  if (!section) return

  const dots  = section.querySelectorAll<SVGCircleElement>('[data-dot]')
  const rings = section.querySelectorAll<SVGCircleElement>('[data-ring]')
  const lines = section.querySelectorAll<SVGLineElement>('[data-line]')
  const cards = section.querySelectorAll<HTMLElement>('[data-card]')

  // Reset awal
  gsap.set(dots,  { scale: 0, opacity: 0, transformOrigin: 'center center' })
  gsap.set(rings, { scale: 0, opacity: 0, transformOrigin: 'center center' })
  gsap.set(lines, { attr: { 'stroke-dashoffset': LINE_LEN }, opacity: 0 })
  gsap.set(cards, { opacity: 0, y: 8 })

  // Hapus ScrollTrigger — ganti dengan custom event dari Hero
  const runAnimation = () => {
    materials.forEach((_, i) => {
      const base = i * 0.65
      gsap.to(dots[i],  { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.5)', delay: base })
      gsap.to(rings[i], { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out', delay: base + 0.15 })
      gsap.to(lines[i], { attr: { 'stroke-dashoffset': 0 }, opacity: 1, duration: 0.55, ease: 'power2.inOut', delay: base + 0.3 })
      gsap.to(cards[i], { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: base + 0.65 })
    })
  }

  section.addEventListener('portal-enter', runAnimation)

  return () => {
    section.removeEventListener('portal-enter', runAnimation)
  }
}, [])

  return (
    <section
      ref={sectionRef}
      data-material-section
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        overflow: 'hidden',
        background: '#1a1814',
      }}
    >
      {/* GAMBAR RUANGAN */}
      <img
        src="/images/interior.jpg"
        alt="Sirco Interior"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* VIGNETTE */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.25) 100%)',
        zIndex: 1,
      }} />

      {/* LABEL */}
      <div style={{
        position: 'absolute',
        top: 'clamp(20px,2.5vw,40px)',
        left: 'clamp(20px,2.5vw,40px)',
        zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <span style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Sirco / Materials</span>
        <span style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>2026</span>
      </div>

      {/* SVG — dots + rings + lines */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          zIndex: 5, overflow: 'visible',
        }}
      >
        {materials.map((m, i) => {
          // Ujung garis dalam viewBox units (~100x100)
          // LINE_LEN px → konversi ke vw: kira-kira 8 unit di viewbox 100
          const lineLen = m.cardSide === 'right' ? -8 : 8
          const x2 = m.x + lineLen
          const y2 = m.y - 3

          return (
            <g key={m.id}>
              <line
                data-line
                x1={m.x} y1={m.y}
                x2={x2}  y2={y2}
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="0.15"
                strokeDasharray={LINE_LEN}
                strokeDashoffset={LINE_LEN}
              />
              {/* ring luar */}
              <circle
                data-ring
                cx={m.x} cy={m.y} r="1.2"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="0.15"
              />
              {/* dot */}
              <circle
                data-dot
                cx={m.x} cy={m.y} r="0.55"
                fill="rgba(255,255,255,0.95)"
              />
            </g>
          )
        })}
      </svg>

      {/* CARDS — posisi absolut dalam % */}
      {materials.map((m, i) => {
        const isRight = m.cardSide === 'right'
        // Card muncul di sisi berlawanan dari garis
        // Garis ke kiri → card di kiri ujung garis, garis ke kanan → card di kanan
        const cardStyle: React.CSSProperties = {
          position: 'absolute',
          top: `calc(${m.y}% - 60px)`,
          width: 'clamp(160px,14vw,210px)',
          background: 'rgba(244,243,239,0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '0.5px solid rgba(0,0,0,0.1)',
          padding: '10px 14px 12px',
          zIndex: 10,
          boxSizing: 'border-box',
        }

        if (isRight) {
          // garis ke kiri → card di sisi kiri dot
          cardStyle.right = `calc(${100 - m.x}% + 10vw)`
        } else {
          // garis ke kanan → card di sisi kanan dot
          cardStyle.left = `calc(${m.x}% + 10vw)`
        }

        return (
          <div key={m.id} data-card style={cardStyle}>
            <span style={{
              display: 'block',
              fontSize: 8, letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.3)',
              marginBottom: 5,
            }}>
              {m.id}
            </span>
            <p style={{
              fontSize: 'clamp(10px,0.75vw,12px)',
              fontWeight: 600,
              color: '#0e0e0c',
              margin: '0 0 6px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              {m.name}
            </p>
            <p style={{
              fontSize: 10,
              lineHeight: 1.65,
              color: 'rgba(0,0,0,0.48)',
              margin: 0,
            }}>
              {m.description}
            </p>
          </div>
        )
      })}
    </section>
  )
}