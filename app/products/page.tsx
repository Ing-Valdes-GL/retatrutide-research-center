'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, CheckCircle2, Percent, Shield, ArrowRight, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const springIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { type: 'spring' as const, bounce: 0.25, duration: 1.0, delay },
})

export default function ProductsPage() {
  const router = useRouter()
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
    <div className="min-h-screen bg-white text-[#14532d]">
      <Header />

      {/* Success toast */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -16, x: '-50%' }}
            transition={{ type: 'spring' as const, bounce: 0.4, duration: 0.5 }}
            className="fixed top-24 left-1/2 z-[300] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]"
            style={{ background: '#fff', border: '1.5px solid rgba(132,204,22,0.30)', boxShadow: '0 8px 40px rgba(132,204,22,0.18)' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#f0fdf4' }}>
              <CheckCircle2 size={18} className="text-[#65a30d]" />
            </div>
            <div className="flex-grow">
              <p className="text-[9px] uppercase font-black tracking-widest text-[#9ca3af]">Added to cart</p>
              <p className="text-sm font-bold text-[#1a2e05] truncate">{addedItemName}</p>
            </div>
            <Link href="/cart" className="text-[10px] font-black uppercase tracking-widest text-[#65a30d] hover:text-[#84cc16] transition-colors">
              View →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Marquee */}
      <div className="py-2.5 overflow-hidden" style={{ background: '#84cc16' }}>
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3].map((i) => (
            <span key={i} className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mx-10">
              Free Shipping on orders above £100 ★ <span className="text-[#fef08a]">Special Offer</span> ★ Lab Tested ★
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="pt-20 pb-14 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f7fee7 0%, #ffffff 60%, #fefce8 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #84cc16 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <motion.div {...springIn(0)} className="container mx-auto px-6 relative z-10">
          <p className="text-[11px] uppercase tracking-[0.35em] font-black mb-4" style={{ color: '#65a30d' }}>Catalogue</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
            Research Grade<br />Compounds
          </h1>
          <p className="text-[#4b7c59] text-base max-w-md mx-auto leading-relaxed">
            Every product is HPLC-verified with Certificate of Analysis included.
          </p>
        </motion.div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-20 z-30 border-b" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderColor: 'rgba(132,204,22,0.12)' }}>
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#84cc16]" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search compounds..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none text-[#1a2e05] placeholder:text-[#9ca3af]"
              style={{ background: '#f7fee7', border: '1.5px solid rgba(132,204,22,0.20)' }}
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${!activeCategory ? 'lg-btn-accent text-white' : 'lg-btn'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${activeCategory === cat.id ? 'lg-btn-accent text-white' : 'lg-btn'}`}
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => setFilterPromo(!filterPromo)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${filterPromo ? 'lg-btn-yellow' : 'lg-btn'}`}
            >
              <Percent size={12} /> Promos
            </button>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <main className="container mx-auto px-6 py-16">
        <p className="text-[#9ca3af] text-[11px] font-black uppercase tracking-widest mb-10">
          {displayedProducts.length} product{displayedProducts.length !== 1 ? 's' : ''} found
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {displayedProducts.map((product: any, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring' as const, bounce: 0.2, duration: 0.5, delay: i * 0.04 }}
                whileHover={{ y: -6 }}
                className="group lg-card rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Image */}
                <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden flex items-center justify-center p-8"
                  style={{ background: '#f7fee7' }}>
                  {product.on_sale && (
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest z-10"
                      style={{ background: '#ca8a04' }}>
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
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-[#1a2e05]"
                      style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid rgba(132,204,22,0.25)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                      View Details
                    </span>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 mb-3 w-fit px-2.5 py-1 rounded-lg lg-badge">
                    <Shield size={11} className="text-[#65a30d]" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#65a30d]">Certified RRC</span>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-widest mb-1 text-[#84cc16]">
                    {product.category_name || 'Research Grade'}
                  </span>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-black text-[#1a2e05] text-base mb-2 leading-tight group-hover:text-[#65a30d] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-[#6b7280] text-xs mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                      <p className="font-black text-2xl" style={{ color: '#ca8a04' }}>£{product.price}</p>
                      {product.on_sale && product.sale_price && (
                        <p className="text-[#9ca3af] line-through text-sm">£{product.sale_price}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => addToCart(e, product)}
                      className="w-full lg-btn-accent py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {displayedProducts.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-[#9ca3af] text-sm font-medium">No products match your search.</p>
            <button onClick={() => { setSearchValue(''); setActiveCategory(null); setFilterPromo(false) }}
              className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#65a30d] hover:text-[#84cc16] transition-colors">
              Clear filters →
            </button>
          </div>
        )}
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 28s linear infinite; }
      `}</style>
    </div>
  )
}
