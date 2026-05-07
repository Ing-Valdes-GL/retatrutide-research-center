'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

    const handleScroll = () => setScrolled(window.scrollY > 60)
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
    { name: 'Home',      href: '/home',    icon: Home },
    { name: 'Products',  href: '/products', icon: Package },
    { name: 'My Orders', href: '/orders',   icon: ClipboardList },
    { name: 'Support',   href: '/chat',     icon: MessageCircle },
  ]

  const allLinks = [
    ...navLinks,
    ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: ShieldCheck }] : []),
  ]

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 w-full transition-all duration-300"
        animate={scrolled ? {
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(28px)',
          boxShadow: '0 4px 24px rgba(132,204,22,0.10), 0 1px 0 rgba(132,204,22,0.12)',
        } : {
          backgroundColor: 'rgba(255,255,255,0.70)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 1px 0 rgba(132,204,22,0.08)',
        }}
        style={{ borderBottom: '1px solid rgba(132,204,22,0.12)' }}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/home">
            <BrandLogo size="md" showFullName />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center lg-surface p-1.5 rounded-2xl gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                    isActive
                      ? 'text-[#65a30d] lg-badge shadow-sm'
                      : 'text-[#4b7c59] hover:text-[#1a2e05] hover:bg-[rgba(132,204,22,0.06)]'
                  }`}
                >
                  <link.icon size={14} className={isActive ? 'text-[#84cc16]' : 'opacity-60'} />
                  {link.name}
                  {!isActive && (
                    <span className="absolute bottom-1 left-5 right-5 h-[1.5px] bg-[#84cc16] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                  )}
                </Link>
              )
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className="ml-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest lg-btn-accent"
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
              <Link href="/cart" className="p-2 rounded-full hover:bg-[rgba(132,204,22,0.08)] transition-colors relative group">
                <ShoppingCart size={18} className="text-[#4b7c59] group-hover:text-[#65a30d] transition-colors" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-0.5 -right-0.5 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: '#84cc16', boxShadow: '0 2px 8px rgba(132,204,22,0.40)' }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </div>

            {/* Hamburger */}
            <button
              className="lg:hidden p-3 rounded-xl lg-btn text-[#14532d] w-11 h-11 flex items-center justify-center relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`absolute block w-5 h-0.5 bg-[#14532d] transition-all duration-300 ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
              <span className={`absolute block w-5 h-0.5 bg-[#14532d] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute block w-5 h-0.5 bg-[#14532d] transition-all duration-300 ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40"
            style={{
              background: 'rgba(240,253,244,0.96)',
              backdropFilter: 'blur(32px) saturate(180%)',
              WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            }}
          >
            <div ref={overlayRef} className="flex flex-col justify-center h-full px-8 pt-24 space-y-3">
              {allLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, type: 'spring', bounce: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 ${
                      link.name === 'Admin Panel'
                        ? 'lg-btn-accent text-white'
                        : 'lg-btn text-[#1a2e05]'
                    }`}
                  >
                    <link.icon size={20} className={link.name === 'Admin Panel' ? 'text-white' : 'text-[#84cc16]'} />
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
