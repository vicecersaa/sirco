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
      wrapper.style.cssText =
        'display:inline-block; overflow:hidden; vertical-align:bottom; line-height:1'
      char.style.display = 'inline-block'
      char.parentNode?.insertBefore(wrapper, char)
      wrapper.appendChild(char)
    })

    // =========================================================
    // HERO INTRO
    // =========================================================

    const tl = gsap.timeline({ delay: 0.8 })

    const imageCells = Array.from(
      document.querySelectorAll('[data-cell-top], [data-cell-bottom]'),
    )

    const centerFirst = [
      imageCells[1],
      imageCells[0],
      imageCells[2],
      imageCells[3],
      imageCells[4],
    ]

    centerFirst.forEach((cell) => {
      gsap.set(cell, {
        yPercent: cell.hasAttribute('data-cell-top') ? -100 : 100,
      })
    })

    tl.to(centerFirst, {
      yPercent: 0,
      duration: 1.4,
      ease: 'expo.inOut',
      stagger: 0.22,
    })

      .from(
        '[data-label]',
        {
          opacity: 0,
          y: -8,
          duration: 0.7,
          ease: 'power3.out',
        },
        '-=0.4',
      )
      .fromTo(
        '[data-nav]',
        { opacity: 0, y: -16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
        },
        '-=0.5',
      )
      .from(
        split.chars,
        {
          yPercent: 110,
          skewX: -12,
          opacity: 0,
          duration: 1.8,
          ease: 'expo.out',
          stagger: 0.08,
        },
        '-=0.3',
      )
      .to(
        split.chars,
        {
          skewX: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.04,
        },
        '-=1.2',
      )
      .from(
        '[data-tagline]',
        {
          opacity: 0,
          y: 10,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.6',
      )
      .from(
        '[data-count]',
        {
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.5',
      )
      .from(
        '[data-clock]',
        {
          yPercent: 110,
          skewX: -8,
          opacity: 0,
          duration: 1.8,
          ease: 'expo.out',
        },
        '-=1.4',
      )

    // =========================================================
    // SCROLL HINT DOT
    // =========================================================

    gsap.fromTo(
      '[data-scroll-wheel-dot]',
      { y: 0, opacity: 1 },
      { y: 12, opacity: 0, duration: 1.1, repeat: -1, ease: 'power1.in' },
    )

    // =========================================================
    // REALTIME CLOCK
    // =========================================================

    const clockEl = document.querySelector('[data-clock]') as HTMLElement

    const updateClock = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      if (clockEl) clockEl.textContent = `${hh} : ${mm} : ${ss}`
    }

    updateClock()
    const clockInterval = setInterval(updateClock, 1000)

    // =========================================================
    // CITY / EXPAND SYSTEM
    // =========================================================

    const navEls = document.querySelectorAll('[data-nav]')
    const focusOverlay = document.querySelector('[data-focus-overlay]') as HTMLElement
    const expandOverlay = document.querySelector('[data-expand-overlay]') as HTMLElement
    const expandClose = document.querySelector('[data-expand-close]') as HTMLElement
    const layerContainer = document.querySelector('[data-layer-container]') as HTMLElement

    let isExpanded = false
    let currentCityIndex = 0
    let layers: HTMLElement[] = []

    // =========================================================
    // UPDATE DOTS
    // =========================================================

    const updateDots = (index: number) => {
      document.querySelectorAll('[data-scroll-dot]').forEach((dot, i) => {
        gsap.to(dot, {
          opacity: i === index ? 1 : 0.25,
          scale: i === index ? 1.4 : 1,
          duration: 0.3,
        })
      })
    }

    // =========================================================
    // CREATE CITY LAYER — responsive grid
    // =========================================================

    const isMobile = () => window.innerWidth < 768
    const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024

    const createLayer = (index: number, startY = '100%') => {
      const city = cities[index]
      const layer = document.createElement('div')
      layer.dataset.layer = String(index)

      const mobile = isMobile()
      const tablet = isTablet()

      if (mobile) {
        layer.style.cssText = `
          position:absolute;
          inset:0;
          z-index:1;
          display:flex;
          flex-direction:column;
          will-change:transform;
        `
        layer.innerHTML = `
          <div style="position:relative;height:45%;overflow:hidden;flex-shrink:0;">
            <img src="${city.img}" alt="${city.name}"
              style="width:100%;height:100%;object-fit:cover;filter:brightness(0.7);display:block;" />
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent 60%);"></div>
            <span style="position:absolute;top:16px;left:16px;font-size:10px;letter-spacing:0.2em;color:#fff;opacity:0.7;">
              SIRCO / Project — 2026
            </span>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;
            padding:32px 28px;background:#f4f3ef;color:#111;box-sizing:border-box;overflow-y:auto;">
            <div data-layer-content>
              <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#666;margin:0 0 14px;">
                ${city.name.toUpperCase()}
              </p>
              <h2 style="font-size:clamp(52px,16vw,88px);line-height:0.88;font-weight:600;
                letter-spacing:-0.04em;color:#111;margin:0 0 24px;">
                ${city.name}
              </h2>
              <p style="font-size:14px;line-height:1.85;color:#444;margin:0 0 24px;">
                A bold residential commission that balances raw materiality with spatial precision.
                Conceived as a dialogue between landscape and enclosure, the project draws on local
                vernacular while reaching toward a quieter, more considered modernism.
              </p>
              <div style="height:0.5px;background:rgba(0,0,0,0.15);margin:20px 0;"></div>
              <p style="font-size:10px;line-height:2;letter-spacing:0.25em;text-transform:uppercase;color:#666;margin:0;">
                Architecture · Spatial Design
              </p>
            </div>
            <div style="margin-top:32px;">
              <div style="height:0.5px;background:rgba(0,0,0,0.15);margin-bottom:24px;"></div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
                <div>
                  <span style="display:block;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:8px;">Type</span>
                  <span style="font-size:14px;color:#111;">Residential</span>
                </div>
                <div>
                  <span style="display:block;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:8px;">Location</span>
                  <span style="font-size:14px;color:#111;">${city.name}</span>
                </div>
                <div>
                  <span style="display:block;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:8px;">Status</span>
                  <span style="font-size:14px;color:#111;">Completed</span>
                </div>
              </div>
            </div>
          </div>
        `
      } else if (tablet) {
        layer.style.cssText = `
          position:absolute;
          inset:0;
          z-index:1;
          display:grid;
          grid-template-columns:45% 55%;
          will-change:transform;
        `
        layer.innerHTML = `
          <div style="position:relative;overflow:hidden;height:100%;">
            <img src="${city.img}" alt="${city.name}"
              style="width:100%;height:100%;object-fit:cover;filter:brightness(0.7);display:block;" />
            <div style="position:absolute;inset:0;background:linear-gradient(to right,transparent,rgba(14,14,12,0.3));"></div>
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.2) 40%,transparent 70%);"></div>
          </div>
          <div style="position:relative;display:flex;flex-direction:column;justify-content:space-between;
            padding:32px 40px;background:#f4f3ef;color:#111;box-sizing:border-box;height:100%;overflow-y:auto;">
            <div style="display:flex;justify-content:space-between;">
              <span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#555;">SIRCO / Project</span>
              <span style="font-size:10px;color:#555;">2026</span>
            </div>
            <div data-layer-content>
              <p style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#666;margin:0 0 14px;">
                ${city.name.toUpperCase()}
              </p>
              <h2 style="font-size:clamp(48px,7vw,90px);line-height:0.88;font-weight:600;
                letter-spacing:-0.05em;color:#111;margin:0 0 24px;">
                ${city.name}
              </h2>
              <p style="font-size:13px;line-height:1.8;color:#444;max-width:360px;margin:0 0 20px;">
                A bold residential commission that balances raw materiality with spatial precision.
                Conceived as a dialogue between landscape and enclosure, the project draws on local
                vernacular while reaching toward a quieter, more considered modernism.
              </p>
              <div style="height:0.5px;background:rgba(0,0,0,0.15);margin:20px 0;"></div>
              <p style="font-size:10px;line-height:2;letter-spacing:0.22em;text-transform:uppercase;color:#666;margin:0;">
                Architecture · Spatial Design
              </p>
            </div>
            <div>
              <div style="height:0.5px;background:rgba(0,0,0,0.15);margin-bottom:22px;"></div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;">
                <div>
                  <span style="display:block;font-size:8px;letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:8px;">Type</span>
                  <span style="font-size:13px;color:#111;">Residential</span>
                </div>
                <div>
                  <span style="display:block;font-size:8px;letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:8px;">Location</span>
                  <span style="font-size:13px;color:#111;">${city.name}</span>
                </div>
                <div>
                  <span style="display:block;font-size:8px;letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:8px;">Status</span>
                  <span style="font-size:13px;color:#111;">Completed</span>
                </div>
              </div>
            </div>
          </div>
        `
      } else {
        // Desktop (1024px+) — original layout, fluid scaling for 2K/4K
        layer.style.cssText = `
          position:absolute;
          inset:0;
          z-index:1;
          display:grid;
          grid-template-columns:50% 50%;
          will-change:transform;
        `
        layer.innerHTML = `
          <div style="position:relative;overflow:hidden;height:100%;">
            <img src="${city.img}" alt="${city.name}"
              style="width:100%;height:100%;object-fit:cover;filter:brightness(0.7);display:block;" />
            <div style="position:absolute;inset:0;background:linear-gradient(to right,transparent,rgba(14,14,12,0.3));"></div>
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.2) 40%,transparent 70%);"></div>
          </div>
          <div style="position:relative;display:flex;flex-direction:column;justify-content:space-between;
            padding:clamp(32px,3.5vw,80px) clamp(40px,4.5vw,96px);background:#f4f3ef;color:#111;
            box-sizing:border-box;height:100%;">
            <div style="display:flex;justify-content:space-between;">
              <span style="font-size:clamp(10px,0.7vw,14px);letter-spacing:0.2em;text-transform:uppercase;color:#555;">SIRCO / Project</span>
              <span style="font-size:clamp(10px,0.7vw,14px);color:#555;">2026</span>
            </div>
            <div data-layer-content>
              <p style="font-size:clamp(10px,0.7vw,14px);letter-spacing:0.3em;text-transform:uppercase;color:#666;margin:0 0 clamp(12px,1.2vw,24px);">
                ${city.name.toUpperCase()}
              </p>
              <h2 style="font-size:clamp(64px,7vw,160px);line-height:0.88;font-weight:600;
                letter-spacing:-0.05em;color:#111;margin:0 0 clamp(20px,2vw,48px);">
                ${city.name}
              </h2>
              <p style="font-size:clamp(13px,0.85vw,18px);line-height:1.8;color:#444;max-width:clamp(320px,28vw,560px);margin:0 0 clamp(16px,1.5vw,32px);">
                A bold residential commission that balances raw materiality with spatial precision.
                Conceived as a dialogue between landscape and enclosure, the project draws on local
                vernacular while reaching toward a quieter, more considered modernism.
              </p>
              <div style="height:0.5px;background:rgba(0,0,0,0.15);margin:clamp(16px,1.5vw,32px) 0;"></div>
              <p style="font-size:clamp(10px,0.7vw,14px);line-height:2;letter-spacing:0.22em;text-transform:uppercase;color:#666;margin:0;">
                Architecture · Spatial Design
              </p>
            </div>
            <div>
              <div style="height:0.5px;background:rgba(0,0,0,0.15);margin-bottom:clamp(20px,2vw,40px);"></div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:clamp(20px,2.5vw,48px);">
                <div>
                  <span style="display:block;font-size:clamp(8px,0.55vw,12px);letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:clamp(6px,0.6vw,14px);">Type</span>
                  <span style="font-size:clamp(13px,0.9vw,18px);color:#111;">Residential</span>
                </div>
                <div>
                  <span style="display:block;font-size:clamp(8px,0.55vw,12px);letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:clamp(6px,0.6vw,14px);">Location</span>
                  <span style="font-size:clamp(13px,0.9vw,18px);color:#111;">${city.name}</span>
                </div>
                <div>
                  <span style="display:block;font-size:clamp(8px,0.55vw,12px);letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:clamp(6px,0.6vw,14px);">Status</span>
                  <span style="font-size:clamp(13px,0.9vw,18px);color:#111;">Completed</span>
                </div>
              </div>
            </div>
          </div>
        `
      }

      // IMPORTANT: GSAP is the only owner of the layer transform.
      // The old implementation also put translateY() in CSS, which
      // caused the CSS transform and GSAP yPercent to stack.
      gsap.set(layer, {
        yPercent: startY === '100%' ? 100 : 0,
        force3D: true,
      })

      return layer
    }

    // =========================================================
    // INIT EXPAND
    // =========================================================

    const initExpandLayer = (index: number) => {
      layerContainer.innerHTML = ''
      layers = []
      const layer = createLayer(index, '0%')
      layerContainer.appendChild(layer)
      layers.push(layer)
      const content = layer.querySelector('[data-layer-content]') as HTMLElement
      gsap.fromTo(content, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.7 })
    }

    const pushLayer = (index: number) => {
      const newLayer = createLayer(index, '100%')
      layerContainer.appendChild(newLayer)
      layers.push(newLayer)
      gsap.to(newLayer, { y: '0%', duration: 0.85, ease: 'expo.inOut' })
      updateDots(index)
    }

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

    // =========================================================
    // CITY NAV — desktop hover (skip on touch)
    // =========================================================

    const isTouch = () => window.matchMedia('(hover: none)').matches

    navEls.forEach((el, i) => {
      const card = document.querySelector(`[data-city-card="${i}"]`) as HTMLElement

      el.addEventListener('mouseenter', () => {
        if (isTouch() || !card) return
        gsap.to(focusOverlay, { opacity: 1, duration: 0.35, ease: 'power2.out' })
        gsap.killTweensOf(el)
        gsap.killTweensOf(card)
        gsap.set(el, { scale: 1, y: 0 })
        gsap.set(card, { opacity: 0, y: 8 })
        const rect = el.getBoundingClientRect()
        card.style.position = 'fixed'
        const cardWidth = card.offsetWidth
        const safeRight = Math.max(16, Math.min(40, window.innerWidth - cardWidth - 16))
        card.style.top = `${rect.bottom + 48}px`
        card.style.right = `${safeRight}px`
        card.style.left = 'auto'
        card.style.marginTop = '0'
        card.style.display = 'block'
        gsap.to(el, {
          scale: 3.5,
          y: -12,
          transformOrigin: 'right top',
          color: 'rgba(255,255,255,1)',
          duration: 0.3,
          ease: 'power3.out',
        })
        navEls.forEach((other, j) => {
          if (i === j) return
          gsap.to(other, { y: j > i ? 280 : 0, opacity: 1, duration: 0.35, ease: 'power3.out' })
        })
        gsap.to(card, { opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' })
      })

      el.addEventListener('mouseleave', () => {
        if (isTouch()) return
        gsap.to(focusOverlay, { opacity: 0, duration: 0.25, ease: 'power2.out' })
        gsap.killTweensOf(el)
        gsap.to(el, { scale: 1, y: 0, color: 'rgba(255,255,255,0.8)', duration: 0.3, ease: 'power3.out' })
        navEls.forEach((other, j) => {
          if (i === j) return
          gsap.to(other, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' })
        })
        if (card) {
          gsap.killTweensOf(card)
          gsap.to(card, {
            opacity: 0, y: 8, duration: 0.2, ease: 'power2.in',
            onComplete: () => { card.style.display = 'none' },
          })
        }
      })

      el.addEventListener('click', () => {
        if (isExpanded) return
        isExpanded = true
        currentCityIndex = i
        const cardRect = card ? card.getBoundingClientRect() : null

        if (cardRect && !isTouch()) {
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
            scale: 1,
          })
          initExpandLayer(i)
          gsap.to(expandOverlay, {
            width: '100vw', height: '100vh', top: 0, left: 0,
            borderRadius: 0, duration: 0.9, ease: 'expo.inOut',
          })
        } else {
          // On touch/mobile: fade in directly fullscreen
          gsap.set(expandOverlay, {
            display: 'block',
            width: '100vw', height: '100vh',
            top: 0, left: 0, right: 'auto', bottom: 'auto',
            borderRadius: 0, opacity: 0, scale: 1,
          })
          initExpandLayer(i)
          gsap.to(expandOverlay, { opacity: 1, duration: 0.5, ease: 'power2.out' })
        }

        gsap.fromTo(expandClose, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.8 })
        expandOverlay.style.pointerEvents = 'auto'
        updateDots(i)
      })
    })

    // =========================================================
    // CLOSE
    // =========================================================

    expandClose?.addEventListener('click', () => {
      gsap.to(expandOverlay, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(expandOverlay, { display: 'none', scale: 1 })
          expandOverlay.style.pointerEvents = 'none'
          isExpanded = false
        },
      })
    })

    // =========================================================
    // SCROLL — 2-step city transition
    //
    // 1 wheel gesture = +50%
    // 2 wheel gestures = next city
    //
    // The incoming layer is ALWAYS physically above the current layer.
    // Its position is controlled only by GSAP yPercent:
    //   100 = completely below viewport
    //    75 = 25% visible
    //    50 = 50% visible
    //    25 = 75% visible
    //     0 = fully visible
    // =========================================================

    const TICKS_NEEDED = 2
    const WHEEL_UNLOCK_DELAY = 240

    let progress = 0
    let peekEl: HTMLElement | null = null
    let peekIdx = -1
    let committing = false
    let wheelLocked = false
    let wheelUnlockTimer = 0

    const setPeekProgress = (p: number) => {
      if (!peekEl) return

      const currentLayer = layers[layers.length - 1]

      // Keep the V7 interaction: the incoming city is the main movement.
      // Add only a subtle depth shift to the current city so the transition
      // feels connected without making two full-screen panels fight each other.
      gsap.to(peekEl, {
        yPercent: 100 - p * 100,
        scale: 1.02 - p * 0.02,
        duration: 0.62,
        ease: 'power3.out',
        overwrite: true,
      })

      if (currentLayer && currentLayer !== peekEl) {
        gsap.to(currentLayer, {
          yPercent: -p * 10,
          scale: 1 - p * 0.02,
          opacity: 1 - p * 0.12,
          duration: 0.62,
          ease: 'power3.out',
          overwrite: true,
        })
      }
    }

    const ensurePeek = () => {
      const next = (currentCityIndex + 1) % cities.length

      if (peekEl && peekIdx === next && peekEl.isConnected) return

      if (peekEl) {
        gsap.killTweensOf(peekEl)
        peekEl.remove()
      }

      peekIdx = next
      peekEl = createLayer(next, '100%')

      // Put the new layer ABOVE the current layer.
      layerContainer.appendChild(peekEl)

      // Explicit initial position. No CSS transform is involved.
      gsap.set(peekEl, {
        yPercent: 100,
        scale: 1.02,
      })
    }

    const resetTransition = () => {
      progress = 0
      peekEl = null
      peekIdx = -1
    }

    const commit = () => {
      if (!peekEl || committing) return

      committing = true

      const target = peekEl
      const targetIndex = peekIdx

      // Finish the last 25% smoothly from the layer's current position.
      gsap.to(target, {
        yPercent: 0,
        scale: 1,
        duration: 0.65,
        ease: 'power3.inOut',
        overwrite: true,
        onComplete: () => {
          // Target is now the only layer.
          layerContainer.querySelectorAll<HTMLElement>('[data-layer]').forEach((layer) => {
            if (layer !== target) {
              gsap.killTweensOf(layer)
              layer.remove()
            }
          })

          layers = [target]
          currentCityIndex = targetIndex

          const content = target.querySelector('[data-layer-content]') as HTMLElement | null

          if (content) {
            gsap.fromTo(
              content,
              { y: 28, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.65,
                ease: 'power3.out',
              },
            )
          }

          updateDots(currentCityIndex)

          resetTransition()
          committing = false
        },
      })
    }

    const onTick = () => {
      if (!isExpanded || committing) return

      ensurePeek()

      progress = Math.min(1, progress + 1 / TICKS_NEEDED)

      // This is the visible 25% / 50% / 75% / 100% movement.
      setPeekProgress(progress)

      if (progress >= 1) {
        commit()
      }
    }

    // =========================================================
    // WHEEL — ONE COMPLETE TRACKPAD SWIPE = ONE STEP
    //
    // IMPORTANT:
    // We DO NOT react to the first wheel event.
    //
    // Trackpads emit a stream of wheel events + momentum events for one
    // physical swipe. If we react immediately, one long swipe can trigger
    // multiple steps.
    //
    // Instead:
    //   1. collect the direction of the whole wheel stream
    //   2. wait until the stream is quiet
    //   3. apply EXACTLY ONE 50% step
    //
    // Therefore:
    //   one long swipe down = +50%
    //   another separate swipe down = +50% -> commit
    //
    // Same thing in reverse for scrolling up.
    // =========================================================

    const WHEEL_END_DELAY = 280
    let wheelEndTimer = 0
    let wheelDirection = 0

    const applyWheelGesture = () => {
      const direction = wheelDirection

      wheelDirection = 0

      if (!isExpanded || committing || direction === 0) return

      if (direction > 0) {
        // One complete downward swipe = one 33.33% step.
        onTick()
        return
      }

      // One complete upward swipe = one 33.33% reverse step.
      if (!peekEl) return

      progress = Math.max(
        0,
        progress - 1 / TICKS_NEEDED,
      )

      setPeekProgress(progress)

      if (progress <= 0) {
        gsap.killTweensOf(peekEl)
        peekEl.remove()
        peekEl = null
        peekIdx = -1
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (!isExpanded) return

      e.preventDefault()

      if (committing) return
      if (Math.abs(e.deltaY) < 1) return

      // Record ONLY the direction. Magnitude is intentionally ignored.
      // A huge trackpad delta cannot become multiple steps.
      if (wheelDirection === 0) {
        wheelDirection = e.deltaY > 0 ? 1 : -1
      }

      // If direction changes inside the same physical gesture, keep the
      // dominant/current gesture direction rather than counting another step.
      if (e.deltaY > 0 && wheelDirection < 0) {
        wheelDirection = 1
      } else if (e.deltaY < 0 && wheelDirection > 0) {
        wheelDirection = -1
      }

      // Momentum keeps producing wheel events, so every event extends the
      // same gesture window. Only after the stream is quiet do we count it.
      window.clearTimeout(wheelEndTimer)

      wheelEndTimer = window.setTimeout(
        applyWheelGesture,
        WHEEL_END_DELAY,
      )
    }

    expandOverlay.addEventListener('wheel', handleWheel, { passive: false })

    // =========================================================
    // TOUCH
    // One upward swipe = one 25% step.
    // =========================================================

    let touchStartY = 0
    let touchActive = false

    const handleTouchStart = (e: TouchEvent) => {
      if (!isExpanded || committing) return

      touchActive = true
      touchStartY = e.touches[0]?.clientY ?? 0
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchActive || !isExpanded || committing) return

      touchActive = false

      const endY = e.changedTouches[0]?.clientY ?? touchStartY
      const diff = touchStartY - endY

      if (diff > 40) {
        onTick()
      }
    }

    expandOverlay.addEventListener('touchstart', handleTouchStart, { passive: true })
    expandOverlay.addEventListener('touchend', handleTouchEnd, { passive: true })

    // =========================================================
    // HOVER IMAGE GRID
    // =========================================================

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

    // =========================================================
    // HOVER SIRCO CHARACTERS
    // =========================================================

    split.chars?.forEach((char) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, { y: -12, WebkitTextStroke: '1.5px rgba(255,255,255,1)', duration: 0.3, ease: 'power3.out' })
      })
      char.addEventListener('mouseleave', () => {
        gsap.to(char, { y: 0, WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', duration: 0.5, ease: 'elastic.out(1, 0.5)' })
      })
    })

    // =========================================================
    // COOKIE CONSENT
    // =========================================================

    const cookieBanner = document.querySelector('#cookie-banner') as HTMLElement | null
    const acceptBtn = document.querySelector('#btn-accept') as HTMLButtonElement | null
    const declineBtn = document.querySelector('#btn-decline') as HTMLButtonElement | null
    const cookieChoice = localStorage.getItem('sirco-cookie-consent')

    if (cookieBanner && !cookieChoice) {
      gsap.set(cookieBanner, { opacity: 0, y: -10, scale: 0.97 })
      gsap.to(cookieBanner, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 1.8, ease: 'power3.out',
        onStart: () => { cookieBanner.style.pointerEvents = 'auto' },
      })
    }

    const closeCookie = () => {
      if (!cookieBanner) return
      gsap.killTweensOf(cookieBanner)
      gsap.to(cookieBanner, {
        opacity: 0, y: -14, scale: 0.97, duration: 0.5, ease: 'power3.inOut',
        onComplete: () => {
          cookieBanner.style.pointerEvents = 'none'
          cookieBanner.style.display = 'none'
        },
      })
      localStorage.setItem('sirco-cookie-consent', 'true')
    }

    acceptBtn?.addEventListener('click', closeCookie)
    declineBtn?.addEventListener('click', closeCookie)

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {
      tl.kill()
      split.revert()
      clearInterval(clockInterval)

      expandOverlay.removeEventListener('wheel', handleWheel)
      expandOverlay.removeEventListener('touchstart', handleTouchStart)
      expandOverlay.removeEventListener('touchend', handleTouchEnd)
      wheelDirection = 0
      window.clearTimeout(wheelEndTimer)

      if (peekEl) {
        gsap.killTweensOf(peekEl)
        peekEl.remove()
      }

      gsap.killTweensOf('[data-scroll-wheel-dot]')
      gsap.killTweensOf(cookieBanner)
      acceptBtn?.removeEventListener('click', closeCookie)
      declineBtn?.removeEventListener('click', closeCookie)
    }
  }, [])

  return (
    <section
      ref={container}
      className="relative w-full h-screen bg-[#0e0e0c] overflow-hidden font-sans"
    >
      {/* =====================================================
          IMAGE GRID
      ===================================================== */}

      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-[2px] overflow-hidden">
        {[1, 2, 3, 4, 5].map((n) => {
          const isTop = n <= 3
          return (
            <div
              key={n}
              {...(isTop ? { 'data-cell-top': '' } : { 'data-cell-bottom': '' })}
              className={`relative overflow-hidden ${
                n === 2 ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'
              }`}
            >
              <img
                src={`/images/project-${n}.jpg`}
                alt={`Project ${n}`}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover brightness-90"
              />
            </div>
          )
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0c] via-[#0e0e0c]/40 to-transparent z-10 pointer-events-none" />
      </div>



      {/* =====================================================
          TOP LABEL
      ===================================================== */}

      <div
        data-label
        className="absolute z-20"
        style={{
          top: 'clamp(16px, 2.5vw, 40px)',
          left: 'clamp(16px, 2.5vw, 40px)',
        }}
      >
        <span className="text-[clamp(9px,0.7vw,13px)] tracking-[0.3em] uppercase text-white/80 font-light">
          Architecture & Spatial Design
        </span>
      </div>

      {/* =====================================================
          CITY NAVIGATION — desktop: right sidebar | mobile: bottom row
      ===================================================== */}

      {/* Nav — vertical right, desktop + mobile */}
      <nav
        className="absolute z-[25] flex flex-col items-end"
        style={{
          right: 0,
          top: '20%',
          transform: 'translateY(-50%)',
        }}
      >


        {/* Vertical line — height of nav group only */}
        <div style={{
          position: 'absolute',
          right: 'clamp(12px, 2vw, 28px)',
          top: 0,
          bottom: 0,
          width: '0.5px',
          background: 'rgba(255,255,255,0.5)',
          pointerEvents: 'none',
        }} />

        <div className="flex flex-col items-end" style={{ gap: 'clamp(14px, 2.2vw, 28px)', paddingRight: 'clamp(20px, 2.5vw, 44px)' }}>
          {cities.map((city) => (
            <div
              key={city.name}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              {/* Dot — hidden by default, shown on hover via GSAP */}
              <span
                data-nav-dot
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  flexShrink: 0,
                  opacity: 0,
                  display: 'inline-block',
                }}
              />
              <span
                data-nav
                className="tracking-[0.28em] uppercase cursor-pointer inline-block origin-right font-light"
                style={{
                  fontSize: 'clamp(11px, 1vw, 15px)',
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 1px 2px rgba(0,0,0,1), 0 3px 8px rgba(0,0,0,0.95)',
                  letterSpacing: '0.3em',
                }}
              >
                {city.name}
              </span>
            </div>
          ))}
        </div>
      </nav>

      {/* =====================================================
          FOCUS OVERLAY
      ===================================================== */}

      <div
        data-focus-overlay
        className="absolute inset-0 z-[15] pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.45)', opacity: 0 }}
      />

      {/* =====================================================
          CITY CARDS — hidden on mobile (touch opens expand directly)
      ===================================================== */}

      <div className="hidden sm:block">
        {cities.map((city, i) => (
          <div
            key={`card-${i}`}
            data-city-card={i}
            style={{
              display: 'none',
              position: 'fixed',
              width: 'min(clamp(280px, 24vw, 480px), calc(100vw - 60px))',
              height: 'clamp(140px, 13vw, 240px)',
              boxSizing: 'border-box',
              background: '#f4f3ef',
              color: '#111',
              padding: '8px',
              zIndex: 200,
              pointerEvents: 'none',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.16)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '38% 1fr',
                height: '100%',
              }}
            >
              <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: '#ddd' }}>
                <img
                  src={city.img}
                  alt={city.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.18), transparent 40%, rgba(0,0,0,0.28))' }} />
                <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '8px', lineHeight: 1, letterSpacing: '0.16em', color: '#fff', fontWeight: 500 }}>
                  0{i + 1}
                </span>
              </div>

              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '3px 12px 4px 18px', overflow: 'hidden', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '9px', borderBottom: '1px solid rgba(0,0,0,0.15)' }}>
                  <span style={{ fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555' }}>SIRCO / PROJECT</span>
                  <span style={{ fontSize: '8px', letterSpacing: '0.12em', color: '#555' }}>2026</span>
                </div>

                <div style={{ marginTop: '18px', minWidth: 0 }}>
                  <h2 style={{ margin: 0, fontSize: 'clamp(18px, 2vw, 36px)', lineHeight: 0.9, fontWeight: 500, letterSpacing: '-0.055em', color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                    {city.name}
                  </h2>
                  <p style={{ margin: '9px 0 0', fontSize: '8px', lineHeight: 1.4, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#666' }}>
                    Architecture<br />Spatial Design
                  </p>
                </div>

                <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px', borderTop: '1px solid rgba(0,0,0,0.15)', paddingTop: '10px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '7px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>Type</span>
                    <span style={{ fontSize: '10px', color: '#111' }}>Residential</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '7px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>Location</span>
                    <span style={{ fontSize: '10px', color: '#111' }}>{city.name}</span>
                  </div>
                </div>

                <div style={{ position: 'absolute', right: '12px', bottom: '10px', width: '18px', height: '18px', border: '1px solid rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#111' }}>
                  ↗
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          SIRCO
      ===================================================== */}

      <div
        className="absolute z-[510]"
        style={{
          bottom: 'clamp(16px, 2vw, 32px)',
          left: 'clamp(16px, 2.5vw, 32px)',
        }}
      >
        <h1
          data-sirco
          className="font-bold leading-[0.88] tracking-[-0.04em] whitespace-nowrap"
          style={{
            fontSize: 'clamp(48px, 15vw, 260px)',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.7)',
            color: 'transparent',
          }}
        >
          SIRCO
        </h1>

        <p
          data-tagline
          className="uppercase text-white/60 font-light"
          style={{
            fontSize: 'clamp(9px, 0.7vw, 13px)',
            letterSpacing: '0.18em',
            marginTop: 'clamp(8px, 1vw, 20px)',
          }}
        >
          Jakarta · Est. 2026
        </p>
      </div>

      {/* =====================================================
          CLOCK + PROJECT COUNT
          Hidden on very small screens (≤ 360px wide) to avoid overlap
      ===================================================== */}

      <div
        className="absolute z-[300] flex flex-col items-end gap-2"
        style={{
          bottom: 'clamp(16px, 2vw, 32px)',
          right: 'clamp(16px, 2.5vw, 32px)',
        }}
      >
        <span
          data-clock
          className="font-bold leading-none tracking-[-0.04em] tabular-nums whitespace-nowrap"
          style={{
            fontSize: 'clamp(24px, 7vw, 110px)',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.7)',
            color: 'transparent',
          }}
        />

        <span
          data-count
          className="uppercase text-white/50 font-light"
          style={{
            fontSize: 'clamp(8px, 0.65vw, 12px)',
            letterSpacing: '0.22em',
          }}
        >
          05 Projects
        </span>
      </div>

      {/* =====================================================
          EXPAND OVERLAY
      ===================================================== */}

      <div
        data-expand-overlay
        className="fixed z-[500]"
        style={{ display: 'none', pointerEvents: 'none', overflow: 'hidden', background: '#0e0e0c' }}
      >
        {/* CLOSE
            Desktop (md+): kiri atas
            Mobile (< md): kanan atas
        */}
        <button
          data-expand-close
          className="
            absolute z-[600] cursor-pointer bg-transparent border-none
            right-[clamp(16px,2.5vw,32px)] left-auto
            md:left-[clamp(16px,2.5vw,32px)] md:right-auto
          "
          style={{
            top: 'clamp(16px, 2vw, 32px)',
            fontSize: 'clamp(12px, 0.85vw, 16px)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
            padding: '8px',
            pointerEvents: 'auto',
          }}
        >
          CLOSE ✕
        </button>

        {/* SCROLL / SWIPE HINT — icon item krn background panel kanan putih */}
        <div
          style={{
            position: 'absolute',
            top: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            pointerEvents: 'none',
          }}
        >
          <svg width="36" height="58" viewBox="0 0 36 58" fill="none">
            <rect x="1" y="1" width="34" height="56" rx="17" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
            <circle data-scroll-wheel-dot cx="18" cy="16" r="4" fill="rgba(0,0,0,0.5)" />
          </svg>
          <span style={{ fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontWeight: 300 }}>
            Scroll
          </span>
        </div>

        {/* LAYER CONTAINER */}
        <div
          data-layer-container
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            isolation: 'isolate',
          }}
        />
      </div>

      {/* =====================================================
          COOKIE CONSENT
      ===================================================== */}

      <div
        id="cookie-banner"
        className="fixed z-[600]"
        style={{
          top: 'clamp(56px, 6vw, 80px)',
          left: 'clamp(12px, 2vw, 32px)',
          width: 'clamp(280px, 85vw, 380px)',
          boxSizing: 'border-box',
          background: 'rgba(12, 12, 12, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(255,255,255,0.18)',
          padding: 'clamp(14px, 1.5vw, 24px)',
          opacity: 0,
          transform: 'translateY(-10px) scale(0.97)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', marginBottom: '14px', borderBottom: '0.5px solid rgba(255,255,255,0.14)' }}>
          <span style={{ fontSize: '8px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Cookies</span>
          <span style={{ fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)' }}>SIRCO / 01</span>
        </div>

        <p style={{ margin: 0, fontSize: 'clamp(9px, 0.75vw, 11px)', lineHeight: 1.7, letterSpacing: '0.025em', color: 'rgba(255,255,255,0.65)' }}>
          We use cookies to enhance your experience and analyse site performance. By continuing, you agree to our{' '}
          <a href="/privacy" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            privacy policy
          </a>.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', marginTop: '18px' }}>
          <button
            id="btn-decline"
            style={{ fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '8px 4px' }}
          >
            Decline
          </button>
          <button
            id="btn-accept"
            style={{ fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.3)', cursor: 'pointer', padding: '9px 16px', fontFamily: 'inherit', transition: 'background 0.25s ease, border-color 0.25s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.14)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </section>
  )
}