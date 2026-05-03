'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShoppingCart, Sun, Moon, Menu, X,
  Home, Package, MessageCircle, ShieldCheck, ClipboardList
} from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { supabase } from '@/lib/supabase'
import BrandLogo from './BrandLogo'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
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
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
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

  // Close mobile menu on outside tap
  useEffect(() => {
    if (!isMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
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
                background: 'rgba(0,0,0,0.72)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }
            : { background: 'transparent' }
        }
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/home">
            <BrandLogo size="md" showFullName />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center bg-gray-500/5 p-1.5 rounded-2xl border border-white/5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? 'text-brand-primary bg-brand-primary/10 shadow-sm'
                      : 'opacity-40 hover:opacity-100 hover:bg-white/5'
                  }`}
                >
                  <link.icon size={14} className={isActive ? 'text-brand-primary' : ''} />
                  {link.name}
                  {/* Animated underline */}
                  {!isActive && (
                    <span
                      className="absolute bottom-1 left-5 right-5 h-[1.5px] bg-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                    />
                  )}
                </Link>
              )
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className="ml-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-primary/30 text-brand-primary bg-brand-primary/5 hover:bg-brand-primary hover:text-white transition-all animate-pulse hover:animate-none"
              >
                <ShieldCheck size={14} />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2 px-3 py-1.5 bg-gray-500/5 rounded-full border border-white/5">
              <Link href="/cart" className="p-2 rounded-full hover:bg-white/10 transition-colors relative group">
                <ShoppingCart size={18} className="opacity-50 group-hover:opacity-100 transition-opacity text-white" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl transition-all border bg-white/5 border-white/10 text-sky-400 hover:bg-sky-400/10"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="lg:hidden p-3 rounded-xl bg-white/10 text-white relative w-11 h-11 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}
              />
              <span
                className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`absolute block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FULLSCREEN OVERLAY */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div ref={overlayRef} className="flex flex-col justify-center h-full px-10 pt-24 space-y-3">
          {allLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-black uppercase tracking-widest text-[11px] text-white transition-all duration-300 ${
                link.name === 'Admin Panel'
                  ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary'
                  : 'hover:bg-white/5 hover:text-brand-primary'
              } ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{
                transitionDelay: isMenuOpen ? `${i * 60}ms` : '0ms',
              }}
            >
              <link.icon size={20} className={link.name === 'Admin Panel' ? 'text-brand-primary' : 'opacity-60'} />
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
