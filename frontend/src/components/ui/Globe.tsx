"use client"

import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'
import { useMotionValue, useSpring } from 'motion/react'

import { cn } from '../../lib/utils'

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

type GlobeConfig = typeof GLOBE_CONFIG;

interface Props {
  className?: string;
  config?: GlobeConfig;
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: Props) {
  let width = 0
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
  const phiRef = useRef(0)
  const frameRef = useRef<number | null>(null)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? 'grabbing' : 'grab'
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener('resize', onResize)
    onResize()

    if (!canvasRef.current) {
      return undefined;
    }

    globeRef.current = createGlobe(canvasRef.current, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: () => {},
    })

    const render = () => {
      if (globeRef.current) {
        if (!pointerInteracting.current) {
          phiRef.current += 0.005
        }

        globeRef.current.update({
          phi: phiRef.current + rs.get(),
          width: width * 2,
          height: width * 2,
        })
      }

      frameRef.current = window.requestAnimationFrame(render)
    }

    frameRef.current = window.requestAnimationFrame(render)

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1'
      }
    }, 0)
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
      globeRef.current?.destroy()
      globeRef.current = null
      window.removeEventListener('resize', onResize)
    }
  }, [rs, config])

  return (
    <div
      className={cn(
        'absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]',
        className
      )}
    >
      <canvas
        className={cn(
          'size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]'
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}

export const DEFAULT_GLOBE_CONFIG = GLOBE_CONFIG;
export const DEFAULT_GLOBE_MARKERS = GLOBE_CONFIG.markers;
