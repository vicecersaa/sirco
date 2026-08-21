'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { id: '01', image: '/images/project-1.jpg' },
  { id: '02', image: '/images/project-2.jpg' },
  { id: '03', image: '/images/project-3.jpg' },
  { id: '04', image: '/images/project-4.jpg' },
  { id: '05', image: '/images/project-5.jpg' },

  { id: '06', image: '/images/project-1.jpg' },
  { id: '07', image: '/images/project-2.jpg' },
  { id: '08', image: '/images/project-3.jpg' },
  { id: '09', image: '/images/project-4.jpg' },
  { id: '10', image: '/images/project-5.jpg' },

  { id: '11', image: '/images/project-1.jpg' },
  { id: '12', image: '/images/project-2.jpg' },
  { id: '13', image: '/images/project-3.jpg' },
  { id: '14', image: '/images/project-4.jpg' },
  { id: '15', image: '/images/project-5.jpg' },
]

const columns = [
  projects.slice(0, 3),
  projects.slice(3, 6),
  projects.slice(6, 9),
  projects.slice(9, 12),
  projects.slice(12, 15),
]

const colDirections = [100, -100, 100, -100, 100]
const colOffsets = [0, 16, 0, 16, 0]

export default function Projects() {
  const section = useRef<HTMLElement>(null)
  const intro = useRef<HTMLDivElement>(null)
  const unlocked = useRef(false)

  useLayoutEffect(() => {
  const el = section.current
  const introEl = intro.current

  if (!el) return

  const cards = Array.from(
    el.querySelectorAll<HTMLElement>('.project-card')
  )

  // Set semua card tersembunyi dari awal
  cards.forEach((card, index) => {
    const colIndex = Math.floor(index / 3)
    const direction = colDirections[colIndex]
    gsap.set(card, {
      y: direction > 0 ? 60 : -60,
      autoAlpha: 0,
    })
  })

  const animateVisibleCards = () => {
    cards.forEach((card) => {
      gsap.to(card, {
        y: 0,
        autoAlpha: 1,
        duration: 2.2,
        ease: 'power3.out',
        overwrite: true,
      })
    })
  }

  // Setup scroll triggers
  const triggers: ScrollTrigger[] = []
  let timeout: ReturnType<typeof setTimeout> | null = null

  cards.forEach((card, index) => {
    const colIndex = Math.floor(index / 3)
    const direction = colDirections[colIndex]
    const fromY = direction > 0 ? 60 : -60

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      end: 'bottom 15%',

      onEnter: () => {
        if (!unlocked.current) return
        gsap.to(card, {
          y: 0,
          autoAlpha: 1,
          duration: 2.2,
          ease: 'power3.out',
          overwrite: true,
        })
      },

      onEnterBack: () => {
        if (!unlocked.current) return
        gsap.to(card, {
          y: 0,
          autoAlpha: 1,
          duration: 2.2,
          ease: 'power3.out',
          overwrite: true,
        })
      },

      onLeaveBack: () => {
        if (!unlocked.current) return
        gsap.to(card, {
          y: fromY,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power2.in',
          overwrite: true,
        })
      },

      onLeave: () => {
        if (!unlocked.current) return
        gsap.to(card, {
          y: -fromY,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power2.in',
          overwrite: true,
        })
      },
    })

    triggers.push(st)
  })

  ScrollTrigger.refresh()

  // ✅ Pakai IntersectionObserver — detect pertama kali section masuk viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !unlocked.current) {
          // ✅ Section baru masuk, mulai delay
          observer.disconnect() // cukup sekali

          if (introEl) {
            introEl.style.opacity = '1'
            introEl.style.visibility = 'visible'
          }

          timeout = setTimeout(() => {
            if (introEl) {
              gsap.to(introEl, {
                autoAlpha: 0,
                duration: 0.6,
                ease: 'power2.inOut',
                onComplete: () => {
                  unlocked.current = true
                  animateVisibleCards()
                  ScrollTrigger.refresh()
                },
              })
            }
          }, 1000) // delay setelah section masuk viewport
        }
      })
    },
    { threshold: 0.5 } // section keliatan 10% baru trigger
  )

  observer.observe(el)

  return () => {
    if (timeout) clearTimeout(timeout)
    observer.disconnect()
    triggers.forEach((st) => st.kill())
    gsap.killTweensOf(cards)
    if (introEl) gsap.killTweensOf(introEl)
  }
}, [])

  return (
    <section
      ref={section}
      className="relative overflow-hidden bg-[#0e0e0c]"
      style={{
        height: '100vh',
        padding: '12px 0',
        display: 'grid',
        gridTemplateColumns: '0.5fr 1fr 1fr 1fr 0.5fr',
        columnGap: '12px',
        boxSizing: 'border-box',
      }}
    >
      <div
        ref={intro}
        className="pointer-events-none absolute inset-0 z-50 bg-[#0e0e0c]"
      />

      {columns.map((col, colIndex) => (
        <div
          key={colIndex}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: 0,
            marginTop: colOffsets[colIndex],
            marginBottom: colOffsets[colIndex] === 0 ? 16 : 0,
            width: colIndex === 0 || colIndex === 4 ? 'calc(100% + 30%)' : '100%',
            marginLeft: colIndex === 0 ? '-30%' : 0,
          }}
        >
          {col.map((project) => (
            <div
              key={project.id}
              className="project-card relative overflow-hidden bg-[#191917]"
              style={{ flex: 1, minHeight: 0 }}
            >
              <img
                src={project.image}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}