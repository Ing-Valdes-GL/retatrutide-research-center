'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, FlaskConical } from 'lucide-react'

const NAV = [
  { href: '/products', label: 'Shop' },
  { href: '/about',    label: 'About' },
  { href: '/chat',     label: 'Support' },
  { href: '/orders',   label: 'Orders' },
]

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const syncCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartCount(cart.reduce((s: number, i: any) => s + i.quantity, 0))
  }
  useEffect(() => {
    syncCart()
    window.addEventListener('cart-updated', syncCart)
    return () => window.removeEventListener('cart-updated', syncCart)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(9,9,11,0.90)' : 'transparent',
          backdropFilter: scrolled ? 'blur(28px) saturate(150%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.50)' : 'none',
        }}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', boxShadow: '0 4px 16px rgba(217,119,6,0.40)' }}
            >
              <FlaskConical size={17} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-white block">Retatrutide RC</span>
              <span className="text-[8px] font-medium uppercase tracking-[0.22em] block" style={{ color: '#52525b' }}>Research Center</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = pathname === n.href || pathname.startsWith(n.href + '/')
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="relative px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 rounded-lg"
                  style={{ color: active ? '#fbbf24' : '#71717a' }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#fafafa' }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#71717a' }}
                >
                  {n.label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #d97706, #f59e0b)' }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden md:flex items-center text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all duration-200 ds-btn-secondary"
            >
              Sign In
            </Link>

            <Link href="/cart" className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center ds-btn-secondary transition-all">
                <ShoppingCart size={16} style={{ color: '#a1a1aa' }} />
              </div>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    transition={{ type: 'spring' as const, stiffness: 500, damping: 25 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center text-white"
                    style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', boxShadow: '0 2px 8px rgba(217,119,6,0.50)' }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center ds-btn-secondary"
            >
              {mobileOpen ? <X size={16} style={{ color: '#a1a1aa' }} /> : <Menu size={16} style={{ color: '#a1a1aa' }} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring' as const, bounce: 0.15, duration: 0.4 }}
              className="fixed inset-x-4 top-20 z-50 rounded-2xl p-6 md:hidden"
              style={{ background: 'rgba(17,17,19,0.98)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(24px)' }}
            >
              <div className="flex flex-col gap-1">
                {NAV.map((n, i) => {
                  const active = pathname === n.href
                  return (
                    <motion.div key={n.href}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}>
                      <Link
                        href={n.href}
                        className="flex items-center px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
                        style={{
                          color: active ? '#fbbf24' : '#a1a1aa',
                          background: active ? 'rgba(217,119,6,0.10)' : 'transparent',
                        }}
                      >
                        {n.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Link href="/login"
                  className="w-full ds-btn-primary py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center">
                  Sign In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
