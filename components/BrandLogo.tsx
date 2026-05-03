'use client'

import React from 'react'
import Image from 'next/image'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showFullName?: boolean
}

const sizeMap = {
  sm: { h: 28, w: 42 },
  md: { h: 36, w: 54 },
  lg: { h: 48, w: 72 },
}

export default function BrandLogo({ size = 'md', showFullName = true }: BrandLogoProps) {
  const s = sizeMap[size]

  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo-share.png"
        alt="Retatrutide Research Center"
        width={s.w * 3}
        height={s.h * 3}
        style={{ height: s.h, width: 'auto' }}
        className="object-contain"
        priority
      />
      {showFullName && (
        <div className="flex flex-col leading-none">
          <span className={`font-black text-white tracking-tight ${size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs'}`}>
            Retatrutide
          </span>
          <span className={`font-bold text-white/60 uppercase tracking-widest ${size === 'lg' ? 'text-[9px]' : 'text-[7px]'}`}>
            Research Center
          </span>
        </div>
      )}
    </div>
  )
}
