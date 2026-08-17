'use client'

import Hero from '@/components/Hero'
import MaterialSection from '@/components/MaterialSection'

export default function Home() {
  return (
    <main>
      <div
  data-material-wrapper
  style={{
    position: 'fixed',
    inset: 0,
    zIndex: 1,
    opacity: 1,
    pointerEvents: 'none',
    clipPath: 'circle(0px at 50% 50%)',  // ← pastiin ini ada
  }}
>
  <MaterialSection />
</div>

      <Hero />
    </main>
  )
}