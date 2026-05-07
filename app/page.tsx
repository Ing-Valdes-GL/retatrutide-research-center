'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  ShoppingCart, ArrowRight, Lock,
  ChevronDown, FlaskConical, Microscope, Globe,
  CheckCircle2, Package, Truck, RotateCcw, Shield,
  Star, Mail, Send, Zap, Award,
} from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  main_image_url: string
  category_name?: string
  on_sale?: boolean
}

const springIn = (delay = 0) => ({
  initial: { opacity: 0, y: 28, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true as const },
  transition: { type: 'spring' as const, bounce: 0.28, duration: 1.2, delay },
})

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [addedProduct, setAddedProduct] = useState<Product | null>(null)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true).limit(3)
      .then(({ data }) => setProducts((data as Product[]) || []))
  }, [])

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as Array<Product & { quantity: number }>
    const existing = cart.find((i) => i.id === product.id)
    if (existing) { existing.quantity += 1 } else { cart.push({ ...product, quantity: 1 }) }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    setAddedProduct(product)
  }

  return (
    <div className="min-h-screen bg-white text-[#14532d] overflow-x-hidden">
      <Header />

      {/* ── HERO ── */}
      <section
        ref={heroRef as React.RefObject<HTMLElement>}
        className="relative min-h-[94vh] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f7fee7 0%, #ecfdf5 40%, #fffde7 70%, #f0fdf4 100%)' }}
      >
        {/* Animated blobs */}
        <motion.div animate={{ scale: [1, 1.18, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.18) 0%, transparent 70%)' }} />
        <motion.div animate={{ scale: [1, 1.12, 1], x: [0, -25, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[-5%] right-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.16) 0%, transparent 70%)' }} />
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.10) 0%, transparent 70%)' }} />

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #65a30d 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 relative z-10 flex items-center justify-between gap-8">

          {/* Left arch panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring' as const, bounce: 0.3, duration: 1.4 }}
            className="hidden lg:flex w-[240px] h-[300px] rounded-t-full overflow-hidden flex-shrink-0 items-end justify-center pb-6"
            style={{
              background: 'linear-gradient(145deg, #dcfce7 0%, #bbf7d0 100%)',
              border: '1.5px solid rgba(132,204,22,0.30)',
              boxShadow: '0 8px 48px rgba(132,204,22,0.18), inset 0 1px 0 rgba(255,255,255,0.80)',
            }}
          >
            <div className="flex flex-col items-center gap-3 pb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(132,204,22,0.20)', border: '1px solid rgba(132,204,22,0.30)' }}>
                <FlaskConical size={28} style={{ color: '#65a30d' }} />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-center" style={{ color: '#4b7c59' }}>GLP-1 Research</p>
            </div>
          </motion.div>

          {/* Center content */}
          <div className="flex flex-col items-center text-center flex-grow px-4 md:px-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' as const, bounce: 0.4, duration: 1, delay: 0.1 }}
              className="flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full lg-badge"
            >
              <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[#84cc16]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#65a30d]">Advanced Peptide Research</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring' as const, bounce: 0.25, duration: 1.4, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.88] tracking-[-0.06em] uppercase mb-6"
              style={{ color: '#1a2e05' }}
            >
              RETATRUTIDE<br />
              <span style={{ color: '#84cc16' }}>RESEARCH</span><br />
              <span style={{ color: '#eab308' }}>CENTER</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, bounce: 0.2, duration: 1.2, delay: 0.38 }}
              className="text-base md:text-xl text-[#4b7c59] font-medium tracking-tight mb-10 max-w-md"
            >
              Advancing GLP-1 peptide science through precision synthesis, clinical-grade purity, and global research distribution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, bounce: 0.3, duration: 1.1, delay: 0.52 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/products"
                className="group lg-btn-accent inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-sm tracking-[0.15em]">
                Browse Products
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>
              <Link href="/about"
                className="group lg-btn inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-sm tracking-[0.15em]">
                About RRC
              </Link>
            </motion.div>

            {/* Trust micro-badges */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-6 mt-10 flex-wrap justify-center"
            >
              {['≥99% Purity', 'CoA Included', 'Fast Delivery'].map((label) => (
                <div key={label} className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} style={{ color: '#84cc16' }} />
                  <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#4b7c59' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right arch panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring' as const, bounce: 0.3, duration: 1.4 }}
            className="hidden lg:flex w-[240px] h-[300px] rounded-t-full overflow-hidden flex-shrink-0 items-end justify-center pb-6"
            style={{
              background: 'linear-gradient(145deg, #fefce8 0%, #fef9c3 100%)',
              border: '1.5px solid rgba(250,204,21,0.35)',
              boxShadow: '0 8px 48px rgba(250,204,21,0.18), inset 0 1px 0 rgba(255,255,255,0.80)',
            }}
          >
            <div className="flex flex-col items-center gap-3 pb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(250,204,21,0.20)', border: '1px solid rgba(250,204,21,0.35)' }}>
                <Award size={28} style={{ color: '#ca8a04' }} />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-center" style={{ color: '#92400e' }}>Lab Certified</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown size={28} className="text-[#84cc16] opacity-60" />
        </motion.div>

        {/* Bottom marquee bar */}
        <div className="absolute bottom-0 w-full py-3 z-20 overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #84cc16 0%, #65a30d 50%, #84cc16 100%)' }}>
          <div className="flex whitespace-nowrap animate-marquee">
            {[1, 2, 3].map((i) => (
              <span key={i} className="font-black text-[11px] uppercase tracking-[0.3em] mx-10 text-white">
                ★ Free Shipping on orders above £100 ★&nbsp;
                <span className="text-[#fef08a]">100% Lab Tested</span>
                &nbsp;★ Pure Compounds ★ GLP-1 Research Grade ★
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-14" style={{ background: '#f0fdf4', borderBottom: '1px solid rgba(132,204,22,0.12)' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '3M+',   label: 'Compounds Studied',  sub: 'cumulative research data', color: '#65a30d' },
              { val: '99.8%', label: 'Purity Rate',        sub: 'HPLC verified batches',    color: '#ca8a04' },
              { val: '50+',   label: 'Countries Served',   sub: 'global distribution',      color: '#65a30d' },
              { val: '4.7k+', label: 'Research Partners',  sub: 'institutions & labs',      color: '#ca8a04' },
            ].map((s, i) => (
              <motion.div key={s.label} {...springIn(i * 0.08)} className="text-center">
                <p className="text-3xl md:text-4xl font-black tracking-tight mb-1" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[#1a2e05] text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-[#6b7280] text-[10px] uppercase tracking-wider">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...springIn(0)} className="text-center mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#65a30d' }}>Browse By Type</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>Research Categories</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Peptides',       icon: <FlaskConical size={26} />, accent: '#84cc16', bg: '#f0fdf4', href: '/products' },
              { name: 'GLP-1 Agonists', icon: <Zap size={26} />,          accent: '#ca8a04', bg: '#fefce8', href: '/products' },
              { name: 'Semaglutide',    icon: <Microscope size={26} />,    accent: '#84cc16', bg: '#f0fdf4', href: '/products' },
              { name: 'Research Kits',  icon: <Package size={26} />,       accent: '#ca8a04', bg: '#fefce8', href: '/products' },
            ].map((cat, i) => (
              <motion.div key={cat.name} {...springIn(i * 0.07)}>
                <Link href={cat.href}
                  className="group flex flex-col items-center gap-4 p-8 rounded-2xl text-center transition-all duration-300"
                  style={{ background: cat.bg, border: `1.5px solid ${cat.accent}22` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${cat.accent}22` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
                >
                  <motion.div whileHover={{ scale: 1.10, rotate: 4 }} transition={{ type: 'spring' as const, stiffness: 300 }}
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: 'white', border: `1.5px solid ${cat.accent}30`, color: cat.accent, boxShadow: `0 4px 16px ${cat.accent}18` }}>
                    {cat.icon}
                  </motion.div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-tight" style={{ color: '#1a2e05' }}>{cat.name}</p>
                    <p className="text-[10px] mt-1 font-bold uppercase tracking-widest" style={{ color: cat.accent }}>
                      Explore →
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="py-24" style={{ background: '#f7fee7', borderTop: '1px solid rgba(132,204,22,0.10)', borderBottom: '1px solid rgba(132,204,22,0.10)' }}>
        <div className="container mx-auto px-6">
          <motion.div {...springIn(0)} className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-[#65a30d] text-[10px] font-black uppercase tracking-[0.3em] mb-3">Catalogue</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>Best Selling Products</h2>
            <p className="text-[#4b7c59] text-sm mt-3 max-w-md mx-auto">Every compound is HPLC-verified with a Certificate of Analysis included.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Brand card */}
            <motion.div
              {...springIn(0)}
              whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(132,204,22,0.22)' }}
              className="rounded-2xl p-10 flex flex-col justify-end min-h-[420px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '1.5px solid rgba(132,204,22,0.25)',
                boxShadow: '0 4px 24px rgba(132,204,22,0.10)',
                transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-8 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: 'rgba(132,204,22,0.10)' }} />
              <div className="relative z-10">
                <Shield size={32} style={{ color: '#84cc16', marginBottom: '24px' }} />
                <h3 className="text-3xl font-black leading-tight" style={{ color: '#14532d' }}>
                  Retatrutide<br />
                  <span style={{ color: '#84cc16' }}>Research</span><br />
                  <span style={{ color: '#ca8a04' }}>Center</span>
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest mt-4" style={{ color: '#65a30d' }}>Certified RRC ✓</p>
              </div>
            </motion.div>

            {products.map((product, i) => (
              <motion.div
                key={product.id}
                {...springIn((i + 1) * 0.08)}
                whileHover={{ y: -5 }}
                className="group lg-card rounded-2xl p-6 flex flex-col"
                style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
              >
                <div className="w-full h-0.5 rounded-t mb-4"
                  style={{ background: i % 2 === 0 ? '#84cc16' : '#facc15' }} />
                <Link href={`/products/${product.id}`} className="block aspect-square mb-4 overflow-hidden rounded-xl bg-[#f7fee7]"
                  style={{ border: '1px solid rgba(132,204,22,0.12)' }}>
                  <motion.img
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                    src={product.main_image_url}
                    className="w-full h-full object-contain p-4"
                    alt={product.name}
                  />
                </Link>
                {product.on_sale && (
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full mb-2 w-fit"
                    style={{ background: 'rgba(202,138,4,0.12)', color: '#ca8a04', border: '1px solid rgba(202,138,4,0.25)' }}>
                    Promo
                  </span>
                )}
                <p className="text-[10px] font-bold uppercase mb-1" style={{ color: '#65a30d' }}>
                  {product.category_name || 'Research Grade'}
                </p>
                <Link href={`/products/${product.id}`}>
                  <h4 className="font-black text-sm mb-3 leading-tight group-hover:text-[#65a30d] transition-colors" style={{ color: '#1a2e05' }}>
                    {product.name}
                  </h4>
                </Link>
                <p className="font-black text-xl mb-4" style={{ color: '#ca8a04' }}>£{product.price}</p>
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 lg-btn-accent py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={13} /> Add To Cart
                  </button>
                  <Link href={`/products/${product.id}`}
                    className="lg-btn px-3 py-3 rounded-xl flex items-center justify-center">
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...springIn(0.4)} className="text-center mt-10">
            <Link href="/products"
              className="inline-flex items-center gap-2 lg-btn px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest">
              View All Products <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── COMPOUND SPOTLIGHT ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...springIn(0)} className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#65a30d' }}>Research Focus</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
              Retatrutide — Triple Agonist
            </h2>
            <p className="text-[#4b7c59] text-sm mt-3 max-w-xl mx-auto leading-relaxed">
              A GLP-1/GIP/Glucagon triple receptor agonist showing remarkable efficacy in metabolic research studies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: <FlaskConical size={28} />, title: 'Mechanism of Action', desc: 'Simultaneously activates GLP-1, GIP, and glucagon receptors — producing synergistic metabolic effects in research models.', tag: 'Triple Agonist', accent: '#84cc16', tagBg: 'rgba(132,204,22,0.12)' },
              { icon: <Microscope size={28} />,   title: '≥99% Purity',         desc: 'Every batch undergoes rigorous HPLC analysis. Certificate of Analysis (CoA) included with each shipment for full traceability.', tag: 'HPLC Verified', accent: '#ca8a04', tagBg: 'rgba(250,204,21,0.14)' },
              { icon: <Globe size={28} />,        title: 'Research Applications', desc: 'Used in obesity, diabetes, NASH, and cardiovascular metabolic research. Supplied exclusively for laboratory and in-vitro studies.', tag: 'Lab Use Only', accent: '#84cc16', tagBg: 'rgba(132,204,22,0.12)' },
            ].map((card, i) => (
              <motion.div key={i} {...springIn(i * 0.1)}
                whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(132,204,22,0.16)' }}
                className="lg-card rounded-2xl p-8 relative overflow-hidden"
                style={{ transition: 'box-shadow 0.3s ease, transform 0.3s ease' }}
              >
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ background: card.accent }} />
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: card.tagBg, border: `1px solid ${card.accent}40`, color: card.accent }}>
                  {card.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 inline-block"
                  style={{ color: card.accent, background: card.tagBg, border: `1px solid ${card.accent}35` }}>
                  {card.tag}
                </span>
                <h3 className="text-base font-black uppercase tracking-tight mb-3" style={{ color: '#1a2e05' }}>{card.title}</h3>
                <p className="text-[#4b7c59] text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Property chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Molecular Weight', val: '4,667.4 Da',        accent: '#65a30d' },
              { label: 'Form',             val: 'Lyophilized Powder', accent: '#ca8a04' },
              { label: 'Storage',          val: '-20°C Recommended',  accent: '#65a30d' },
              { label: 'Solubility',       val: 'Aqueous Buffer',     accent: '#ca8a04' },
            ].map((p, i) => (
              <motion.div key={i} {...springIn(0.3 + i * 0.06)}
                className="bg-white rounded-xl p-5 text-center"
                style={{ border: '1px solid rgba(132,204,22,0.14)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <p className="text-[#6b7280] text-[9px] font-black uppercase tracking-widest mb-2">{p.label}</p>
                <p className="font-black text-sm" style={{ color: p.accent }}>{p.val}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24" style={{ background: '#f7fee7', borderTop: '1px solid rgba(132,204,22,0.10)', borderBottom: '1px solid rgba(132,204,22,0.10)' }}>
        <div className="container mx-auto px-6">
          <motion.div {...springIn(0)} className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#ca8a04' }}>Process</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>How It Works</h2>
            <p className="text-[#4b7c59] text-sm mt-3 max-w-md mx-auto">From selection to delivery in three simple steps.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', icon: <Package size={32} />, title: 'Select Your Compound', desc: 'Browse our catalogue of research-grade peptides. Each product includes a full CoA and purity report.', accent: '#84cc16', bg: '#f0fdf4' },
              { step: '02', icon: <Lock size={32} />,    title: 'Secure Checkout',       desc: 'Complete your order through our encrypted checkout. All data is secured with SSL and processed discreetly.', accent: '#ca8a04', bg: '#fefce8' },
              { step: '03', icon: <Truck size={32} />,   title: 'Fast Delivery',         desc: 'Temperature-controlled, discreet packaging. Tracked worldwide with an average 3–5 business day delivery.', accent: '#84cc16', bg: '#f0fdf4' },
            ].map((step, i) => (
              <motion.div key={i} {...springIn(i * 0.12)} className="flex flex-col items-center text-center relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+60px)] right-0 h-px border-t border-dashed"
                    style={{ borderColor: 'rgba(132,204,22,0.35)' }} />
                )}
                <motion.div whileHover={{ scale: 1.08, rotate: 3 }} transition={{ type: 'spring' as const, stiffness: 300 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                  style={{ background: step.bg, border: `1.5px solid ${step.accent}40`, color: step.accent, boxShadow: `0 4px 20px ${step.accent}20` }}
                >
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-[9px] font-black flex items-center justify-center"
                    style={{ background: step.accent }}>
                    {step.step}
                  </span>
                </motion.div>
                <h3 className="text-base font-black uppercase tracking-tight mb-3" style={{ color: '#1a2e05' }}>{step.title}</h3>
                <p className="text-[#4b7c59] text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO / EVALUATION ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div {...springIn(0)} className="lg:w-1/2">
              <div className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-xl lg-badge mb-8">
                <Shield size={13} className="text-[#65a30d]" />
                <span className="text-[9px] font-black uppercase tracking-wider text-[#65a30d]">Research Program</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
                Retatrutide —<br />
                <span style={{ color: '#ca8a04' }}>Pre-Filled Pen</span><br />
                Evaluation
              </h2>
              <p className="text-[#4b7c59] leading-relaxed mb-6 max-w-lg">
                Part of <span className="font-bold" style={{ color: '#65a30d' }}>Retatrutide Research Center&apos;s</span> ongoing research program into advanced GLP-1 multi-agonist compounds. Supplied in controlled batches for laboratory analysis of stability, compound behaviour, and injector system performance.
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#9ca3af] mb-10">
                Not for human or veterinary consumption.
              </p>
              <div className="flex gap-3">
                <Link href="/about"
                  className="inline-flex items-center gap-3 lg-btn-accent px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">
                  About Store <ArrowRight size={14} />
                </Link>
                <Link href="/products"
                  className="inline-flex items-center gap-3 lg-btn px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">
                  Shop Now
                </Link>
              </div>
            </motion.div>

            <motion.div {...springIn(0.1)} className="lg:w-1/2 relative">
              <div className="absolute inset-[-8%] rounded-[40%_60%_70%_30%/40%_50%_60%_70%] pointer-events-none -z-10"
                style={{ background: 'rgba(132,204,22,0.06)' }} />
              <motion.div whileHover={{ boxShadow: '0 20px 60px rgba(132,204,22,0.22)' }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden"
                style={{ aspectRatio: '16/9', border: '1.5px solid rgba(132,204,22,0.20)', boxShadow: '0 8px 40px rgba(132,204,22,0.12)' }}
              >
                <video autoPlay muted loop playsInline preload="metadata"
                  poster="/assets/molecule-poster.webp"
                  className="w-full h-full object-cover">
                  <source src="/assets/molecule.mp4" type="video/mp4" />
                  <div className="w-full h-full flex items-center justify-center" style={{ background: '#f0fdf4' }}>
                    <FlaskConical size={48} style={{ color: '#84cc16', opacity: 0.5 }} />
                  </div>
                </video>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="py-10" style={{ background: '#f0fdf4', borderTop: '1px solid rgba(132,204,22,0.10)', borderBottom: '1px solid rgba(132,204,22,0.10)' }}>
        <div className="container mx-auto px-6">
          <motion.div
            {...springIn(0)}
            whileHover={{ boxShadow: '0 20px 60px rgba(132,204,22,0.20)' }}
            className="rounded-3xl overflow-hidden flex flex-col md:flex-row items-center relative min-h-[340px]"
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '1.5px solid rgba(132,204,22,0.22)',
              boxShadow: '0 8px 40px rgba(132,204,22,0.10)',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5"
              style={{ background: 'linear-gradient(90deg, #84cc16 0%, #facc15 50%, #84cc16 100%)' }} />
            <div className="flex-1 p-12 lg:p-16 z-10 relative">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full mb-6 inline-block"
                style={{ background: 'rgba(202,138,4,0.12)', color: '#ca8a04', border: '1px solid rgba(202,138,4,0.25)' }}>
                Limited Offer
              </span>
              <h3 className="text-4xl md:text-5xl font-black mb-4 leading-none tracking-tight" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
                No Prep. No Hassle.<br />
                <span style={{ color: '#84cc16' }}>Just Precision.</span>
              </h3>
              <p className="text-2xl font-black mb-8" style={{ color: '#ca8a04' }}>Up to 35% off today</p>
              <Link href="/products"
                className="inline-flex items-center gap-3 lg-btn-accent px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest">
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1 w-full h-full min-h-[340px] flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}>
              <div className="absolute left-0 top-0 bottom-0 w-16 hidden md:block"
                style={{ background: 'linear-gradient(90deg, #dcfce7, transparent)' }} />
              <div className="relative z-10 flex flex-col items-center gap-4 p-8">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Purity', val: '≥99%', accent: '#65a30d' },
                    { label: 'In Stock', val: 'Ships Today', accent: '#ca8a04' },
                    { label: 'CoA', val: 'Included', accent: '#65a30d' },
                    { label: 'Delivery', val: '3–5 Days', accent: '#ca8a04' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white rounded-xl p-4 text-center"
                      style={{ border: `1px solid ${item.accent}20`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>{item.label}</p>
                      <p className="text-sm font-black" style={{ color: item.accent }}>{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div {...springIn(0)} className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#65a30d' }}>Reviews</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
              Trusted by Researchers
            </h2>
            <p className="text-[#4b7c59] text-sm mt-3">What our research partners say.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Dr. Sarah M.',
                role: 'Metabolic Research Institute',
                text: 'Exceptional purity and consistency across every batch. The CoA documentation is thorough and the delivery was faster than expected. Our gold standard supplier.',
                rating: 5,
                accent: '#84cc16',
              },
              {
                name: 'Prof. James R.',
                role: 'University Lab, Edinburgh',
                text: 'The Retatrutide compound arrived perfectly lyophilized. Reconstitution was flawless. Results in our in-vitro study matched published data exactly. Outstanding quality.',
                rating: 5,
                accent: '#ca8a04',
              },
              {
                name: 'Dr. Elena K.',
                role: 'Endocrinology Research Group',
                text: 'Fast, discreet, and reliable. The purity levels are consistently above what we see elsewhere. RRC has become our go-to for all GLP-1 research compounds.',
                rating: 5,
                accent: '#84cc16',
              },
            ].map((review, i) => (
              <motion.div key={i} {...springIn(i * 0.1)}
                whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(132,204,22,0.14)' }}
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background: '#fff',
                  border: '1.5px solid rgba(132,204,22,0.14)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: review.accent }} />
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={14} fill={s < review.rating ? '#facc15' : 'none'}
                      stroke={s < review.rating ? '#facc15' : '#d1d5db'} />
                  ))}
                </div>
                <p className="text-[#4b7c59] text-sm leading-relaxed mb-6 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black"
                    style={{ background: review.accent }}>
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-xs" style={{ color: '#1a2e05' }}>{review.name}</p>
                    <p className="text-[10px]" style={{ color: '#9ca3af' }}>{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Aggregate rating */}
          <motion.div {...springIn(0.3)} className="flex items-center justify-center gap-6 mt-12 pt-12"
            style={{ borderTop: '1px solid rgba(132,204,22,0.12)' }}>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#facc15" stroke="#facc15" />
              ))}
            </div>
            <div>
              <p className="font-black text-xl" style={{ color: '#1a2e05' }}>4.9 / 5.0</p>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Based on 128 verified reviews</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="py-16" style={{ background: '#f7fee7', borderTop: '1px solid rgba(132,204,22,0.10)', borderBottom: '1px solid rgba(132,204,22,0.10)' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <CheckCircle2 size={22} />, title: 'Lab Certified',     desc: 'Every batch CoA included',   accent: '#65a30d', bg: '#f0fdf4' },
              { icon: <Lock size={22} />,          title: 'Encrypted Orders',  desc: 'SSL & secure checkout',      accent: '#ca8a04', bg: '#fefce8' },
              { icon: <Truck size={22} />,         title: 'Discreet Shipping', desc: 'Plain packaging worldwide',  accent: '#65a30d', bg: '#f0fdf4' },
              { icon: <RotateCcw size={22} />,     title: 'Quality Guarantee', desc: 'Full purity or replacement', accent: '#ca8a04', bg: '#fefce8' },
            ].map((item, i) => (
              <motion.div key={i} {...springIn(i * 0.08)} className="flex items-start gap-4">
                <motion.div whileHover={{ scale: 1.10 }} transition={{ type: 'spring' as const, stiffness: 400 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: item.bg, border: `1px solid ${item.accent}30`, color: item.accent, boxShadow: `0 2px 12px ${item.accent}18` }}>
                  {item.icon}
                </motion.div>
                <div>
                  <p className="font-black text-xs uppercase tracking-wider mb-1" style={{ color: '#1a2e05' }}>{item.title}</p>
                  <p className="text-[#6b7280] text-[11px]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div {...springIn(0)}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: 'linear-gradient(135deg, #f0fdf4, #f7fee7)', border: '1.5px solid rgba(132,204,22,0.20)', boxShadow: '0 4px 20px rgba(132,204,22,0.15)' }}>
              <Mail size={26} style={{ color: '#65a30d' }} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#65a30d' }}>Stay Updated</p>
            <h2 className="text-4xl font-black tracking-tight mb-4" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
              Research Insights
            </h2>
            <p className="text-[#4b7c59] text-sm leading-relaxed mb-10 max-w-md mx-auto">
              Get the latest peptide research updates, new compound arrivals, and exclusive offers delivered to your inbox.
            </p>
          </motion.div>

          <motion.div {...springIn(0.1)}>
            <AnimatePresence mode="wait">
              {!emailSent ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}
                  onSubmit={(e) => { e.preventDefault(); if (email) setEmailSent(true) }}
                  className="flex gap-3 max-w-md mx-auto"
                >
                  <div className="flex-1 relative">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#84cc16' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-11 pr-4 py-4 rounded-xl text-sm font-medium outline-none text-[#1a2e05] placeholder:text-[#9ca3af]"
                      style={{ background: '#f7fee7', border: '1.5px solid rgba(132,204,22,0.22)' }}
                      onFocus={e => { e.target.style.borderColor = '#84cc16'; e.target.style.boxShadow = '0 0 0 3px rgba(132,204,22,0.10)' }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(132,204,22,0.22)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <button type="submit"
                    className="lg-btn-accent px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 whitespace-nowrap">
                    Subscribe <Send size={13} />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring' as const, bounce: 0.3 }}
                  className="flex items-center justify-center gap-3 py-4"
                >
                  <CheckCircle2 size={22} style={{ color: '#65a30d' }} />
                  <p className="font-black text-sm" style={{ color: '#1a2e05' }}>
                    You&apos;re subscribed! Welcome to the RRC research community.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-[10px] text-[#9ca3af] mt-4">No spam, ever. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-32 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f7fee7 50%, #fefce8 100%)', borderTop: '1px solid rgba(132,204,22,0.10)' }}>
        <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full pointer-events-none"
          style={{ background: 'rgba(132,204,22,0.10)', filter: 'blur(60px)' }} />
        <motion.div animate={{ scale: [1, 1.10, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[160px] rounded-full pointer-events-none"
          style={{ background: 'rgba(250,204,21,0.12)', filter: 'blur(50px)' }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #84cc16 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.p {...springIn(0)} className="text-[10px] font-black uppercase tracking-[0.35em] mb-6" style={{ color: '#65a30d' }}>
            A Research Haven for Scientific Excellence
          </motion.p>

          <motion.h2 {...springIn(0.08)}
            className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-6 leading-none"
            style={{ color: '#1a2e05', letterSpacing: '-0.04em' }}>
            <span style={{ color: '#84cc16' }}>RETATRUTIDE</span><br />
            RESEARCH<br />
            <span style={{ color: '#ca8a04' }}>CENTER</span>
          </motion.h2>

          <motion.p {...springIn(0.16)}
            className="text-xl md:text-2xl font-medium mb-12 tracking-tight max-w-2xl"
            style={{ color: '#4b7c59' }}
          >
            Engineered for research precision. Delivered with integrity.
          </motion.p>

          <motion.div {...springIn(0.24)} className="flex gap-4 flex-wrap justify-center">
            <Link href="/products"
              className="group lg-btn-accent inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-[12px] tracking-[0.15em]">
              Shop RRC Products
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>
            <Link href="/about"
              className="group lg-btn-yellow inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-[12px] tracking-[0.15em]">
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* ── CART POPUP ── */}
      <AnimatePresence>
        {addedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-[300] backdrop-blur-sm"
              onClick={() => setAddedProduct(null)} />
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: 'spring' as const, bounce: 0.4, duration: 0.6 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm z-[310] rounded-3xl p-8 text-center"
              style={{ background: '#fff', border: '1.5px solid rgba(132,204,22,0.25)', boxShadow: '0 24px 80px rgba(132,204,22,0.20), 0 8px 32px rgba(0,0,0,0.10)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(132,204,22,0.10)' }}>
                <CheckCircle2 size={24} style={{ color: '#65a30d' }} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#65a30d' }}>Added to cart</p>
              <img src={addedProduct.main_image_url} className="w-20 h-20 mx-auto object-contain mb-3" alt={addedProduct.name} />
              <h6 className="font-black text-sm mb-6" style={{ color: '#1a2e05' }}>{addedProduct.name}</h6>
              <div className="flex gap-3">
                <button onClick={() => setAddedProduct(null)}
                  className="flex-1 lg-btn-accent py-3 rounded-xl font-black uppercase text-[10px]">
                  Continue
                </button>
                <Link href="/cart" onClick={() => setAddedProduct(null)}
                  className="flex-1 lg-btn py-3 rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2">
                  Cart <ShoppingCart size={13} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 28s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
