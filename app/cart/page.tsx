'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Package, Lock } from 'lucide-react'
import Link from 'next/link'

const ease = [0.16, 1, 0.3, 1] as const

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [shippingInfo, setShippingInfo] = useState({
    country: 'United Kingdom (UK)',
    county: '',
    townCity: '',
    postcode: '',
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(saved)
    setLoading(false)
  }, [])

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    )
    saveCart(updated)
  }

  const removeItem = (id: string) => saveCart(cartItems.filter((item) => item.id !== id))

  const saveCart = (newCart: any[]) => {
    setCartItems(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping  = subtotal >= 100 ? 0 : 30
  const total     = subtotal + shipping

  return (
    <div className="min-h-screen" style={{ background: '#09090b', color: '#fafafa' }}>
      <Header />

      {/* Amber stripe */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706 30%, #f59e0b 50%, #d97706 70%, transparent)' }} />

      {/* Page header */}
      <section className="pt-28 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #d97706 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[10px] uppercase tracking-[0.4em] font-black mb-3" style={{ color: '#d97706' }}>
            Your Selection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.06 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-white" style={{ letterSpacing: '-0.04em' }}>
            Cart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-sm mt-3" style={{ color: '#71717a' }}>
            Review your items before secure checkout
          </motion.p>
        </div>
      </section>

      <main className="container mx-auto px-6 py-8 pb-24">
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#d97706', borderTopColor: 'transparent' }} />
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center"
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ds-surface">
              <ShoppingBag size={32} style={{ color: '#d97706' }} />
            </div>
            <h2 className="text-2xl font-black mb-3 text-white">Your cart is empty</h2>
            <p className="text-sm mb-8" style={{ color: '#71717a' }}>Start exploring our research-grade compounds.</p>
            <Link href="/products" className="ds-btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">
              Browse Products <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ type: 'spring' as const, bounce: 0.2, duration: 0.5, delay: i * 0.04 }}
                    className="flex items-center gap-6 p-6 rounded-2xl ds-card"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0 p-2 ds-surface">
                      <img src={item.image_url || item.main_image_url} className="max-h-full max-w-full object-contain" alt={item.name} />
                    </div>

                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#d97706' }}>
                        {item.category_name || 'Research Grade'}
                      </p>
                      <h3 className="font-black text-white text-sm leading-tight truncate">{item.name}</h3>
                      <p className="font-black text-base mt-1 ds-text-gradient ds-mono">£{item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center ds-btn-secondary"
                      >
                        <Minus size={12} style={{ color: '#a1a1aa' }} />
                      </button>
                      <span className="text-base font-black min-w-[1.5rem] text-center text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center ds-btn-secondary"
                      >
                        <Plus size={12} style={{ color: '#a1a1aa' }} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="font-black text-base shrink-0 min-w-[4rem] text-right text-white">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Remove */}
                    <button onClick={() => removeItem(item.id)}
                      className="transition-colors shrink-0 ml-2"
                      style={{ color: '#3f3f46' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#3f3f46')}>
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Shipping form */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-8 rounded-2xl ds-surface"
              >
                <h3 className="text-sm font-black uppercase tracking-tight mb-6 text-white">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <select
                      className="w-full px-4 py-3 rounded-xl text-sm ds-input"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    >
                      <option>United Kingdom (UK)</option>
                      <option>United States (US)</option>
                      <option>France</option>
                      <option>Germany</option>
                      <option>Australia</option>
                    </select>
                  </div>
                  {[
                    { placeholder: 'County',      key: 'county' },
                    { placeholder: 'Town / City', key: 'townCity' },
                    { placeholder: 'Postcode',    key: 'postcode' },
                  ].map(({ placeholder, key }) => (
                    <input
                      key={key}
                      type="text"
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm ds-input"
                      value={shippingInfo[key as keyof typeof shippingInfo]}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, [key]: e.target.value })}
                    />
                  ))}
                  <button className="ds-btn-secondary px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">
                    Update Shipping
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right column: Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl p-8 sticky top-28 ds-surface"
                style={{ border: '1px solid rgba(217,119,6,0.20)', boxShadow: '0 8px 40px rgba(217,119,6,0.08)' }}
              >
                <div className="h-0.5 w-full mb-8 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706, #f59e0b, transparent)' }} />
                <h2 className="text-sm font-black uppercase tracking-tight mb-8 text-white">Order Summary</h2>

                <div className="space-y-5 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#52525b' }}>Subtotal</span>
                    <span className="font-black text-base text-white">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#52525b' }}>Shipping</span>
                    <span className="font-black text-base" style={{ color: shipping === 0 ? '#34d399' : '#fbbf24' }}>
                      {shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg ds-badge-emerald">
                      <Package size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Free shipping unlocked!</span>
                    </div>
                  )}
                  <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex justify-between items-end">
                      <span className="font-black text-xs uppercase tracking-wider" style={{ color: '#52525b' }}>Total</span>
                      <span className="text-3xl font-black tracking-tight ds-text-gradient ds-mono">£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => cartItems.length ? router.push('/checkout') : alert('Your cart is empty.')}
                    className="w-full ds-btn-primary py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.15em] flex items-center justify-center gap-2 group"
                  >
                    Checkout
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <Link href="/products"
                    className="w-full ds-btn-secondary py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center">
                    Continue Shopping
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-2 mt-6">
                  <Lock size={11} style={{ color: '#3f3f46' }} />
                  <p className="text-center text-[10px] font-medium" style={{ color: '#3f3f46' }}>
                    Secure checkout · SSL encrypted
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
