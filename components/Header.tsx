'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShoppingCart,
  Home, Package, MessageCircle, ShieldCheck, ClipboardList
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import BrandLogo from './BrandLogo'

export default function Header() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)

  const updateCartBadge = () => {
    if (typeof window !== 'undefined') {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]') as Array<{ quantity?: number }>
      const total = savedCart.reduce((acc, item) => acc + (item.quantity || 0), 0)
      setCartCount(total)
    }
  }

  useEffect(() => {
    updateCartBadge()
    window.addEventListener('cart-updated', updateCartBadge)
    window.addEventListener('storage', updateCartBadge)

    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })

    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles').select('is_admin')
          .eq('id', session.user.id).single()
        const isEmailAdmin = session.user.email === 'doungmolagoungvaldes@gmail.com'
        setIsAdmin(!!profile?.is_admin || isEmailAdmin)
      }
    }
    checkAdmin()

    return () => {
      window.removeEventListener('cart-updated', updateCartBadge)
      window.removeEventListener('storage', updateCartBadge)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node))
        setIsMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isMenuOpen])

  const navLinks = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'My Orders', href: '/orders', icon: ClipboardList },
    { name: 'Support', href: '/chat', icon: MessageCircle },
  ]

  const allLinks = [
    ...navLinks,
    ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: ShieldCheck }] : []),
  ]

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={
          scrolled
            ? {
                background: 'rgba(4,4,12,0.82)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.32)',
              }
            : {
                background: 'rgba(4,4,12,0.52)',
                backdropFilter: 'blur(20px) saturate(160%)',
                WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }
        }
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/home">
            <BrandLogo size="md" showFullName />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center lg-surface p-1.5 rounded-2xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                    isActive
                      ? 'text-[#0ea5e9] lg-badge shadow-sm'
                      : 'text-white/40 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  <link.icon size={14} className={isActive ? 'text-[#0ea5e9]' : ''} />
                  {link.name}
                  {!isActive && (
                    <span className="absolute bottom-1 left-5 right-5 h-[1.5px] bg-[#0ea5e9] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                  )}
                </Link>
              )
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className="ml-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest lg-btn-accent animate-pulse hover:animate-none"
              >
                <ShieldCheck size={14} />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2">
            {/* Cart pill */}
            <div className="flex items-center mr-2 px-2 py-1.5 lg-surface rounded-full">
              <Link href="/cart" className="p-2 rounded-full hover:bg-white/10 transition-colors relative group">
                <ShoppingCart size={18} className="text-white/50 group-hover:text-white transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#0ea5e9] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/40">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Hamburger */}
            <button
              className="lg:hidden p-3 rounded-xl lg-btn text-white w-11 h-11 flex items-center justify-center relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
              <span className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FULLSCREEN OVERLAY */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(2,4,12,0.88)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        }}
      >
        <div ref={overlayRef} className="flex flex-col justify-center h-full px-8 pt-24 space-y-2">
          {allLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-black uppercase tracking-widest text-[11px] text-white transition-all duration-300 lg-btn ${
                link.name === 'Admin Panel' ? 'lg-btn-accent' : ''
              } ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: isMenuOpen ? `${i * 60}ms` : '0ms' }}
            >
              <link.icon size={20} className={link.name === 'Admin Panel' ? 'text-[#0ea5e9]' : 'opacity-50'} />
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
