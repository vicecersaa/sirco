'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

const cities = [
  { name: 'Jakarta', img: '/images/jakarta.jpg' },
  { name: 'New York', img: '/images/newyork.jpg' },
  { name: 'Manchester', img: '/images/manchester.jpg' },
  { name: 'Tokyo', img: '/images/tokyo.jpg' },
]

const milestones = [
  {
    year: '2005',
    title: 'A first idea\nfinds a name',
    label: 'ORIGIN',
    description:
      'Before there was a studio, there was a fascination with proportion, atmosphere, and the quiet power of a well-made space.',
  },
  {
    year: '2006',
    title: 'Learning to see\nwhat others miss',
    label: 'OBSERVATION',
    description:
      'The work begins with looking closer — at streets, thresholds, shadows, materials, and the way people move through a room.',
  },
  {
    year: '2007',
    title: 'The first lines\nbecome a language',
    label: 'FIRST MARKS',
    description:
      'Early drawings are rough, instinctive, and full of questions. They become the first vocabulary of a future practice.',
  },
  {
    year: '2008',
    title: 'Small experiments\nbegin to matter',
    label: 'EXPERIMENT',
    description:
      'Scale, texture, and light become tools for testing an idea before it ever needs to become a finished thing.',
  },
  {
    year: '2009',
    title: 'A sense of space\nstarts to emerge',
    label: 'DISCOVERY',
    description:
      'The focus shifts from objects to experience: how a space feels before anyone notices why it works.',
  },
  {
    year: '2010',
    title: 'Ideas become\nthings worth keeping',
    label: 'DIRECTION',
    description:
      'The strongest ideas survive revision. The practice starts choosing restraint over noise and clarity over excess.',
  },
  {
    year: '2011',
    title: 'Form follows\na quieter instinct',
    label: 'FORM',
    description:
      'Architecture becomes less about making an impression and more about creating a lasting relationship between light, mass, and movement.',
  },
  {
    year: '2012',
    title: 'The work becomes\nmore deliberate',
    label: 'INTENTION',
    description:
      'Every line starts carrying a reason. Details become quieter, but the thinking behind them becomes sharper.',
  },
  {
    year: '2013',
    title: 'Lines, light, and\nmaterial begin to meet',
    label: 'MATERIAL',
    description:
      'Materiality moves to the foreground — stone, concrete, timber, glass, and the spaces between them.',
  },
  {
    year: '2014',
    title: 'A studio takes\nshape around the work',
    label: 'FOUNDATION',
    description:
      'A clearer point of view emerges, built around patience, precision, and an insistence on making things properly.',
  },
  {
    year: '2015',
    title: 'The details\nstart speaking louder',
    label: 'CRAFT',
    description:
      'The smallest decisions begin to define the whole: an edge, a joint, a shadow line, a handle, a threshold.',
  },
  {
    year: '2016',
    title: 'Less noise.\nMore clarity.',
    label: 'REFINEMENT',
    description:
      'The practice learns that sophistication rarely needs to announce itself. Reduction becomes a form of confidence.',
  },
  {
    year: '2017',
    title: 'A new chapter\nopens outward',
    label: 'EXPANSION',
    description:
      'New conversations bring new scales and new places, while the original principles remain intact.',
  },
  {
    year: '2018',
    title: 'Different places,\none point of view',
    label: 'PERSPECTIVE',
    description:
      'The work starts crossing borders. Each location changes the response, but never the underlying discipline.',
  },
  {
    year: '2019',
    title: 'A quiet idea\nbegins to take shape',
    label: 'ORIGIN II',
    description:
      'Years of accumulated thinking begin to converge into a more defined vision for what the studio could become.',
  },
  {
    year: '2020',
    title: 'The first sketches\nfind their language',
    label: 'FOUNDATION',
    description:
      'A new identity is tested on paper — not as a logo, but as a way of thinking about space and experience.',
  },
  {
    year: '2021',
    title: 'First sketch\non a napkin',
    label: 'FIRST MARK',
    description:
      'One simple drawing becomes a reference point: imperfect, immediate, and impossible to forget.',
  },
  {
    year: '2022',
    title: 'Spaces become\nstories',
    label: 'DIRECTION',
    description:
      'Projects begin to connect place, memory, material, and everyday rituals into something more personal.',
  },
  {
    year: '2023',
    title: 'Ground broken,\nJakarta',
    label: 'CONSTRUCTION',
    description:
      'The first major chapter moves from drawing to ground — a physical beginning for a vision that had lived on paper for years.',
  },
  {
    year: '2024',
    title: 'Material, light,\nand proportion',
    label: 'CRAFT',
    description:
      'The focus returns to the fundamentals: how light lands, how material ages, and how proportion makes a place feel inevitable.',
  },
  {
    year: '2025',
    title: 'The pieces\nstart to connect',
    label: 'EVOLUTION',
    description:
      'Projects, people, and places begin forming one continuous language — distinct in expression, consistent in intent.',
  },
  {
    year: '2026',
    title: 'Sirco is born',
    label: 'PRESENT',
    description:
      'The name becomes real. A studio takes its first official breath, carrying forward everything learned along the way.',
    active: true,
  },
]

const TARGET_W = 0.31

const TARGET_X = 0.03
const TARGET_Y = 0.13

function easeInOut(t: number) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// ─────────────────────────────────────────────────────────────
// Total items yang di-snap:
//   1 header  +  N milestones  +  1 end footer
// ─────────────────────────────────────────────────────────────
const SNAP_ITEM_COUNT = 1 + milestones.length + 1 // 24

export default function Hero() {
  const container = useRef<HTMLElement>(null)
  const heroInner = useRef<HTMLDivElement>(null)
  const timelineViewport = useRef<HTMLDivElement>(null)
  const timelineTrack = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const containerEl = container.current
    const heroEl = heroInner.current
    const viewportEl = timelineViewport.current
    const trackEl = timelineTrack.current

    if (!containerEl || !heroEl || !viewportEl || !trackEl) return

    // =========================================================
    // HERO INTRO
    // =========================================================

    const split = new SplitType('[data-sirco]', {
      types: 'chars',
    })

    split.chars?.forEach((char) => {
      const wrapper = document.createElement('span')
      wrapper.style.cssText =
        'display:inline-block; overflow:hidden; vertical-align:bottom; line-height:1; height:1em'
      char.style.display = 'inline-block'
      char.parentNode?.insertBefore(wrapper, char)
      wrapper.appendChild(char)
    })

    gsap.set(split.chars, {
      yPercent: 115,
      skewX: -10,
      opacity: 0,
      transformOrigin: '50% 100%',
      force3D: true,
    })

    const tl = gsap.timeline({ delay: 0.8 })

    const imageCells = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-cell-top], [data-cell-bottom]',
      ),
    )

    const centerFirst = [
      imageCells[1],
      imageCells[0],
      imageCells[2],
      imageCells[3],
      imageCells[4],
    ].filter(Boolean)

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
      .from('[data-label]', {
        opacity: 0,
        y: -8,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.4')
      .fromTo(
        '[data-nav]',
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 },
        '-=0.5',
      )
      .to(
        split.chars,
        {
          yPercent: 0,
          opacity: 1,
          skewX: 0,
          duration: 1.35,
          ease: 'expo.out',
          stagger: 0.09,
          force3D: true,
        },
        '+=0.18',
      )
      .from('[data-tagline]', {
        opacity: 0, y: 14, duration: 1, ease: 'power3.out',
      }, '-=0.6')
      .from('[data-count]', {
        opacity: 0, duration: 0.8, ease: 'power3.out',
      }, '-=0.5')
      .from('[data-clock]', {
        yPercent: 110, skewX: -8, opacity: 0, duration: 1.8, ease: 'expo.out',
      }, '-=1.4')

    // =========================================================
    // SCROLL HINT
    // =========================================================

    gsap.fromTo(
      '[data-scroll-wheel-dot]',
      { y: 0, opacity: 1 },
      { y: 12, opacity: 0, duration: 1.1, repeat: -1, ease: 'power1.in' },
    )

    // =========================================================
    // CLOCK
    // =========================================================

    const clockEl = document.querySelector<HTMLElement>('[data-clock]')

    const updateClock = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      if (clockEl) clockEl.textContent = `${hh} : ${mm} : ${ss}`
    }

    updateClock()
    const clockInterval = window.setInterval(updateClock, 1000)

    // =========================================================
    // TIMELINE — SNAP-TO-CENTER
    //
    // Setiap [data-timeline-item] di-pin ke tengah viewport
    // satu per satu sesuai scroll progress.
    // Track TIDAK bergerak; yang berubah adalah opacity/transform
    // tiap item secara individual.
    //
    // Layout tiap item: position:absolute, top:0, left:0, width:100%,
    // height:100vh, display:flex, align:center  →  konten selalu tengah.
    // =========================================================

    const SHRINK_VH = 320
    const TIMELINE_REVEAL_VH = 65
    // Setiap milestone butuh ~100vh scroll untuk "step" ke berikutnya
    const TIMELINE_SCROLL_VH = SNAP_ITEM_COUNT * 100

    const TOTAL_SCROLL_VH =
      SHRINK_VH + TIMELINE_REVEAL_VH + TIMELINE_SCROLL_VH

    const shrinkST = ScrollTrigger.create({
      trigger: containerEl,
      start: 'top top',
      end: `+=${TOTAL_SCROLL_VH}vh`,
      pin: true,
      pinSpacing: true,
      scrub: 0.3,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onUpdate(self) {
        const raw = self.progress

        // -------------------------------------------------------
        // SHRINK
        // -------------------------------------------------------

        const shrinkEnd = SHRINK_VH / TOTAL_SCROLL_VH
        const shrinkRaw = Math.min(raw / shrinkEnd, 1)
        const shrinkP = easeInOut(shrinkRaw)

        const vw = window.innerWidth
        const vh = window.innerHeight

        const TARGET_H_CALC = TARGET_W * (vw / vh) * 0.61
        const scaleX = 1 - (1 - TARGET_W) * shrinkP
        const scaleY = 1 - (1 - TARGET_H_CALC) * shrinkP
        const tx = TARGET_X * vw * shrinkP
        const ty = TARGET_Y * vh * shrinkP
        const br = 18 * shrinkP

        heroEl.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale3d(${scaleX}, ${scaleY}, 1)`
        heroEl.style.borderRadius = `${br}px`
        
       
        const isShrunken = shrinkP > 0.95
        heroEl.style.pointerEvents = isShrunken ? 'none' : 'auto'
        // -------------------------------------------------------
        // HARD GATE — timeline tidak muncul sebelum hero selesai
        // -------------------------------------------------------

        if (shrinkRaw < 1) {
          viewportEl.style.opacity = '0'
          return
        }

        // -------------------------------------------------------
        // TIMELINE REVEAL
        // -------------------------------------------------------

        const timelineStart = shrinkEnd
        const revealEnd =
          (SHRINK_VH + TIMELINE_REVEAL_VH) / TOTAL_SCROLL_VH

        const revealProgress = gsap.utils.clamp(
          0,
          1,
          (raw - timelineStart) / (revealEnd - timelineStart),
        )

        const revealEase = gsap.parseEase('power3.out')(revealProgress)
        viewportEl.style.opacity = String(revealEase)

        // -------------------------------------------------------
        // SNAP-TO-CENTER
        //
        // timelineProgress: 0 → 1 selama fase timeline scroll.
        // activeIndex: item mana yang aktif saat ini (0-based).
        // Tiap item punya posisi absolut sendiri di tengah layar.
        // Kita geser mereka relative terhadap item aktif.
        // -------------------------------------------------------

        const timelineProgress =
          revealProgress < 1
            ? 0
            : gsap.utils.clamp(
                0,
                1,
                (raw - revealEnd) / (1 - revealEnd),
              )

        // activeFloat: posisi "float" antar item (0 → SNAP_ITEM_COUNT-1)
        const activeFloat = timelineProgress * (SNAP_ITEM_COUNT - 1)
        const activeIndex = Math.round(activeFloat)
        console.log('activeFloat:', activeFloat, 'activeIndex:', activeIndex)
        // t: seberapa jauh kita sudah berpindah dari item sebelumnya ke berikutnya
        // 0 = pas di item, 0.5 = di tengah transisi, 1 = pas di item berikutnya
        const fromIndex = Math.floor(activeFloat)
        const toIndex   = Math.ceil(activeFloat)
        // frac: 0..1, seberapa dekat ke toIndex
        const frac = activeFloat - fromIndex

        // Easing untuk transisi antar item — cubic ease in-out
        const easeFrac = frac < 0.5
          ? 4 * frac * frac * frac
          : 1 - Math.pow(-2 * frac + 2, 3) / 2

        const items = trackEl.querySelectorAll<HTMLElement>(
          '[data-timeline-item]',
        )

        // Konstanta animasi
        const SLIDE_OUT_Y  = -80   // px, item lama naik keluar
        const SLIDE_IN_Y   =  90   // px, item baru naik masuk dari bawah
        const SLIDE_PEEK_Y =  40   // px, item berikutnya peek dari bawah
        const SCALE_OUT    = 0.94
        const SCALE_IN     = 1.0

       items.forEach((item: HTMLElement, index: number) => {
  const finalOpacity = index === activeIndex ? 1 : 0
  item.style.opacity = String(finalOpacity)
  item.style.transform = 'translate3d(0, 0, 0)'
  item.style.filter = 'none'
  item.style.textShadow = 'none'
  item.style.visibility = finalOpacity < 0.01 ? 'hidden' : 'visible'
})
      },
    })

    // =========================================================
    // CITY / EXPAND SYSTEM

    // =========================================================
    // CITY / EXPAND SYSTEM (tidak berubah dari kode asli)
    // =========================================================

    const navEls = document.querySelectorAll<HTMLElement>('[data-nav]')
    const focusOverlay = document.querySelector<HTMLElement>('[data-focus-overlay]')
    const expandOverlay = document.querySelector<HTMLElement>('[data-expand-overlay]')
    const expandClose = document.querySelector<HTMLElement>('[data-expand-close]')
    const layerContainer = document.querySelector<HTMLElement>('[data-layer-container]')
    const sircoContainer = document.querySelector<HTMLElement>('[data-sirco-container]')

    if (
      !focusOverlay ||
      !expandOverlay ||
      !expandClose ||
      !layerContainer ||
      !sircoContainer
    ) {
      return () => {
        tl.kill()
        split.revert()
        clearInterval(clockInterval)
        shrinkST.kill()
      }
    }

    let isExpanded = false
    let currentCityIndex = 0
    let previousBodyOverflow = ''
    let layers: HTMLElement[] = []

    const updateDots = (index: number) => {
      document
        .querySelectorAll<HTMLElement>('[data-scroll-dot]')
        .forEach((dot: HTMLElement, i: number) => {
          gsap.to(dot, {
            opacity: i === index ? 1 : 0.25,
            scale: i === index ? 1.4 : 1,
            duration: 0.3,
          })
        })
    }

    const isMobile = () => window.innerWidth < 768
    const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024

    // ── createLayer ──────────────────────────────────────────

    const createLayer = (index: number, startY = '100%') => {
      const city = cities[index]
      const layer = document.createElement('div')
      layer.dataset.layer = String(index)

      const mobile = isMobile()
      const tablet = isTablet()

      if (mobile) {
        layer.style.cssText = `
          position:absolute;inset:0;z-index:1;display:flex;
          flex-direction:column;height:100%;min-height:0;
          overflow:hidden;will-change:transform;
        `
        layer.innerHTML = `
          <div style="position:relative;height:38%;min-height:0;overflow:hidden;flex-shrink:0;">
            <img src="${city.img}" alt="${city.name}"
              style="width:100%;height:100%;object-fit:cover;filter:brightness(0.7);display:block;" />
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent 60%);"></div>
            <span style="position:absolute;top:14px;left:14px;font-size:9px;letter-spacing:0.2em;color:#fff;opacity:0.7;">
              SIRCO / Project — 2026
            </span>
          </div>
          <div style="flex:1 1 auto;min-height:0;display:flex;flex-direction:column;justify-content:space-between;padding:18px 22px 20px;background:#f4f3ef;color:#111;box-sizing:border-box;overflow:hidden;">
            <div data-layer-content>
              <p style="font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#666;margin:0 0 6px;">${city.name.toUpperCase()}</p>
              <h2 style="font-size:clamp(36px,12vw,60px);line-height:0.88;font-weight:600;letter-spacing:-0.04em;color:#111;margin:0 0 12px;">${city.name}</h2>
              <p style="font-size:11px;line-height:1.65;color:#444;margin:0 0 10px;">A bold residential commission that balances raw materiality with spatial precision.</p>
              <div style="height:0.5px;background:rgba(0,0,0,0.15);margin:10px 0;"></div>
              <p style="font-size:9px;line-height:2;letter-spacing:0.22em;text-transform:uppercase;color:#666;margin:0;">Architecture · Spatial Design</p>
            </div>
            <div style="margin-top:14px;">
              <div style="height:0.5px;background:rgba(0,0,0,0.15);margin-bottom:14px;"></div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
                <div><span style="display:block;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:#777;margin-bottom:5px;">Type</span><span style="font-size:12px;color:#111;">Residential</span></div>
                <div><span style="display:block;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:#777;margin-bottom:5px;">Location</span><span style="font-size:12px;color:#111;">${city.name}</span></div>
                <div><span style="display:block;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:#777;margin-bottom:5px;">Status</span><span style="font-size:12px;color:#111;">Completed</span></div>
              </div>
            </div>
          </div>
        `
      } else {
        layer.style.cssText = `
          position:absolute;inset:0;z-index:1;
          display:grid;grid-template-columns:${tablet ? '45% 55%' : '50% 50%'};
          will-change:transform;
        `
        layer.innerHTML = `
          <div style="position:relative;overflow:hidden;height:100%;">
            <img src="${city.img}" alt="${city.name}"
              style="width:100%;height:100%;object-fit:cover;filter:brightness(0.7);display:block;" />
            <div style="position:absolute;inset:0;background:linear-gradient(to right,transparent,rgba(14,14,12,0.3));"></div>
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.2) 40%,transparent 70%);"></div>
          </div>
          <div style="position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(32px,3.5vw,80px) clamp(40px,4.5vw,96px);background:#f4f3ef;color:#111;box-sizing:border-box;height:100%;">
            <div style="display:flex;justify-content:space-between;">
              <span style="font-size:clamp(10px,0.7vw,14px);letter-spacing:0.2em;text-transform:uppercase;color:#555;">SIRCO / Project</span>
              <span style="font-size:clamp(10px,0.7vw,14px);color:#555;">2026</span>
            </div>
            <div data-layer-content>
              <p style="font-size:clamp(10px,0.7vw,14px);letter-spacing:0.3em;text-transform:uppercase;color:#666;margin:0 0 clamp(12px,1.2vw,24px);">${city.name.toUpperCase()}</p>
              <h2 style="font-size:clamp(64px,7vw,160px);line-height:0.88;font-weight:600;letter-spacing:-0.05em;color:#111;margin:0 0 clamp(20px,2vw,48px);">${city.name}</h2>
              <p style="font-size:clamp(13px,0.85vw,18px);line-height:1.8;color:#444;max-width:clamp(320px,28vw,560px);margin:0 0 clamp(16px,1.5vw,32px);">A bold residential commission that balances raw materiality with spatial precision. Conceived as a dialogue between landscape and enclosure.</p>
              <div style="height:0.5px;background:rgba(0,0,0,0.15);margin:clamp(16px,1.5vw,32px) 0;"></div>
              <p style="font-size:clamp(10px,0.7vw,14px);line-height:2;letter-spacing:0.22em;text-transform:uppercase;color:#666;margin:0;">Architecture · Spatial Design</p>
            </div>
            <div>
              <div style="height:0.5px;background:rgba(0,0,0,0.15);margin-bottom:clamp(20px,2vw,40px);"></div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:clamp(20px,2.5vw,48px);">
                <div><span style="display:block;font-size:clamp(8px,0.55vw,12px);letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:clamp(6px,0.6vw,14px);">Type</span><span style="font-size:clamp(13px,0.9vw,18px);color:#111;">Residential</span></div>
                <div><span style="display:block;font-size:clamp(8px,0.55vw,12px);letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:clamp(6px,0.6vw,14px);">Location</span><span style="font-size:clamp(13px,0.9vw,18px);color:#111;">${city.name}</span></div>
                <div><span style="display:block;font-size:clamp(8px,0.55vw,12px);letter-spacing:0.22em;text-transform:uppercase;color:#777;margin-bottom:clamp(6px,0.6vw,14px);">Status</span><span style="font-size:clamp(13px,0.9vw,18px);color:#111;">Completed</span></div>
              </div>
            </div>
          </div>
        `
      }

      gsap.set(layer, {
        yPercent: startY === '100%' ? 100 : startY === '-100%' ? -100 : 0,
        force3D: true,
      })

      return layer
    }

    // ── initExpandLayer ───────────────────────────────────────

    const initExpandLayer = (index: number) => {
      layerContainer.innerHTML = ''
      layers = []
      const layer = createLayer(index, '0%')
      layerContainer.appendChild(layer)
      layers.push(layer)

      const content = layer.querySelector<HTMLElement>('[data-layer-content]')
      if (content) {
        gsap.fromTo(content, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.7 })
      }
    }

    // ── AUTO IMAGE GRID ───────────────────────────────────────

    const allCells = Array.from(
      document.querySelectorAll<HTMLElement>('[data-cell-top], [data-cell-bottom]'),
    ).sort(
      (a: HTMLElement, b: HTMLElement) =>
        Number(a.dataset.project || 0) - Number(b.dataset.project || 0),
    )

    let activeProject = 1
    let hoveredProject = 0
    let autoPlayTimer = 0
    let autoPlayPaused = false
    let allLit = false

    const IMAGE_DURATION = 2000
    const ALL_LIT_DURATION = 4500

    const setImageState = (project: number | 'all', duration = 0.8) => {
      allCells.forEach((cell: HTMLElement) => {
        const img = cell.querySelector<HTMLImageElement>('img')
        if (!img) return
        const isActive = project === 'all' || Number(cell.dataset.project) === project
        gsap.to(img, {
          scale: isActive ? 1.05 : 1,
          filter: isActive ? 'grayscale(0%) brightness(0.9)' : 'grayscale(100%) brightness(0.6)',
          duration,
          ease: 'power3.out',
          overwrite: true,
        })
      })
    }

    const showProject = (project: number) => {
      activeProject = project
      allLit = false
      setImageState(project)
    }

    const showAllProjects = () => {
      allLit = true
      setImageState('all', 1)
    }

    const startAutoPlay = () => {
      window.clearTimeout(autoPlayTimer)
      if (autoPlayPaused || hoveredProject !== 0) return
      const delay = allLit ? ALL_LIT_DURATION : IMAGE_DURATION
      autoPlayTimer = window.setTimeout(() => {
        if (autoPlayPaused || hoveredProject !== 0) return
        if (!allLit && activeProject < 5) { showProject(activeProject + 1); startAutoPlay(); return }
        if (!allLit) { showAllProjects(); startAutoPlay(); return }
        activeProject = 1; showProject(1); startAutoPlay()
      }, delay)
    }

    showProject(1)
    startAutoPlay()

    allCells.forEach((cell: HTMLElement) => {
      const project = Number(cell.dataset.project)
      cell.addEventListener('mouseenter', () => {
        hoveredProject = project
        autoPlayPaused = true
        window.clearTimeout(autoPlayTimer)
        showProject(project)
      })
      cell.addEventListener('mouseleave', () => {
        hoveredProject = 0
        autoPlayPaused = false
        activeProject = project
        allLit = false
        startAutoPlay()
      })
    })

    // ── CITY NAV ──────────────────────────────────────────────

    const isTouch = () => window.matchMedia('(hover: none)').matches

    navEls.forEach((el: HTMLElement, i: number) => {
      const card = document.querySelector<HTMLElement>(`[data-city-card="${i}"]`)

      el.addEventListener('mouseenter', () => {
  if (isTouch() || !card) return
  autoPlayPaused = true
  hoveredProject = 0
  window.clearTimeout(autoPlayTimer)
  showAllProjects()
  gsap.to(focusOverlay, { opacity: 1, duration: 0.35, ease: 'power2.out' })
  gsap.set(el, { scale: 1, y: 0, x: 0 })
  gsap.set(card, { opacity: 0, y: 8 })
  const rect = el.getBoundingClientRect()
  card.style.cssText += `;position:fixed;top:${rect.bottom + 40}px;right:${window.innerWidth - rect.right}px;left:auto;display:block;`
  gsap.to(el, { scale: 3.5, x: 110, y: -12, transformOrigin: 'right top', color: 'rgba(255,255,255,1)', duration: 0.3, ease: 'power3.out' })
  navEls.forEach((other: HTMLElement, j: number) => {
    if (i !== j) gsap.to(other, { y: j > i ? 280 : 0, opacity: 1, duration: 0.35, ease: 'power3.out' })
  })
  gsap.to(card, { opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' })
})

      el.addEventListener('mouseleave', () => {
        if (isTouch()) return
        autoPlayPaused = true
        window.clearTimeout(autoPlayTimer)
        showAllProjects()
        gsap.to(focusOverlay, { opacity: 0, duration: 0.25 })
        gsap.to(el, { scale: 1, x: 0, y: 0, color: 'rgba(255,255,255,0.8)', duration: 0.3, ease: 'power3.out', overwrite: true })
        navEls.forEach((other: HTMLElement, j: number) => {
  if (i !== j) gsap.to(other, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out', overwrite: true })
})
        if (card) gsap.to(card, { opacity: 0, y: 8, duration: 0.2, ease: 'power2.in', onComplete: () => { card.style.display = 'none' } })
      })

      el.addEventListener('click', () => {
        autoPlayPaused = true
        window.clearTimeout(autoPlayTimer)
        showAllProjects()
        if (isExpanded) return
        isExpanded = true
        currentCityIndex = i
        previousBodyOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        if (isMobile()) gsap.to(sircoContainer, { opacity: 0, duration: 0.3, ease: 'power2.out' })
        const cardRect = card?.getBoundingClientRect() ?? null
        if (cardRect && !isTouch()) {
          gsap.set(expandOverlay, { display: 'block', width: cardRect.width, height: cardRect.height, top: cardRect.top, left: cardRect.left, right: 'auto', bottom: 'auto', borderRadius: 2, opacity: 1, scale: 1 })
          initExpandLayer(i)
          gsap.to(expandOverlay, { width: '100vw', height: '100svh', top: 0, left: 0, borderRadius: 0, duration: 0.9, ease: 'expo.inOut' })
        } else {
          gsap.set(expandOverlay, { display: 'block', width: '100vw', height: '100svh', top: 0, left: 0, right: 'auto', bottom: 'auto', borderRadius: 0, opacity: 0, scale: 1 })
          initExpandLayer(i)
          gsap.to(expandOverlay, { opacity: 1, duration: 0.5, ease: 'power2.out' })
        }
        gsap.fromTo(expandClose, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.8 })
        expandOverlay.style.pointerEvents = 'auto'
        updateDots(i)
      })
    })

    // ── CITY SCROLL ───────────────────────────────────────────

    const mobileMode = window.matchMedia('(max-width: 767px)').matches
    const TICKS_NEEDED = mobileMode ? 1 : 2

    let progress = 0
    let peekEl: HTMLElement | null = null
    let peekIdx = -1
    let committing = false
    let wheelEndTimer = 0
    let wheelDirection = 0

    const setPeekProgress = (p: number, direction: 1 | -1) => {
      if (!peekEl) return
      const cur = layers[layers.length - 1]
      if (mobileMode) {
        gsap.to(peekEl, { yPercent: direction > 0 ? 100 - p * 100 : -100 + p * 100, duration: 0.58, ease: 'power2.out', overwrite: true })
        return
      }
      gsap.to(peekEl, { yPercent: direction > 0 ? 100 - p * 100 : -100 + p * 100, scale: 1.02 - p * 0.02, duration: 0.9, ease: 'power2.out', overwrite: true })
      if (cur && cur !== peekEl) gsap.to(cur, { yPercent: direction > 0 ? -p * 10 : p * 10, scale: 1 - p * 0.02, opacity: 1 - p * 0.12, duration: 0.9, ease: 'power2.out', overwrite: true })
    }

    const ensurePeek = (direction: 1 | -1) => {
      const targetIndex = direction > 0
        ? (currentCityIndex + 1) % cities.length
        : (currentCityIndex - 1 + cities.length) % cities.length
      if (peekEl && peekIdx === targetIndex && peekEl.isConnected) return
      if (peekEl) { gsap.killTweensOf(peekEl); peekEl.remove() }
      peekIdx = targetIndex
      peekEl = createLayer(targetIndex, direction > 0 ? '100%' : '-100%')
      layerContainer.appendChild(peekEl)
      gsap.set(peekEl, { yPercent: direction > 0 ? 100 : -100, scale: 1.02 })
    }

    const resetTransition = () => { progress = 0; peekEl = null; peekIdx = -1 }

    const commit = (direction: 1 | -1) => {
      if (!peekEl || committing) return
      committing = true
      const target = peekEl
      const targetIndex = peekIdx
      gsap.to(target, {
        yPercent: 0, scale: 1,
        duration: mobileMode ? 0.58 : 0.72,
        ease: mobileMode ? 'power3.out' : 'expo.inOut',
        overwrite: true,
        onComplete: () => {
          layerContainer.querySelectorAll<HTMLElement>('[data-layer]').forEach((layer: HTMLElement) => {
            if (layer !== target) { gsap.killTweensOf(layer); layer.remove() }
          })
          layers = [target]
          currentCityIndex = targetIndex
          const content = target.querySelector<HTMLElement>('[data-layer-content]')
          if (content) gsap.fromTo(content, { y: direction > 0 ? 28 : -28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' })
          updateDots(currentCityIndex)
          resetTransition()
          committing = false
        },
      })
    }

    const onTick = (direction: 1 | -1) => {
      if (!isExpanded || committing) return
      ensurePeek(direction)
      progress = Math.min(1, progress + 1 / TICKS_NEEDED)
      setPeekProgress(progress, direction)
      if (progress >= 1) commit(direction)
    }

    const cancelPeek = () => {
      if (!peekEl) return
      gsap.killTweensOf(peekEl)
      peekEl.remove()
      peekEl = null; peekIdx = -1; progress = 0
    }

    const applyWheelGesture = () => {
      const dir = wheelDirection
      wheelDirection = 0
      if (!isExpanded || committing || dir === 0) return
      onTick(dir > 0 ? 1 : -1)
    }

    const handleWheel = (e: WheelEvent) => {
      if (!isExpanded) return
      e.preventDefault()
      e.stopPropagation()
      if (committing || Math.abs(e.deltaY) < 1) return
      wheelDirection = e.deltaY > 0 ? 1 : -1
      window.clearTimeout(wheelEndTimer)
      wheelEndTimer = window.setTimeout(applyWheelGesture, 110)
    }

    expandOverlay.addEventListener('wheel', handleWheel, { passive: false })

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
      const delta = touchStartY - endY
      if (Math.abs(delta) < 40) return
      onTick(delta > 0 ? 1 : -1)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isExpanded) return
      e.preventDefault()
    }

    expandOverlay.addEventListener('touchstart', handleTouchStart, { passive: true })
    expandOverlay.addEventListener('touchend', handleTouchEnd, { passive: true })
    expandOverlay.addEventListener('touchmove', handleTouchMove, { passive: false })

    // ── CLOSE CITY ────────────────────────────────────────────

    const handleExpandClose = () => {
      if (!isExpanded) return
      window.clearTimeout(wheelEndTimer)
      wheelDirection = 0; committing = false
      cancelPeek()
      if (isMobile()) gsap.to(sircoContainer, { opacity: 1, duration: 0.4, delay: 0.3, ease: 'power2.out' })
      gsap.to(expandOverlay, {
        opacity: 0, scale: 0.95, duration: 0.5, ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(expandOverlay, { display: 'none', scale: 1 })
          expandOverlay.style.pointerEvents = 'none'
          layerContainer.innerHTML = ''
          layers = []
          isExpanded = false; progress = 0; peekEl = null; peekIdx = -1
          document.body.style.overflow = previousBodyOverflow
        },
      })
    }

    expandClose.addEventListener('click', handleExpandClose)

    // ── SIRCO HOVER ───────────────────────────────────────────

    split.chars?.forEach((char) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, { y: -12, WebkitTextStroke: '1.5px rgba(255,255,255,1)', duration: 0.3, ease: 'power3.out' })
      })
      char.addEventListener('mouseleave', () => {
        gsap.to(char, { y: 0, WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', duration: 0.5, ease: 'elastic.out(1,0.5)' })
      })
    })

    // ── COOKIE ────────────────────────────────────────────────

    const cookieBanner = document.querySelector<HTMLElement>('#cookie-banner')
    const acceptBtn = document.querySelector<HTMLButtonElement>('#btn-accept')
    const declineBtn = document.querySelector<HTMLButtonElement>('#btn-decline')

    if (cookieBanner && !localStorage.getItem('sirco-cookie-consent')) {
      gsap.set(cookieBanner, { opacity: 0, y: -10, scale: 0.97 })
      gsap.to(cookieBanner, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 1.8, ease: 'power3.out',
        onStart: () => { cookieBanner.style.pointerEvents = 'auto' },
      })
    }

    const closeCookie = () => {
      if (!cookieBanner) return
      gsap.to(cookieBanner, {
        opacity: 0, y: -14, scale: 0.97, duration: 0.5, ease: 'power3.inOut',
        onComplete: () => { cookieBanner.style.pointerEvents = 'none'; cookieBanner.style.display = 'none' },
      })
      localStorage.setItem('sirco-cookie-consent', 'true')
    }

    acceptBtn?.addEventListener('click', closeCookie)
    declineBtn?.addEventListener('click', closeCookie)

    // ── CLEANUP ───────────────────────────────────────────────

    return () => {
      tl.kill()
      split.revert()
      clearInterval(clockInterval)
      window.clearTimeout(autoPlayTimer)
      window.clearTimeout(wheelEndTimer)
      shrinkST.kill()
      expandOverlay.removeEventListener('wheel', handleWheel)
      expandOverlay.removeEventListener('touchstart', handleTouchStart)
      expandOverlay.removeEventListener('touchend', handleTouchEnd)
      expandOverlay.removeEventListener('touchmove', handleTouchMove)
      expandClose.removeEventListener('click', handleExpandClose)
      document.body.style.overflow = previousBodyOverflow
      if (peekEl) { gsap.killTweensOf(peekEl); peekEl.remove() }
      gsap.killTweensOf('[data-scroll-wheel-dot]')
      acceptBtn?.removeEventListener('click', closeCookie)
      declineBtn?.removeEventListener('click', closeCookie)
    }
  }, [])

  const leftGap = `${(TARGET_W + TARGET_X) * 100 + 2}vw`

  return (
    <>
      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        ref={container}
        className="relative w-full h-[100svh] md:h-screen bg-[#e8e6e0] overflow-hidden font-sans"
        style={{ isolation: 'isolate' }}
      >
        {/* HERO INNER */}
        <div
          ref={heroInner}
          className="absolute overflow-hidden"
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            background: '#0e0e0c',
            transformOrigin: 'top left',
            willChange: 'transform, border-radius',
          }}
        >
        
          {/* IMAGE GRID */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-[2px] overflow-hidden">
            {[1, 2, 3, 4, 5].map((n) => {
              const isTop = n <= 3
              return (
                <div
                  key={n}
                  data-project={n}
                  {...(isTop ? { 'data-cell-top': '' } : { 'data-cell-bottom': '' })}
                  className={`relative overflow-hidden ${n === 2 ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'}`}
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

          {/* TOP LABEL */}
          <div
            data-label
            className="absolute z-20"
            style={{ top: 'clamp(16px,2.5vw,40px)', left: 'clamp(16px,2.5vw,40px)' }}
          >
            <span className="text-[clamp(9px,0.7vw,13px)] tracking-[0.3em] uppercase text-white/80 font-light">
              Architecture & Spatial Design
            </span>
          </div>

          {/* CITY NAV */}
          <nav
            className="absolute z-[25] flex flex-col items-end"
            style={{ right: 0, top: '20%', transform: 'translateY(-50%)' }}
          >
            <div
              style={{
                position: 'absolute',
                right: 'clamp(12px,2vw,28px)',
                top: 0,
                bottom: 0,
                width: '0.5px',
                background: 'rgba(255,255,255,0.5)',
                pointerEvents: 'none',
              }}
            />
            <div
  className="flex flex-col items-end"
  style={{ gap: 'calc(clamp(14px,2.2vw,28px) * var(--hero-scale, 1))', paddingRight: 'calc(clamp(20px,2.5vw,44px) * var(--hero-scale, 1))' }}
>
              {cities.map((city) => (
                <div key={city.name} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    data-nav-dot
                    style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', flexShrink: 0, opacity: 0, display: 'inline-block' }}
                  />
                  <span
                    data-nav
                    className="tracking-[0.28em] uppercase cursor-pointer inline-block origin-right font-light"
                    style={{ fontSize: 'calc(clamp(11px,1vw,15px) * var(--hero-scale, 1))', color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 2px rgba(0,0,0,1), 0 3px 8px rgba(0,0,0,0.95)', letterSpacing: '0.3em', gap: 'clamp(14px,2.2vw,28px)', paddingRight: 'clamp(20px,2.5vw,44px)' }}
                  >
                    {city.name}
                  </span>
                </div>
              ))}
            </div>
          </nav>

          

          {/* FOCUS OVERLAY */}
          <div
            data-focus-overlay
            className="absolute inset-0 z-[15] pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.45)', opacity: 0 }}
          />

          {/* CITY CARDS */}
          <div className="hidden sm:block">
            {cities.map((city, i) => (
              <div
                key={`card-${i}`}
                data-city-card={i}
                style={{
                  display: 'none', position: 'fixed',
                  width: 'min(clamp(280px,24vw,480px),calc(100vw - 60px))',
                  height: 'clamp(140px,13vw,240px)',
                  boxSizing: 'border-box', background: '#f4f3ef', color: '#111',
                  padding: '8px', zIndex: 200, pointerEvents: 'none',
                  overflow: 'hidden', border: '1px solid rgba(0,0,0,0.16)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '38% 1fr', height: '100%' }}>
                  <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: '#ddd' }}>
                    <img src={city.img} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 8, letterSpacing: '0.16em', color: '#fff', fontWeight: 500 }}>0{i + 1}</span>
                  </div>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', padding: '3px 12px 4px 18px', overflow: 'hidden', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 9, borderBottom: '1px solid rgba(0,0,0,0.15)' }}>
                      <span style={{ fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555' }}>SIRCO / PROJECT</span>
                      <span style={{ fontSize: 8, color: '#555' }}>2026</span>
                    </div>
                    <div style={{ marginTop: 18, minWidth: 0 }}>
                      <h2 style={{ margin: 0, fontSize: 'clamp(18px,2vw,36px)', lineHeight: 0.9, fontWeight: 500, letterSpacing: '-0.055em', color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{city.name}</h2>
                      <p style={{ margin: '9px 0 0', fontSize: 8, lineHeight: 1.4, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#666' }}>Architecture<br />Spatial Design</p>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 20, borderTop: '1px solid rgba(0,0,0,0.15)', paddingTop: 10 }}>
                      <div>
                        <span style={{ display: 'block', fontSize: 7, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>Type</span>
                        <span style={{ fontSize: 10, color: '#111' }}>Residential</span>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: 7, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>Location</span>
                        <span style={{ fontSize: 10, color: '#111' }}>{city.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SIRCO */}
          <div
            data-sirco-container
            className="absolute block pointer-events-none"
            style={{ zIndex: 700, bottom: 'clamp(16px,2vw,32px)', left: 'clamp(16px,2.5vw,32px)', isolation: 'isolate' }}
          >
            <h1
              data-sirco
              className="font-bold leading-[0.88] tracking-[-0.04em] whitespace-nowrap"
              style={{ fontSize: 'clamp(48px,15vw,260px)', WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', color: 'transparent', position: 'relative', zIndex: 701 }}
            >
              SIRCO
            </h1>
            <p
              data-tagline
              className="uppercase text-white/60 font-light"
              style={{ fontSize: 'clamp(9px,0.7vw,13px)', letterSpacing: '0.18em', marginTop: 'clamp(8px,1vw,20px)', position: 'relative', zIndex: 701 }}
            >
              Jakarta · Est. 2026
            </p>
          </div>

          {/* CLOCK */}
          <div
            className="absolute z-[300] flex flex-col items-end gap-2"
            style={{ bottom: 'clamp(16px,2vw,32px)', right: 'clamp(16px,2.5vw,32px)' }}
          >
            <span
              data-clock
              className="font-bold leading-none tracking-[-0.04em] tabular-nums whitespace-nowrap"
              style={{ fontSize: 'clamp(24px,7vw,110px)', WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', color: 'transparent' }}
            />
            <span data-count className="uppercase text-white/50 font-light" style={{ fontSize: 'clamp(8px,0.65vw,12px)', letterSpacing: '0.22em' }}>
              05 Projects
            </span>
          </div>

          {/* EXPAND OVERLAY */}
          <div
            data-expand-overlay
            className="fixed"
            style={{ zIndex: 500, display: 'none', pointerEvents: 'none', overflow: 'hidden', overscrollBehavior: 'none', touchAction: 'none', background: '#0e0e0c' }}
          >
            <button
              data-expand-close
              className="absolute z-[600] cursor-pointer bg-transparent border-none right-[clamp(16px,2.5vw,32px)] left-auto md:left-[clamp(16px,2.5vw,32px)] md:right-auto"
              style={{ top: 'clamp(16px,2vw,32px)', fontSize: 'clamp(12px,0.85vw,16px)', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', padding: 8, pointerEvents: 'auto' }}
            >
              CLOSE ✕
            </button>
            <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, pointerEvents: 'none' }}>
              <svg width="36" height="58" viewBox="0 0 36 58" fill="none">
                <rect x="1" y="1" width="34" height="56" rx="17" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
                <circle data-scroll-wheel-dot cx="18" cy="16" r="4" fill="rgba(0,0,0,0.5)" />
              </svg>
              <span style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontWeight: 300 }}>Scroll</span>
            </div>
            <div data-layer-container style={{ position: 'absolute', inset: 0, overflow: 'hidden', isolation: 'isolate' }} />
          </div>
        </div>

        {/* COOKIE */}
        <div
          id="cookie-banner"
          className="fixed z-[600]"
          style={{
            top: 'clamp(56px,6vw,80px)', left: 'clamp(12px,2vw,32px)',
            width: 'clamp(280px,85vw,380px)', boxSizing: 'border-box',
            background: 'rgba(12,12,12,0.45)', backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)', border: '0.5px solid rgba(255,255,255,0.18)',
            padding: 'clamp(14px,1.5vw,24px)', opacity: 0, pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 14, borderBottom: '0.5px solid rgba(255,255,255,0.14)' }}>
            <span style={{ fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Cookies</span>
            <span style={{ fontSize: 8, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)' }}>SIRCO / 01</span>
          </div>
          <p style={{ margin: 0, fontSize: 'clamp(9px,0.75vw,11px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.65)' }}>
            We use cookies to enhance your experience and analyse site performance. By continuing, you agree to our{' '}
            <a href="/privacy" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline', textUnderlineOffset: 3 }}>privacy policy</a>.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14, marginTop: 18 }}>
            <button id="btn-decline" style={{ fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '8px 4px' }}>Decline</button>
            <button
              id="btn-accept"
              style={{ fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.3)', cursor: 'pointer', padding: '9px 16px', fontFamily: 'inherit' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
            >Accept</button>
          </div>
        </div>

        {/* =====================================================
            TIMELINE VIEWPORT
        ===================================================== */}
        <div
          ref={timelineViewport}
          className="absolute inset-0 z-[5] overflow-hidden bg-[#e8e6e0] text-[#0e0e0c] font-sans"
          style={{ opacity: 0, pointerEvents: 'none', isolation: 'isolate' }}
        >
          {/* LEFT GUIDE */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: leftGap, width: '0.5px', background: 'rgba(0,0,0,0.15)', zIndex: 2 }} />

          {/* ===================================================
              TRACK
              Track tidak bergerak — posisinya fixed di tengah layar.
              Setiap item di-overlay satu sama lain (position:absolute)
              dan digeser secara individual oleh onUpdate.
          =================================================== */}
          <div
            ref={timelineTrack}
            style={{
  position: 'absolute',
  top: 0,
  left: leftGap,
  width: `calc(100% - ${leftGap})`,
  height: '100%',
  isolation: 'isolate',
}}
          >
            {/* HEADER */}
            <div
              data-timeline-item
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0 clamp(32px,5vw,80px)',
                boxSizing: 'border-box',
                opacity: 0,
                
              }}
            >
              <div>
                <p style={{ fontSize: 12, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', margin: 0 }}>
                  Sirco — The Story / 2005 — 2026
                </p>
                <h2 style={{ fontSize: 'clamp(38px,5.2vw,82px)', fontWeight: 500, letterSpacing: '-0.06em', lineHeight: 0.88, margin: 'clamp(14px,1.8vw,26px) 0 0', maxWidth: 720 }}>
                  Built slowly.<br />Made to last.
                </h2>
                <p style={{ maxWidth: 520, margin: 'clamp(22px,3vw,40px) 0 0', fontSize: 'clamp(16px,0.8vw,20px)', lineHeight: 1.8, color: 'rgba(0,0,0,0.5)' }}>
                  Twenty-two years of ideas, experiments, places, and decisions — from the first mark in 2005 to the moment Sirco becomes real in 2026.
                </p>
              </div>
            </div>

            {/* MILESTONES */}
            {milestones.map((milestone) => (
              <article
                key={milestone.year}
                data-timeline-item
                style={{
                  // ── KUNCI FIX ──────────────────────────────────
                  // Setiap article overlay persis di tengah track.
                  // JS akan menggeser transform Y per item,
                  // bukan menggeser satu track bersama.
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  // ── Konten di-center vertikal ─────────────────
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 clamp(32px,5vw,80px)',
                  boxSizing: 'border-box',
                  opacity: 0,
                  
                }}
              >
                {/* Inner row: year | dot | content */}
                <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  {/* YEAR */}
                  <div style={{ width: 'clamp(76px,8vw,112px)', flexShrink: 0, paddingTop: 8 }}>
                    <span style={{ fontSize: 'clamp(13px,1.05vw,18px)', fontWeight: milestone.active ? 700 : 400, color: '#0e0e0c', letterSpacing: '-0.01em' }}>
                      {milestone.year}
                    </span>
                  </div>

                  {/* DOT */}
                  <div style={{ width: 'clamp(44px,5vw,68px)', flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 14 }}>
                    <div style={{
                      width: milestone.active ? 10 : 6,
                      height: milestone.active ? 10 : 6,
                      borderRadius: '50%',
                      background: milestone.active ? '#0e0e0c' : 'rgba(0,0,0,0.18)',
                      boxShadow: milestone.active ? '0 0 0 8px rgba(0,0,0,0.05)' : 'none',
                    }} />
                  </div>

                  {/* CONTENT */}
                  <div style={{ flex: 1, paddingLeft: 'clamp(4px,1vw,18px)' }}>
                    <p style={{ fontSize: 'clamp(13px,0.65vw,18px)', letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.32)', margin: '0 0 clamp(10px,1vw,16px)' }}>
                      {milestone.label}
                    </p>
                    <h3 style={{ fontSize: 'clamp(36px,4.6vw,76px)', fontWeight: milestone.active ? 700 : 500, letterSpacing: '-0.055em', lineHeight: 0.86, color: '#0e0e0c', margin: 0, whiteSpace: 'pre-line', maxWidth: 760 }}>
                      {milestone.title}
                    </h3>
                    <p style={{ maxWidth: 540, margin: 'clamp(22px,3vw,42px) 0 0', fontSize: 'clamp(16px,0.8vw,20px)', lineHeight: 1.85, color: 'rgba(0,0,0,0.48)' }}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            {/* END */}
            <div
              data-timeline-item
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0 clamp(32px,5vw,80px)',
                boxSizing: 'border-box',
                opacity: 0,
                
              }}
            >
              <div>
                <p style={{ fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.28)', margin: 0 }}>
                  2026 / End of timeline
                </p>
                <h3 style={{ fontSize: 'clamp(42px,6vw,92px)', lineHeight: 0.86, letterSpacing: '-0.06em', fontWeight: 500, margin: '24px 0 0' }}>
                  And now,<br />we keep going.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}