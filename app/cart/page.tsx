'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Package } from 'lucide-react'
import Link from 'next/link'

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

  const subtotal    = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping    = subtotal >= 100 ? 0 : 30
  const total       = subtotal + shipping

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm font-medium outline-none text-[#1a2e05] placeholder:text-[#9ca3af] transition-all"
  const inputStyle = { background: '#f7fee7', border: '1.5px solid rgba(132,204,22,0.20)' }

  return (
    <div className="min-h-screen bg-white text-[#14532d]">
      <Header />

      {/* Page header */}
      <section className="pt-20 pb-12 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f7fee7 0%, #ffffff 60%)' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #84cc16 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, bounce: 0.3, duration: 0.8 }}
            className="text-[11px] uppercase tracking-[0.35em] font-black mb-3" style={{ color: '#65a30d' }}>
            Your Selection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, bounce: 0.25, duration: 0.9, delay: 0.06 }}
            className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
            Cart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[#4b7c59] text-sm mt-2">
            Review your items before secure checkout
          </motion.p>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12 pb-24">
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-[#84cc16] border-t-transparent animate-spin" />
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center"
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: '#f7fee7', border: '1.5px solid rgba(132,204,22,0.20)' }}>
              <ShoppingBag size={32} className="text-[#84cc16]" />
            </div>
            <h2 className="text-2xl font-black mb-3" style={{ color: '#1a2e05' }}>Your cart is empty</h2>
            <p className="text-[#6b7280] text-sm mb-8">Start exploring our research-grade compounds.</p>
            <Link href="/products" className="lg-btn-accent inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">
              Browse Products <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">

            {/* ── LEFT COLUMN ── */}
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
                    className="flex items-center gap-6 p-6 rounded-2xl"
                    style={{ background: '#fff', border: '1.5px solid rgba(132,204,22,0.14)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0 p-2"
                      style={{ background: '#f7fee7', border: '1px solid rgba(132,204,22,0.15)' }}>
                      <img src={item.image_url || item.main_image_url} className="max-h-full max-w-full object-contain" alt={item.name} />
                    </div>

                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#65a30d' }}>
                        {item.category_name || 'Research Grade'}
                      </p>
                      <h3 className="font-black text-[#1a2e05] text-sm leading-tight truncate">{item.name}</h3>
                      <p className="font-black text-lg mt-1" style={{ color: '#ca8a04' }}>£{item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all lg-btn"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-base font-black min-w-[1.5rem] text-center" style={{ color: '#1a2e05' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all lg-btn"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="font-black text-base shrink-0 min-w-[4rem] text-right" style={{ color: '#1a2e05' }}>
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Remove */}
                    <button onClick={() => removeItem(item.id)}
                      className="text-[#d1d5db] hover:text-red-400 transition-colors shrink-0 ml-2">
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Shipping form */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-8 rounded-2xl"
                style={{ background: '#f7fee7', border: '1.5px solid rgba(132,204,22,0.15)' }}
              >
                <h3 className="text-base font-black uppercase tracking-tight mb-6" style={{ color: '#1a2e05' }}>
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <select
                      className={inputCls}
                      style={inputStyle}
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
                      className={inputCls}
                      style={inputStyle}
                      value={shippingInfo[key as keyof typeof shippingInfo]}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, [key]: e.target.value })}
                    />
                  ))}
                  <button className="lg-btn-accent px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">
                    Update Shipping
                  </button>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN: Summary ── */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl p-8 sticky top-28"
                style={{
                  background: 'linear-gradient(145deg, #f0fdf4 0%, #f7fee7 100%)',
                  border: '1.5px solid rgba(132,204,22,0.22)',
                  boxShadow: '0 8px 40px rgba(132,204,22,0.12)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                  style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />
                <h2 className="text-base font-black uppercase tracking-tight mb-8" style={{ color: '#1a2e05' }}>
                  Order Summary
                </h2>

                <div className="space-y-5 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-[#6b7280]">Subtotal</span>
                    <span className="font-black text-base" style={{ color: '#1a2e05' }}>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-[#6b7280]">Shipping</span>
                    <span className="font-black text-base" style={{ color: shipping === 0 ? '#65a30d' : '#ca8a04' }}>
                      {shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(132,204,22,0.10)', border: '1px solid rgba(132,204,22,0.18)' }}>
                      <Package size={13} className="text-[#65a30d]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#65a30d]">Free shipping unlocked!</span>
                    </div>
                  )}
                  <div className="pt-4 border-t" style={{ borderColor: 'rgba(132,204,22,0.15)' }}>
                    <div className="flex justify-between items-end">
                      <span className="font-black text-sm uppercase tracking-wider text-[#6b7280]">Total</span>
                      <span className="text-3xl font-black tracking-tight" style={{ color: '#1a2e05' }}>
                        £{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => cartItems.length ? router.push('/checkout') : alert('Your cart is empty.')}
                    className="w-full lg-btn-accent py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.15em] flex items-center justify-center gap-2 group"
                  >
                    Checkout
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <Link href="/products"
                    className="w-full lg-btn py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center">
                    Continue Shopping
                  </Link>
                </div>

                <p className="text-center text-[10px] text-[#9ca3af] font-medium mt-6">
                  Secure checkout · SSL encrypted
                </p>
              </motion.div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
