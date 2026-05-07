'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingCart, CheckCircle2, Share2, X, Shield, FileText, ArrowRight, Star, Truck, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ease = [0.16, 1, 0.3, 1] as const

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCOAModal, setShowCOAModal] = useState(false)

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (!error) setProduct(data)
        setLoading(false)
      })
  }, [id])

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const idx = cart.findIndex((item: any) => item.id === product.id)
    if (idx > -1) { cart[idx].quantity += quantity }
    else { cart.push({ ...product, quantity }) }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090b' }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#d97706', borderTopColor: 'transparent' }} />
    </div>
  )
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center text-white font-black uppercase tracking-widest" style={{ background: '#09090b' }}>
      Product Not Found
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#09090b', color: '#fafafa' }}>
      <Header />

      {/* Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -16, x: '-50%' }}
            transition={{ type: 'spring' as const, bounce: 0.4, duration: 0.5 }}
            className="fixed top-24 left-1/2 z-[100] px-6 py-4 rounded-2xl flex items-center gap-3 font-bold"
            style={{ background: 'rgba(17,17,19,0.98)', border: '1px solid rgba(16,185,129,0.30)', boxShadow: '0 8px 40px rgba(16,185,129,0.20)' }}
          >
            <CheckCircle2 size={18} style={{ color: '#34d399' }} />
            <span className="text-sm text-white">{product.name} added to cart</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 pt-8">
          <nav className="text-[10px] uppercase tracking-[0.25em] flex items-center gap-2 font-black" style={{ color: '#52525b' }}>
            <Link href="/products" className="transition-colors" style={{ color: '#52525b' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fbbf24')}
              onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>Shop</Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </div>

        {/* Main product section */}
        <section className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease }}
            className="relative rounded-3xl overflow-hidden flex items-center justify-center p-12 ds-surface"
            style={{ minHeight: '480px' }}
          >
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle, #d97706 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <motion.img
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring' as const, stiffness: 200, damping: 20 }}
              src={product.main_image_url}
              alt={product.name}
              className="w-full max-w-[380px] h-auto object-contain relative z-10"
            />
            <button
              onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
              className="absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center ds-btn-secondary"
            >
              <Share2 size={15} style={{ color: '#a1a1aa' }} />
            </button>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.06 }}
            className="flex flex-col pt-4"
          >
            <div className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-xl ds-badge mb-6">
              <Shield size={12} />
              <span className="text-[9px] font-black uppercase tracking-wider">Certified RRC Product</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-[1.05] text-white" style={{ letterSpacing: '-0.02em' }}>
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={13} fill={s <= 4 ? '#fbbf24' : 'none'} stroke={s <= 4 ? '#fbbf24' : '#3f3f46'} />
                ))}
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#52525b' }}>4.6 (25 Reviews)</span>
            </div>

            {/* Description */}
            <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div
                className="text-sm leading-relaxed line-clamp-3"
                style={{ color: '#71717a' }}
                dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
              />
            </div>

            {/* Price */}
            <p className="text-4xl font-black mb-8 tracking-tight ds-text-gradient ds-mono">
              £{product.price}
            </p>

            {/* Quantity + Add */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center rounded-xl overflow-hidden h-14 ds-surface">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 h-full transition-colors"
                  style={{ color: '#71717a', borderRight: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                  <Minus size={15} />
                </button>
                <span className="px-5 font-black text-base text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="px-5 h-full transition-colors"
                  style={{ color: '#71717a', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                  <Plus size={15} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 min-w-[180px] h-14 ds-btn-primary rounded-xl font-black uppercase text-[11px] tracking-[0.15em] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} />
                {product.stock > 0 ? 'Add To Cart' : 'Out of Stock'}
              </button>

              {product.coa_url && (
                <button
                  onClick={() => setShowCOAModal(true)}
                  className="h-14 px-5 ds-btn-secondary rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
                >
                  <FileText size={14} /> CoA
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Shield size={14} />, text: 'Lab Certified' },
                { icon: <Truck size={14} />, text: 'Fast Delivery' },
                { icon: <RotateCcw size={14} />, text: 'Quality Guarantee' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl text-center ds-surface">
                  <span style={{ color: '#d97706' }}>{badge.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-wide" style={{ color: '#71717a' }}>{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Benefits bar */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Money Back Guarantee', 'HPLC Verified — ≥99% Purity', 'Fast & Secure Checkout'].map((text, i) => (
              <div key={i} className="flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest" style={{ color: '#71717a' }}>
                <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Full description */}
        <section className="container mx-auto px-6 py-24 max-w-4xl">
          <div className="flex gap-10 mb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <button className="pb-5 font-black text-[11px] uppercase tracking-[0.2em] text-white"
              style={{ borderBottom: '2px solid #d97706' }}>
              Description
            </button>
          </div>

          <div
            className="text-[15px] leading-[1.8] whitespace-pre-line"
            style={{ color: '#71717a' }}
            dangerouslySetInnerHTML={{ __html: product.description || 'Full product details are being updated.' }}
          />

          {/* Legal notice */}
          <div className="mt-16 p-8 rounded-2xl" style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.20)' }}>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-2 ds-text-gradient">Legal Notice</h4>
            <p className="text-[13px] leading-relaxed italic" style={{ color: '#71717a' }}>
              This research compound is for laboratory use only. Not intended for human or veterinary use. Supplied exclusively for in-vitro research purposes.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      {/* COA Modal */}
      <AnimatePresence>
        {showCOAModal && product?.coa_url && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCOAModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ type: 'spring' as const, bounce: 0.3, duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
                style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
                  style={{ background: '#111113', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-3">
                    <FileText size={20} style={{ color: '#d97706' }} />
                    <h3 className="text-base font-black text-white tracking-tight">Certificate of Analysis</h3>
                  </div>
                  <button onClick={() => setShowCOAModal(false)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center ds-btn-secondary">
                    <X size={15} style={{ color: '#a1a1aa' }} />
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(85vh-140px)]" style={{ background: '#09090b' }}>
                  {product.coa_url.endsWith('.pdf') ? (
                    <iframe src={product.coa_url} className="w-full h-[600px]" title="Certificate of Analysis" />
                  ) : (
                    <img src={product.coa_url} alt="Certificate of Analysis" className="w-full h-auto object-contain" />
                  )}
                </div>

                <div className="sticky bottom-0 px-6 py-4 flex justify-between items-center"
                  style={{ background: '#111113', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-sm" style={{ color: '#71717a' }}><span className="font-bold text-white">{product.name}</span></p>
                  <a href={product.coa_url} target="_blank" rel="noopener noreferrer"
                    className="ds-btn-primary px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    Open Full <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
