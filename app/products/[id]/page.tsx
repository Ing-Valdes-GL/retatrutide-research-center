'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingCart, CheckCircle2, Share2, X, Shield, FileText, ArrowRight, Star, Truck, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#84cc16] border-t-transparent animate-spin" />
    </div>
  )
  if (!product) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-[#14532d] font-black uppercase tracking-widest">
      Product Not Found
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-[#14532d]">
      <Header />

      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -16, x: '-50%' }}
            transition={{ type: 'spring' as const, bounce: 0.4, duration: 0.5 }}
            className="fixed top-24 left-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
            style={{ background: '#fff', border: '1.5px solid rgba(132,204,22,0.30)', boxShadow: '0 8px 40px rgba(132,204,22,0.18)' }}
          >
            <CheckCircle2 size={20} className="text-[#65a30d]" />
            <span className="text-sm text-[#1a2e05]">{product.name} added to cart</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 pt-8">
          <nav className="text-[10px] text-[#9ca3af] uppercase tracking-[0.25em] flex items-center gap-2 font-black">
            <Link href="/products" className="hover:text-[#65a30d] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#1a2e05]">{product.name}</span>
          </nav>
        </div>

        {/* Main product section */}
        <section className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring' as const, bounce: 0.25, duration: 0.9 }}
            className="relative rounded-3xl overflow-hidden flex items-center justify-center p-12"
            style={{
              background: 'linear-gradient(145deg, #f7fee7 0%, #ecfdf5 100%)',
              border: '1.5px solid rgba(132,204,22,0.18)',
              minHeight: '480px',
            }}
          >
            <motion.img
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring' as const, stiffness: 200, damping: 20 }}
              src={product.main_image_url}
              alt={product.name}
              className="w-full max-w-[380px] h-auto object-contain"
            />
            <button
              onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all lg-btn"
            >
              <Share2 size={16} />
            </button>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring' as const, bounce: 0.25, duration: 0.9, delay: 0.06 }}
            className="flex flex-col pt-4"
          >
            {/* Badge */}
            <div className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-xl lg-badge mb-6">
              <Shield size={13} className="text-[#65a30d]" />
              <span className="text-[9px] font-black uppercase tracking-wider text-[#65a30d]">Certified RRC Product</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-[1.05]"
              style={{ color: '#1a2e05', letterSpacing: '-0.02em' }}>
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} fill={s <= 4 ? '#facc15' : 'none'} stroke={s <= 4 ? '#facc15' : '#d1d5db'} />
                ))}
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">4.6 (25 Reviews)</span>
            </div>

            {/* Description excerpt */}
            <div className="mb-8 pb-8 border-b" style={{ borderColor: 'rgba(132,204,22,0.12)' }}>
              <div
                className="text-[#4b7c59] text-sm leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
              />
            </div>

            {/* Price */}
            <p className="text-4xl font-black mb-8 tracking-tight" style={{ color: '#ca8a04' }}>
              £{product.price}
            </p>

            {/* Quantity + Add to cart */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center rounded-xl overflow-hidden h-14"
                style={{ border: '1.5px solid rgba(132,204,22,0.25)', background: '#f7fee7' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 h-full text-[#4b7c59] hover:text-[#1a2e05] transition-colors border-r"
                  style={{ borderColor: 'rgba(132,204,22,0.20)' }}>
                  <Minus size={15} />
                </button>
                <span className="px-5 font-black text-base text-[#1a2e05]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="px-5 h-full text-[#4b7c59] hover:text-[#1a2e05] transition-colors border-l"
                  style={{ borderColor: 'rgba(132,204,22,0.20)' }}>
                  <Plus size={15} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 min-w-[180px] h-14 lg-btn-accent rounded-xl font-black uppercase text-[11px] tracking-[0.15em] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} />
                {product.stock > 0 ? 'Add To Cart' : 'Out of Stock'}
              </button>

              {product.coa_url && (
                <button
                  onClick={() => setShowCOAModal(true)}
                  className="h-14 px-5 lg-btn rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
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
                <div key={i} className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl text-center"
                  style={{ background: '#f7fee7', border: '1px solid rgba(132,204,22,0.15)' }}>
                  <span style={{ color: '#65a30d' }}>{badge.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-wide text-[#4b7c59]">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Benefits bar */}
        <div className="border-y" style={{ background: '#f0fdf4', borderColor: 'rgba(132,204,22,0.12)' }}>
          <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'Money Back Guarantee',
              'HPLC Verified — ≥99% Purity',
              'Fast & Secure Checkout',
            ].map((text, i) => (
              <div key={i} className="flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#4b7c59]">
                <CheckCircle2 size={16} className="text-[#84cc16] shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Full description */}
        <section className="container mx-auto px-6 py-24 max-w-4xl">
          <div className="flex gap-10 mb-12" style={{ borderBottom: '1px solid rgba(132,204,22,0.12)' }}>
            <button className="pb-5 font-black text-[11px] uppercase tracking-[0.2em] text-[#1a2e05]"
              style={{ borderBottom: '2px solid #84cc16' }}>
              Description
            </button>
          </div>

          <div
            className="text-[#4b7c59] text-[15px] leading-[1.8] whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: product.description || 'Full product details are being updated.' }}
          />

          {/* Legal notice */}
          <div className="mt-16 p-8 rounded-2xl" style={{ background: '#fef9c3', border: '1px solid rgba(250,204,21,0.30)' }}>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-2" style={{ color: '#ca8a04' }}>Legal Notice</h4>
            <p className="text-[#92400e] text-[13px] leading-relaxed italic">
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
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[200]"
            />
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ type: 'spring' as const, bounce: 0.3, duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
                style={{ border: '1.5px solid rgba(132,204,22,0.20)' }}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white"
                  style={{ borderBottom: '1px solid rgba(132,204,22,0.12)' }}>
                  <div className="flex items-center gap-3">
                    <FileText size={22} className="text-[#65a30d]" />
                    <h3 className="text-lg font-black text-[#1a2e05] tracking-tight">Certificate of Analysis</h3>
                  </div>
                  <button onClick={() => setShowCOAModal(false)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all lg-btn">
                    <X size={16} />
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(85vh-140px)]" style={{ background: '#f7fee7' }}>
                  {product.coa_url.endsWith('.pdf') ? (
                    <iframe src={product.coa_url} className="w-full h-[600px]" title="Certificate of Analysis" />
                  ) : (
                    <img src={product.coa_url} alt="Certificate of Analysis" className="w-full h-auto object-contain" />
                  )}
                </div>

                <div className="sticky bottom-0 px-6 py-4 bg-white flex justify-between items-center"
                  style={{ borderTop: '1px solid rgba(132,204,22,0.12)' }}>
                  <p className="text-sm text-[#6b7280]"><span className="font-bold">Product:</span> {product.name}</p>
                  <a href={product.coa_url} target="_blank" rel="noopener noreferrer"
                    className="lg-btn-accent px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    Open in New Tab <ArrowRight size={14} />
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
