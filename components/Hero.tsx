'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import SplitType from 'split-type'

const cities = [
  { name: 'Jakarta', img: '/images/jakarta.jpg' },
  { name: 'New York', img: '/images/newyork.jpg' },
  { name: 'Manchester', img: '/images/manchester.jpg' },
  { name: 'Tokyo', img: '/images/tokyo.jpg' },
]

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

    const tl = gsap.timeline({ delay: 0.8 })
    const imageCells = Array.from(document.querySelectorAll('[data-cell-top], [data-cell-bottom]'))
    const centerFirst = [imageCells[1], imageCells[0], imageCells[2], imageCells[3], imageCells[4]]

    centerFirst.forEach((cell) => {
      gsap.set(cell, { yPercent: cell.hasAttribute('data-cell-top') ? -100 : 100 })
    })

    tl.to(centerFirst, { yPercent: 0, duration: 1.4, ease: 'expo.inOut', stagger: 0.22 })
      .from('[data-sweep]', { scaleX: 0, duration: 0.8, ease: 'expo.inOut', transformOrigin: 'left center' }, '-=0.3')
      .from('[data-label]', { opacity: 0, y: -8, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .fromTo('[data-nav]', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, '-=0.5')
      .from(split.chars, { yPercent: 110, skewX: -12, opacity: 0, duration: 1.8, ease: 'expo.out', stagger: 0.08 }, '-=0.3')
      .to(split.chars, { skewX: 0, duration: 0.6, ease: 'power2.out', stagger: 0.04 }, '-=1.2')
      .from('[data-tagline]', { opacity: 0, y: 10, duration: 1, ease: 'power3.out' }, '-=0.6')
      .from('[data-count]', { opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('[data-clock]', { yPercent: 110, skewX: -8, opacity: 0, duration: 1.8, ease: 'expo.out' }, '-=1.4')

    // scroll-hint dot animasi turun terus
    gsap.fromTo(
      '[data-scroll-wheel-dot]',
      { y: 0, opacity: 1 },
      { y: 12, opacity: 0, duration: 1.1, repeat: -1, ease: 'power1.in' }
    )

    // ─── REALTIME CLOCK ───────────────────────────────────────────
    const clockEl = document.querySelector('[data-clock]') as HTMLElement
    const updateClock = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      clockEl.textContent = `${hh} : ${mm} : ${ss}`
    }
    updateClock()
    const clockInterval = setInterval(updateClock, 1000)

    const navEls = document.querySelectorAll('[data-nav]')
    const focusOverlay = document.querySelector('[data-focus-overlay]') as HTMLElement
    const expandOverlay = document.querySelector('[data-expand-overlay]') as HTMLElement
    const expandClose = document.querySelector('[data-expand-close]') as HTMLElement
    const layerContainer = document.querySelector('[data-layer-container]') as HTMLElement

    let isExpanded = false
    let currentCityIndex = 0
    let layers: HTMLElement[] = []
    let isScrolling = false

    // ─── UPDATE DOTS ───────────────────────────────────────────────
    const updateDots = (index: number) => {
      document.querySelectorAll('[data-scroll-dot]').forEach((dot, i) => {
        gsap.to(dot, { opacity: i === index ? 1 : 0.25, scale: i === index ? 1.4 : 1, duration: 0.3 })
      })
    }

    // ─── BUAT SATU LAYER KOTA ──────────────────────────────────────
    const createLayer = (index: number, startY = '100%') => {
      const city = cities[index]
      const layer = document.createElement('div')
      layer.dataset.layer = String(index)
      layer.style.cssText = `
        position: absolute; inset: 0;
        display: grid; grid-template-columns: 50% 50%;
        transform: translateY(${startY});
        will-change: transform;
      `
      layer.innerHTML = `
        <div style="position:relative;overflow:hidden;height:100%;">
          <img src="${city.img}" alt="${city.name}"
            style="width:100%;height:100%;object-fit:cover;filter:brightness(0.7);display:block;"/>
          <div style="position:absolute;inset:0;background:linear-gradient(to right,transparent,rgba(14,14,12,0.3))"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.2) 40%,transparent 70%)"></div>
        </div>
        <div style="position:relative;display:flex;flex-direction:column;justify-content:space-between;
          padding:48px 64px;background:#f4f3ef;color:#111;box-sizing:border-box;height:100%;">
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#555;">SIRCO / Project</span>
            <span style="font-size:11px;color:#555;">2024</span>
          </div>
          <div data-layer-content>
            <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#666;margin:0 0 16px;">
              ${city.name.toUpperCase()}
            </p>
            <h2 style="font-size:clamp(64px,7vw,120px);line-height:0.88;font-weight:600;
              letter-spacing:-0.05em;color:#111;margin:0 0 32px;">
              ${city.name}
            </h2>
            <p style="font-size:14px;line-height:1.8;color:#444;max-width:420px;margin:0 0 24px;">
              A bold residential commission that balances raw materiality with spatial precision.
              Conceived as a dialogue between landscape and enclosure, the project draws on local
              vernacular while reaching toward a quieter, more considered modernism.
            </p>
            <div style="height:0.5px;background:rgba(0,0,0,0.15);margin:24px 0;"></div>
            <p style="font-size:11px;line-height:2;letter-spacing:0.22em;text-transform:uppercase;color:#666;margin:0;">
              Architecture · Spatial Design
            </p>
          </div>
          <div>
            <div style="height:0.5px;background:rgba(0,0,0,0.15);margin-bottom:28px;"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;">
              <div>
                <span style="display:block;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:10px;">Type</span>
                <span style="font-size:15px;color:#111;">Residential</span>
              </div>
              <div>
                <span style="display:block;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:10px;">Location</span>
                <span style="font-size:15px;color:#111;">${city.name}</span>
              </div>
              <div>
                <span style="display:block;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:10px;">Status</span>
                <span style="font-size:15px;color:#111;">Completed</span>
              </div>
            </div>
          </div>
        </div>
      `
      return layer
    }

    // ─── INIT LAYER PERTAMA (pas kota diklik) ─────────────────────
    const initExpandLayer = (index: number) => {
      layerContainer.innerHTML = ''
      layers = []
      const layer = createLayer(index, '0%')
      layerContainer.appendChild(layer)
      layers.push(layer)
      const content = layer.querySelector('[data-layer-content]') as HTMLElement
      gsap.fromTo(content, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.7 })
    }

    // ─── SCROLL BAWAH: layer baru naik dari bawah ─────────────────
    const pushLayer = (index: number) => {
      const newLayer = createLayer(index, '100%')
      layerContainer.appendChild(newLayer)
      layers.push(newLayer)
      gsap.to(newLayer, { y: '0%', duration: 0.85, ease: 'expo.inOut' })
      updateDots(index)
    }

    // ─── SCROLL ATAS: layer teratas turun, kota lama keliatan lagi ─
    const popLayer = () => {
      if (layers.length <= 1) return
      const topLayer = layers[layers.length - 1]
      gsap.to(topLayer, {
        y: '100%',
        duration: 0.75,
        ease: 'expo.inOut',
        onComplete: () => {
          topLayer.remove()
          layers.pop()
          currentCityIndex = parseInt(layers[layers.length - 1].dataset.layer || '0')
          updateDots(currentCityIndex)
        },
      })
    }

    // ─── HOVER CITY NAV ───────────────────────────────────────────
    navEls.forEach((el, i) => {
      const card = document.querySelector(`[data-city-card="${i}"]`) as HTMLElement

      el.addEventListener('mouseenter', () => {
        if (!card) return
        gsap.to(focusOverlay, { opacity: 1, duration: 0.35, ease: 'power2.out' })
        gsap.killTweensOf(el)
        gsap.killTweensOf(card)
        gsap.set(el, { scale: 1, y: 0 })
        gsap.set(card, { opacity: 0, y: 8 })
        const rect = el.getBoundingClientRect()
        card.style.position = 'fixed'
        card.style.top = `${rect.bottom + 60}px`
        card.style.right = '40px'
        card.style.left = 'auto'
        card.style.marginTop = '0'
        card.style.display = 'block'
        gsap.to(el, { scale: 3.5, y: -12, transformOrigin: 'right top', color: 'rgba(255,255,255,1)', duration: 0.3, ease: 'power3.out' })
        navEls.forEach((other, j) => {
          if (i === j) return
          gsap.to(other, { y: j > i ? 280 : 0, opacity: 1, duration: 0.35, ease: 'power3.out' })
        })
        gsap.to(card, { opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' })
      })

      el.addEventListener('mouseleave', () => {
        gsap.to(focusOverlay, { opacity: 0, duration: 0.25, ease: 'power2.out' })
        gsap.killTweensOf(el)
        gsap.to(el, { scale: 1, y: 0, color: 'rgba(255,255,255,0.8)', duration: 0.3, ease: 'power3.out' })
        navEls.forEach((other, j) => {
          if (i === j) return
          gsap.to(other, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' })
        })
        if (card) {
          gsap.killTweensOf(card)
          gsap.to(card, { opacity: 0, y: 8, duration: 0.2, ease: 'power2.in', onComplete: () => { card.style.display = 'none' } })
        }
      })

      // ─── KLIK: buka expand overlay ────────────────────────────
      el.addEventListener('click', () => {
        if (isExpanded) return
        isExpanded = true
        currentCityIndex = i

        const cardRect = card.getBoundingClientRect()

        gsap.set(expandOverlay, {
          display: 'block',
          width: cardRect.width,
          height: cardRect.height,
          top: cardRect.top,
          left: cardRect.left,
          right: 'auto',
          bottom: 'auto',
          borderRadius: '2px',
          opacity: 1,
        })

        initExpandLayer(i)

        gsap.to(expandOverlay, {
          width: '100vw', height: '100vh', top: 0, left: 0,
          borderRadius: 0, duration: 0.9, ease: 'expo.inOut',
        })
        gsap.fromTo(expandClose, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.8 })
        expandOverlay.style.pointerEvents = 'auto'

        updateDots(i)
      })
    })

    // ─── CLOSE ────────────────────────────────────────────────────
    expandClose?.addEventListener('click', () => {
      gsap.to(expandOverlay, {
        opacity: 0, scale: 0.95, duration: 0.5, ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(expandOverlay, { display: 'none', scale: 1 })
          expandOverlay.style.pointerEvents = 'none'
          isExpanded = false
        },
      })
    })

    // ─── WHEEL: stack scroll ──────────────────────────────────────
    expandOverlay.addEventListener('wheel', (e: Event) => {
      const we = e as WheelEvent
      we.preventDefault()
      if (isScrolling) return
      isScrolling = true
      setTimeout(() => { isScrolling = false }, 950)

      if (we.deltaY > 0) {
        currentCityIndex = (currentCityIndex + 1) % cities.length
        pushLayer(currentCityIndex)
      } else {
        popLayer()
      }
    }, { passive: false })

    // ─── HOVER IMAGE GRID ─────────────────────────────────────────
    const allCells = document.querySelectorAll('[data-cell-top], [data-cell-bottom]')
    allCells.forEach((cell) => {
      const img = cell.querySelector('img')
      cell.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.05, duration: 0.6, ease: 'power2.out' })
        allCells.forEach((other) => {
          if (other === cell) return
          gsap.to(other.querySelector('img'), { filter: 'grayscale(100%) brightness(0.6)', duration: 0.5, ease: 'power2.out' })
        })
      })
      cell.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, filter: 'grayscale(0%) brightness(0.9)', duration: 0.5, ease: 'power2.out' })
        allCells.forEach((other) => {
          gsap.to(other.querySelector('img'), { filter: 'grayscale(0%) brightness(0.9)', duration: 0.5, ease: 'power2.out' })
        })
      })
    })

    // ─── HOVER SIRCO CHARS ────────────────────────────────────────
    split.chars?.forEach((char) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, { y: -12, WebkitTextStroke: '1.5px rgba(255,255,255,1)', duration: 0.3, ease: 'power3.out' })
      })
      char.addEventListener('mouseleave', () => {
        gsap.to(char, { y: 0, WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', duration: 0.5, ease: 'elastic.out(1, 0.5)' })
      })
    })

    // ─── COOKIE BANNER ────────────────────────────────────────────
    const cookieBanner = document.getElementById('cookie-banner') as HTMLElement
    gsap.to(cookieBanner, { y: '0%', opacity: 1, duration: 0.9, ease: 'expo.out', delay: 2 })

    const dismissCookie = () => {
      gsap.to(cookieBanner, {
        y: '100%', opacity: 0, duration: 0.6, ease: 'expo.inOut',
        onComplete: () => { cookieBanner.style.display = 'none' }
      })
    }
    document.getElementById('btn-accept')?.addEventListener('click', dismissCookie)
    document.getElementById('btn-decline')?.addEventListener('click', dismissCookie)

    return () => {
      tl.kill()
      split.revert()
      clearInterval(clockInterval)
    }
  }, [])

  return (
    <section ref={container} className="relative w-full h-screen bg-[#0e0e0c] overflow-hidden font-sans">

      {/* IMAGE GRID */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-[2px] overflow-hidden">
        {[1, 2, 3, 4, 5].map((n) => {
          const isTop = n <= 3
          return (
            <div key={n} {...(isTop ? { 'data-cell-top': '' } : { 'data-cell-bottom': '' })}
              className={`relative overflow-hidden ${n === 2 ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'}`}>
              <img src={`/images/project-${n}.jpg`} alt={`Project ${n}`} loading="eager"
                className="absolute inset-0 w-full h-full object-cover brightness-90" />
            </div>
          )
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0c] via-[#0e0e0c]/40 to-transparent z-10 pointer-events-none" />
      </div>

      {/* SWEEP LINE */}
      <div data-sweep className="absolute z-[510]"
        style={{ bottom: 'calc(2rem + clamp(140px, 28vw, 260px) * 0.88 + 32px)', left: '2rem', right: '2rem', height: '0.5px', background: 'rgba(255,255,255,0.25)' }} />

      {/* TOP LABEL */}
      <div data-label className="absolute top-8 left-8 z-20">
        <span className="text-[11px] tracking-[0.3em] uppercase text-white/80 font-light">Architecture & Spatial Design</span>
      </div>

      {/* CITY NAVIGATION */}
      <nav className="absolute right-8 top-1/4 z-[25] flex flex-col items-end gap-6">
        {cities.map((city) => (
          <span key={city.name} data-nav
            className="text-[15px] tracking-[0.28em] uppercase text-white cursor-pointer inline-block origin-right font-light"
            style={{ color: '#ffffff', WebkitTextStroke: '0.5px rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,1), 0 3px 8px rgba(0,0,0,0.95), 0 6px 18px rgba(0,0,0,0.8)' }}>
            {city.name}
          </span>
        ))}
      </nav>

      {/* FOCUS OVERLAY */}
      <div data-focus-overlay className="absolute inset-0 z-[15] pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.45)', opacity: 0 }} />

      {/* CITY CARDS */}
      {cities.map((city, i) => (
        <div key={`card-${i}`} data-city-card={i}
          style={{ display: 'none', position: 'fixed', width: '500px', height: '220px', boxSizing: 'border-box', background: '#f4f3ef', color: '#111', padding: '8px', zIndex: 200, pointerEvents: 'none', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.16)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', height: '100%' }}>
            <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: '#ddd' }}>
              <img src={city.img} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.18), transparent 40%, rgba(0,0,0,0.28))' }} />
              <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '8px', lineHeight: 1, letterSpacing: '0.16em', color: '#fff', fontWeight: 500 }}>0{i + 1}</span>
            </div>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '3px 12px 4px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '9px', borderBottom: '1px solid rgba(0,0,0,0.15)' }}>
                <span style={{ fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555' }}>SIRCO / PROJECT</span>
                <span style={{ fontSize: '8px', letterSpacing: '0.12em', color: '#555' }}>2024</span>
              </div>
              <div style={{ marginTop: '18px' }}>
                <h2 style={{ margin: 0, fontSize: '38px', lineHeight: 0.9, fontWeight: 500, letterSpacing: '-0.055em', color: '#111' }}>{city.name}</h2>
                <p style={{ margin: '9px 0 0', fontSize: '8px', lineHeight: 1.4, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#666' }}>Architecture<br />Spatial Design</p>
              </div>
              <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px', borderTop: '1px solid rgba(0,0,0,0.15)', paddingTop: '10px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '7px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>Type</span>
                  <span style={{ fontSize: '10px', letterSpacing: '-0.01em', color: '#111' }}>Residential</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '7px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>Location</span>
                  <span style={{ fontSize: '10px', color: '#111' }}>{city.name}</span>
                </div>
              </div>
              <div style={{ position: 'absolute', right: '12px', bottom: '10px', width: '18px', height: '18px', border: '1px solid rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#111' }}>↗</div>
            </div>
          </div>
        </div>
      ))}

      {/* SIRCO */}
      <div className="absolute bottom-8 left-8 z-[510]">
        <h1 data-sirco className="font-bold leading-[0.88] tracking-[-0.04em] whitespace-nowrap"
          style={{ fontSize: 'clamp(72px, 24vw, 260px)', WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', color: 'transparent' }}>
          SIRCO
        </h1>
        <p data-tagline className="text-[12px] tracking-[0.18em] uppercase text-white/60 font-light" style={{ marginTop: '20px' }}>
          Jakarta · Est. 2026
        </p>
      </div>

      {/* BOTTOM RIGHT — jam realtime outline + project count */}
      <div className="absolute bottom-8 right-8 z-[510] flex flex-col items-end gap-3">
        <span
          data-clock
          className="font-bold leading-none tracking-[-0.04em] tabular-nums whitespace-nowrap"
          style={{
            fontSize: 'clamp(48px, 16vw, 180px)',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.7)',
            color: 'transparent',
          }}
        />
        <span data-count className="text-[11px] tracking-[0.22em] uppercase text-white/50 font-light">05 Projects</span>
      </div>

      {/* EXPAND OVERLAY */}
      <div data-expand-overlay className="fixed z-[500]"
        style={{ display: 'none', pointerEvents: 'none', overflow: 'hidden' }}>

        {/* CLOSE */}
        <button data-expand-close
          className="absolute top-8 left-8 z-[30] cursor-pointer bg-transparent border-none"
          style={{ fontSize: '16px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
          CLOSE ✕
        </button>

        {/* SCROLL HINT — atas seam, diperbesar */}
        <div style={{
          position: 'absolute', top: '18%', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '12px', pointerEvents: 'none',
        }}>
          <svg width="36" height="58" viewBox="0 0 36 58" fill="none">
            <rect x="1" y="1" width="34" height="56" rx="17" stroke="#111" strokeWidth="1.5" />
            <circle data-scroll-wheel-dot cx="18" cy="16" r="4" fill="#111" />
          </svg>
          <span style={{ fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#111', fontWeight: 300 }}>
            Scroll
          </span>
        </div>

        {/* DOTS progress */}
        <div style={{
          position: 'absolute', left: '25%', bottom: '40px',
          transform: 'translateX(-50%)', zIndex: 30,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}>
          {cities.map((_, i) => (
            <div key={i} data-scroll-dot style={{
              width: '4px', height: '4px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)', opacity: i === 0 ? 1 : 0.25,
            }} />
          ))}
        </div>

        {/* LAYER CONTAINER */}
        <div data-layer-container style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} />

      </div>

      {/* COOKIE CONSENT — glass */}
      <div
        id="cookie-banner"
        className="fixed bottom-0 left-0 right-0 z-[600]"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '0.5px solid rgba(255,255,255,0.15)',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          transform: 'translateY(100%)',
          opacity: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', flex: 1 }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
            Cookies
          </span>
          <p style={{ fontSize: '11px', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '480px', margin: 0 }}>
            We use cookies to enhance your experience and analyse site performance.
            By continuing, you agree to our{' '}
            <a href="/privacy" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
              privacy policy
            </a>.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <button
            id="btn-decline"
            style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Decline
          </button>
          <div style={{ width: '0.5px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />
          <button
            id="btn-accept"
            style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', background: 'none', border: '0.5px solid rgba(255,255,255,0.3)', cursor: 'pointer', padding: '10px 20px', fontFamily: 'inherit' }}
          >
            Accept
          </button>
        </div>
      </div>

    </section>
  )
}