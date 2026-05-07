'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, CheckCircle2, Percent, Shield, FlaskConical, Zap } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ease = [0.16, 1, 0.3, 1] as const

export default function ProductsPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [addedItemName, setAddedItemName] = useState('')
  const [filterPromo, setFilterPromo] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: catData } = await supabase.from('categories').select('*')
      setCategories(catData || [])
      const { data: prodData } = await supabase.from('products').select('*')
      setProducts(prodData || [])
    }
    fetchData()
  }, [])

  const addToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const idx = cart.findIndex((item: any) => item.id === product.id)
    if (idx > -1) { cart[idx].quantity += 1 }
    else { cart.push({ ...product, quantity: 1 }) }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    setAddedItemName(product.name)
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  const displayedProducts = products.filter((p: any) => {
    const matchSearch = p.name.toLowerCase().includes(searchValue.toLowerCase())
    const matchPromo = filterPromo ? p.on_sale === true : true
    const matchCat = activeCategory ? p.category_id === activeCategory : true
    return matchSearch && matchPromo && matchCat
  })

  return (
    <div className="min-h-screen" style={{ background: '#09090b', color: '#fafafa' }}>
      <Header />

      {/* Toast */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -16, x: '-50%' }}
            transition={{ type: 'spring' as const, bounce: 0.4, duration: 0.5 }}
            className="fixed top-24 left-1/2 z-[300] px-6 py-4 rounded-2xl flex items-center gap-4 min-w-[280px]"
            style={{ background: 'rgba(17,17,19,0.98)', border: '1px solid rgba(16,185,129,0.30)', boxShadow: '0 8px 40px rgba(16,185,129,0.20)' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(16,185,129,0.15)' }}>
              <CheckCircle2 size={16} style={{ color: '#34d399' }} />
            </div>
            <div className="flex-grow">
              <p className="text-[9px] uppercase font-black tracking-widest" style={{ color: '#52525b' }}>Added to cart</p>
              <p className="text-sm font-bold text-white truncate">{addedItemName}</p>
            </div>
            <Link href="/cart" className="text-[10px] font-black uppercase tracking-widest transition-colors"
              style={{ color: '#fbbf24' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f59e0b')}
              onMouseLeave={e => (e.currentTarget.style.color = '#fbbf24')}>
              View →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Marquee */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706 30%, #f59e0b 50%, #d97706 70%, transparent)' }} />
      <div className="py-2.5 overflow-hidden" style={{ background: 'rgba(217,119,6,0.08)', borderBottom: '1px solid rgba(217,119,6,0.15)' }}>
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3].map((i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-[0.2em] mx-10" style={{ color: '#d97706' }}>
              Free Shipping on orders above £100 ★ <span style={{ color: '#fbbf24' }}>Special Offer</span> ★ HPLC Verified ≥99% Purity ★
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="pt-28 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-1/4 w-[500px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.10) 0%, transparent 70%)' }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-4" style={{ color: '#d97706' }}>Research Catalogue</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.92]" style={{ letterSpacing: '-0.04em' }}>
              <span className="text-white">RESEARCH</span><br />
              <span className="ds-text-gradient">COMPOUNDS</span>
            </h1>
            <p className="text-base max-w-md mx-auto leading-relaxed" style={{ color: '#71717a' }}>
              Every batch HPLC-verified with Certificate of Analysis. Precision synthesis for global laboratories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-30" style={{ background: 'rgba(9,9,11,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#d97706' }} />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search compounds…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none ds-input"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${!activeCategory ? 'ds-btn-primary' : 'ds-btn-secondary'}`}
            >All</button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${activeCategory === cat.id ? 'ds-btn-primary' : 'ds-btn-secondary'}`}
              >{cat.name}</button>
            ))}
            <button
              onClick={() => setFilterPromo(!filterPromo)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${filterPromo ? 'ds-btn-primary' : 'ds-btn-secondary'}`}
            >
              <Percent size={12} /> Promos
            </button>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <main className="container mx-auto px-6 py-16">
        <p className="text-[11px] font-black uppercase tracking-widest mb-10" style={{ color: '#52525b' }}>
          {displayedProducts.length} product{displayedProducts.length !== 1 ? 's' : ''} found
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {displayedProducts.map((product: any, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring' as const, bounce: 0.2, duration: 0.5, delay: i * 0.04 }}
                className="group ds-card rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Image */}
                <Link href={`/products/${product.id}`}
                  className="relative aspect-square overflow-hidden flex items-center justify-center p-8"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {product.on_sale && (
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest z-10 ds-btn-primary">
                      Promo
                    </span>
                  )}
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                    src={product.main_image_url || '/placeholder.png'}
                    className="max-h-full object-contain"
                    alt={product.name}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white ds-surface">
                      View Details
                    </span>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 mb-3 w-fit px-2.5 py-1 rounded-lg ds-badge">
                    <Shield size={10} />
                    <span className="text-[9px] font-black uppercase tracking-wider">Certified RRC</span>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#d97706' }}>
                    {product.category_name || 'Research Grade'}
                  </span>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-black text-white text-sm mb-2 leading-tight group-hover:text-amber-400 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: '#71717a' }}>{product.description}</p>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                      <p className="font-black text-2xl ds-text-gradient ds-mono">£{product.price}</p>
                      {product.on_sale && product.sale_price && (
                        <p className="line-through text-sm" style={{ color: '#52525b' }}>£{product.sale_price}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => addToCart(e, product)}
                      className="w-full ds-btn-primary py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={13} /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {displayedProducts.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ds-surface">
              <FlaskConical size={28} style={{ color: '#d97706' }} />
            </div>
            <p className="text-sm font-medium mb-4" style={{ color: '#71717a' }}>No products match your search.</p>
            <button onClick={() => { setSearchValue(''); setActiveCategory(null); setFilterPromo(false) }}
              className="text-[10px] font-black uppercase tracking-widest transition-colors" style={{ color: '#d97706' }}>
              Clear filters →
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
