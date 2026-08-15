'use client'
import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import SplitType from 'split-type'

export default function Hero() {
  const container = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!container.current) return

    const split = new SplitType('[data-sirco]', { types: 'chars' })

    split.chars?.forEach((char) => {
      const wrapper = document.createElement('span')
      wrapper.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:bottom; line-height:1'
      char.style.display = 'inline-block'
      char.parentNode?.insertBefore(wrapper, char)
      wrapper.appendChild(char)
    })

    const topCells = document.querySelectorAll('[data-cell-top]')
    const bottomCells = document.querySelectorAll('[data-cell-bottom]')

    const tl = gsap.timeline({ delay: 0.3 })

    tl.from(topCells, {
      yPercent: -100,
      duration: 1.4,
      ease: 'expo.inOut',
      stagger: { amount: 0.4, from: 'start' }
    })
    .from(bottomCells, {
      yPercent: 100,
      duration: 1.4,
      ease: 'expo.inOut',
      stagger: { amount: 0.4, from: 'start' }
    }, '<')
    .from('[data-sweep]', {
      scaleX: 0,
      duration: 0.8,
      ease: 'expo.inOut',
      transformOrigin: 'left center',
    }, '-=0.3')
    .from('[data-label]', {
      opacity: 0,
      y: -8,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.4')
    .from('[data-nav]', {
      opacity: 0,
      y: -16,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.1
    }, '-=0.5')
    .from(split.chars, {
      yPercent: 110,
      skewX: -12,
      opacity: 0,
      duration: 1.8,
      ease: 'expo.out',
      stagger: 0.08,
    }, '-=0.3')
    .to(split.chars, {
      skewX: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.04,
    }, '-=1.2')
    .from('[data-tagline]', {
      opacity: 0,
      y: 10,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.6')
    .from('[data-count]', {
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')

    return () => {
      tl.kill()
      split.revert()
    }
  }, [])

  return (
    <section ref={container} className="relative w-full h-screen bg-[#0e0e0c] overflow-hidden font-sans">

      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-[2px]">
        {[1, 2, 3, 4, 5].map((n) => {
          const isTop = n <= 3
          return (
            <div
              key={n}
              {...(isTop ? { 'data-cell-top': '' } : { 'data-cell-bottom': '' })}
              className={`relative overflow-hidden ${n === 2 ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'}`}
            >
              <img
                src={`/images/project-${n}.jpg`}
                alt={`Project ${n}`}
                loading="eager"
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-cover brightness-90"
              />
            </div>
          )
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0c] via-[#0e0e0c]/40 to-transparent z-10" />
      </div>

      <div
        data-sweep
        className="absolute z-20"
        style={{
          bottom: 'calc(2rem + clamp(140px, 28vw, 260px) * 0.88 + 32px)',
          left: '2rem',
          right: '2rem',
          height: '0.5px',
          background: 'rgba(255,255,255,0.25)',
        }}
      />

      <div data-label className="absolute top-8 left-8 z-20">
        <span className="text-[11px] tracking-[0.3em] uppercase text-white/80 font-light">
          Architecture & Spatial Design
        </span>
      </div>

      <nav className="absolute right-8 top-8 z-30 flex flex-col items-end gap-7">
        {['Studio', 'Projects', 'Process', 'Contact'].map((item) => (
          <span
            key={item}
            data-nav
            className="text-[11px] tracking-[0.28em] uppercase text-white/80 cursor-pointer hover:text-white transition-colors duration-300"
            style={{ writingMode: 'vertical-rl' }}
          >
            {item}
          </span>
        ))}
      </nav>

      <div className="absolute bottom-8 left-8 z-20">
        <h1
          data-sirco
          className="font-bold leading-[0.88] tracking-[-0.04em]"
          style={{
            fontSize: 'clamp(140px, 28vw, 260px)',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.7)',
            color: 'transparent',
          }}
        >
          SIRCO
        </h1>
        <p
          data-tagline
          className="text-[12px] tracking-[0.18em] uppercase text-white/60 font-light"
          style={{ marginTop: '20px' }}
        >
          Jakarta · Est. 2024
        </p>
      </div>

      <div data-count className="absolute bottom-8 right-8 z-20">
        <span className="text-[11px] tracking-[0.22em] uppercase text-white/50 font-light">
          05 Projects
        </span>
      </div>

    </section>
  )
}