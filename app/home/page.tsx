'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  ShoppingCart, ArrowRight, Lock,
  ChevronDown, FlaskConical, Microscope, Globe,
  CheckCircle, Package, Truck, RotateCcw,
  Star, Zap, Shield
} from 'lucide-react'
import { useInView } from '@/hooks/useInView'

interface Product {
  id: string
  name: string
  price: number
  main_image_url: string
  category_name?: string
}

const springIn = (delay = 0) => ({
  initial: { opacity: 0, y: 28, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true as const },
  transition: { type: 'spring' as const, bounce: 0.28, duration: 1.2, delay },
})

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [addedProduct, setAddedProduct] = useState<Product | null>(null)

  const [statsRef, statsInView]         = useInView<HTMLElement>()
  const [sellersRef, sellersInView]     = useInView<HTMLElement>()
  const [spotlightRef, spotlightInView] = useInView<HTMLElement>()
  const [howRef, howInView]             = useInView<HTMLElement>()
  const [evalRef, evalInView]           = useInView<HTMLElement>()
  const [promoRef, promoInView]         = useInView<HTMLElement>()
  const [trustRef, trustInView]         = useInView<HTMLElement>()
  const [ctaRef, ctaInView]             = useInView<HTMLElement>()

  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true).limit(3)
      .then(({ data }) => setProducts((data as Product[]) || []))
  }, [])

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as Array<Product & { quantity: number }>
    const existing = cart.find((i) => i.id === product.id)
    if (existing) { existing.quantity += 1 } else { cart.push({ ...product, quantity: 1 }) }
    localStorage.setItem('cart', JSON.stringify(cart))
    setAddedProduct(product)
    window.dispatchEvent(new Event('storage'))
  }

  const fadeUp = (inView: boolean, delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  })

  return (
    <div className="min-h-screen bg-white text-[#14532d] overflow-x-hidden">
      <Header />

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f7fee7 0%, #ecfdf5 40%, #fffde7 70%, #f0fdf4 100%)' }}>

        {/* Animated background blobs */}
        <motion.div
          animate={{ scale: [1, 1.20, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-15%] left-[-8%] w-[700px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.16) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-[-8%] right-[-5%] w-[600px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.14) 0%, transparent 70%)' }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#65a30d 1px, transparent 1px), linear-gradient(90deg, #65a30d 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container mx-auto px-4 relative z-10 flex items-center justify-between">
          {/* Left arch */}
          <motion.div
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 1.4 }}
            className="hidden lg:block w-[280px] h-[300px] rounded-t-full overflow-hidden flex-shrink-0"
            style={{
              background: 'linear-gradient(145deg, #dcfce7 0%, #bbf7d0 100%)',
              border: '1.5px solid rgba(132,204,22,0.28)',
              boxShadow: '0 8px 48px rgba(132,204,22,0.16), inset 0 1px 0 rgba(255,255,255,0.80)',
            }}
          >
            <img src="/hero-right-arch.png" className="w-full h-full object-contain p-1 scale-110" alt="" />
          </motion.div>

          {/* Center content */}
          <div className="flex flex-col items-center text-center flex-grow px-4 md:px-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 1, delay: 0.1 }}
              className="flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full lg-badge"
            >
              <motion.span
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[#84cc16]"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#65a30d]">Advanced Peptide Research</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', bounce: 0.25, duration: 1.4, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.88] tracking-[-0.06em] uppercase mb-6"
              style={{ color: '#1a2e05' }}
            >
              RETATRUTIDE<br />
              <span style={{ color: '#84cc16' }}>RESEARCH</span><br />
              <span style={{ color: '#eab308' }}>CENTER</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 1.2, delay: 0.38 }}
              className="text-base md:text-xl text-[#4b7c59] font-medium tracking-tight mb-10 max-w-md"
            >
              Advancing GLP-1 peptide science through precision synthesis, clinical-grade purity, and global research distribution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 1.1, delay: 0.52 }}
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
          </div>

          {/* Right arch */}
          <motion.div
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 1.4 }}
            className="hidden lg:block w-[280px] h-[300px] rounded-t-full overflow-hidden flex-shrink-0"
            style={{
              background: 'linear-gradient(145deg, #fefce8 0%, #fef9c3 100%)',
              border: '1.5px solid rgba(250,204,21,0.32)',
              boxShadow: '0 8px 48px rgba(250,204,21,0.16), inset 0 1px 0 rgba(255,255,255,0.80)',
            }}
          >
            <img src="/hero-left-arch.png" className="w-full h-full object-contain p-1 scale-110" alt="" />
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown size={28} className="text-[#84cc16] opacity-60" />
        </motion.div>

        {/* Marquee bar */}
        <div className="absolute bottom-0 w-full py-3 z-20 overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #84cc16 0%, #65a30d 50%, #84cc16 100%)' }}>
          <div className="flex whitespace-nowrap animate-marquee">
            {[1, 2, 3].map((i) => (
              <span key={i} className="font-black text-[11px] uppercase tracking-[0.3em] mx-10 text-white">
                ★ Fast Shipping on orders above $100 ★&nbsp;
                <span className="text-[#fef08a]">100% Lab Tested</span>
                &nbsp;★ Pure Compounds ★ GLP-1 Research Grade ★
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section ref={statsRef as React.RefObject<HTMLElement>}
        className="py-14" style={{ background: '#f0fdf4', borderBottom: '1px solid rgba(132,204,22,0.12)' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '3M+',   label: 'Compounds Studied',  sub: 'cumulative research data', color: '#65a30d' },
              { val: '99.8%', label: 'Purity Rate',        sub: 'HPLC verified batches',    color: '#ca8a04' },
              { val: '50+',   label: 'Countries Served',   sub: 'global distribution',      color: '#65a30d' },
              { val: '4.7k+', label: 'Research Partners',  sub: 'institutions & labs',      color: '#ca8a04' },
            ].map((s, i) => (
              <motion.div key={s.label} {...springIn(i * 80)} className="text-center">
                <p className="text-3xl md:text-4xl font-black tracking-tight mb-1" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[#1a2e05] text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-[#6b7280] text-[10px] uppercase tracking-wider">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section ref={sellersRef as React.RefObject<HTMLElement>} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16" style={fadeUp(sellersInView)}>
            <p className="text-[#65a30d] text-[10px] font-black uppercase tracking-[0.3em] mb-3">Catalogue</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ color: '#1a2e05' }}>Best Selling Products</h2>
          </div>

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
              <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />
              <div className="absolute top-8 right-8 opacity-10">
                <img src="/leaf-bg.png" className="w-28" alt="" />
              </div>
              <div className="relative z-10">
                <img src="/leaf-white.png" className="w-8 mb-6 opacity-70" alt="" />
                <h3 className="text-3xl font-black leading-tight" style={{ color: '#14532d' }}>
                  Retatrutide<br />
                  <span style={{ color: '#84cc16' }}>Research</span><br />
                  <span style={{ color: '#ca8a04' }}>Center</span>
                </h3>
              </div>
            </motion.div>

            {products.map((product, i) => (
              <motion.div
                key={product.id}
                {...springIn((i + 1) * 80)}
                whileHover={{ y: -5 }}
                className="group lg-card rounded-2xl p-6 flex flex-col"
              >
                <div className="w-full h-0.5 rounded-t mb-4"
                  style={{ background: i % 2 === 0 ? '#84cc16' : '#facc15' }} />
                <div className="aspect-square mb-6 overflow-hidden rounded-xl bg-[#f7fee7] border border-[rgba(132,204,22,0.12)]">
                  <motion.img
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    src={product.main_image_url}
                    className="w-full h-full object-contain p-4"
                    alt={product.name}
                  />
                </div>
                <p className="text-[10px] font-bold uppercase mb-1" style={{ color: '#65a30d' }}>
                  {product.category_name || 'Uncategorized'}
                </p>
                <h4 className="font-bold text-sm mb-4 h-10" style={{ color: '#1a2e05' }}>{product.name}</h4>
                <p className="font-black text-lg mb-6" style={{ color: '#ca8a04' }}>${product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full lg-btn py-3 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} /> Add To Cart
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div {...springIn(400)} className="text-center mt-10">
            <Link href="/products"
              className="inline-flex items-center gap-2 lg-btn px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest">
              View All Products <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── COMPOUND SPOTLIGHT ── */}
      <section ref={spotlightRef as React.RefObject<HTMLElement>}
        className="py-24"
        style={{ background: '#f7fee7', borderTop: '1px solid rgba(132,204,22,0.10)', borderBottom: '1px solid rgba(132,204,22,0.10)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" style={fadeUp(spotlightInView)}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#65a30d' }}>Research Focus</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ color: '#1a2e05' }}>Retatrutide — Triple Agonist</h2>
            <p className="text-[#4b7c59] text-sm mt-3 max-w-xl mx-auto leading-relaxed">
              A GLP-1/GIP/Glucagon triple receptor agonist showing remarkable efficacy in metabolic research studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <FlaskConical size={28} />, title: 'Mechanism of Action', desc: 'Simultaneously activates GLP-1, GIP, and glucagon receptors — producing synergistic metabolic effects in research models.', tag: 'Triple Agonist', accent: '#84cc16', tagBg: 'rgba(132,204,22,0.12)' },
              { icon: <Microscope size={28} />, title: '≥99% Purity', desc: 'Every batch undergoes rigorous HPLC analysis. Certificate of Analysis (CoA) included with each shipment for full traceability.', tag: 'HPLC Verified', accent: '#ca8a04', tagBg: 'rgba(250,204,21,0.14)' },
              { icon: <Globe size={28} />, title: 'Research Applications', desc: 'Used in obesity, diabetes, NASH, and cardiovascular metabolic research. Supplied exclusively for laboratory and in-vitro studies.', tag: 'Lab Use Only', accent: '#84cc16', tagBg: 'rgba(132,204,22,0.12)' },
            ].map((card, i) => (
              <motion.div
                key={i}
                {...springIn(i * 100)}
                whileHover={{ y: -4 }}
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Molecular Weight', val: '4,667.4 Da',        accent: '#65a30d' },
              { label: 'Form',             val: 'Lyophilized Powder', accent: '#ca8a04' },
              { label: 'Storage',          val: '-20°C Recommended',  accent: '#65a30d' },
              { label: 'Solubility',       val: 'Aqueous Buffer',     accent: '#ca8a04' },
            ].map((p, i) => (
              <motion.div key={i} {...springIn(300 + i * 60)}
                className="bg-white rounded-xl p-5 text-center"
                style={{ border: '1px solid rgba(132,204,22,0.14)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <p className="text-[#6b7280] text-[9px] font-black uppercase tracking-widest mb-2">{p.label}</p>
                <p className="font-black text-sm" style={{ color: p.accent }}>{p.val}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={howRef as React.RefObject<HTMLElement>} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" style={fadeUp(howInView)}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#ca8a04' }}>Process</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ color: '#1a2e05' }}>How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', icon: <Package size={32} />, title: 'Select Your Compound', desc: 'Browse our catalogue of research-grade peptides. Each product includes a full CoA and purity report.', accent: '#84cc16', bg: '#f0fdf4' },
              { step: '02', icon: <Lock size={32} />,    title: 'Secure Order',          desc: 'Complete your order through our encrypted checkout. All data is secured with SSL and processed discreetly.', accent: '#ca8a04', bg: '#fefce8' },
              { step: '03', icon: <Truck size={32} />,   title: 'Fast Delivery',         desc: 'Temperature-controlled, discreet packaging. Tracked worldwide with an average 3–5 business day delivery.', accent: '#84cc16', bg: '#f0fdf4' },
            ].map((step, i) => (
              <motion.div key={i} {...springIn(i * 120)} className="flex flex-col items-center text-center relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+60px)] right-0 h-px border-t border-dashed"
                    style={{ borderColor: 'rgba(132,204,22,0.30)' }} />
                )}
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
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

      {/* ── RETATRUTIDE EVALUATION ── */}
      <section ref={evalRef as React.RefObject<HTMLElement>}
        className="py-24"
        style={{ background: '#f0fdf4', borderTop: '1px solid rgba(132,204,22,0.10)', borderBottom: '1px solid rgba(132,204,22,0.10)', ...fadeUp(evalInView) }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-8"
                style={{ background: 'linear-gradient(135deg, #84cc16, #65a30d)', boxShadow: '0 8px 32px rgba(132,204,22,0.30)' }}>
                <img src="/leaf-white.png" className="w-6 h-6" alt="" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter" style={{ color: '#1a2e05' }}>
                Retatrutide – Pre-Filled Pen<br />
                <span style={{ color: '#ca8a04' }}>Evaluation</span>
              </h2>
              <p className="text-[#4b7c59] leading-relaxed mb-6 max-w-lg">
                Part of <span className="font-bold" style={{ color: '#65a30d' }}>Retatrutide Research Center&apos;s</span> ongoing research program into advanced GLP-1 multi-agonist compounds. Supplied in controlled batches for laboratory analysis.
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#9ca3af] mb-10">
                Not for human or veterinary consumption.
              </p>
              <Link href="/about"
                className="inline-flex items-center gap-3 lg-btn-accent px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">
                About Store <ArrowRight size={14} />
              </Link>
            </div>

            <div className="lg:w-1/2 relative">
              <motion.div
                whileHover={{ boxShadow: '0 20px 60px rgba(132,204,22,0.22)' }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden"
                style={{ aspectRatio: '16/9', border: '1.5px solid rgba(132,204,22,0.20)', boxShadow: '0 8px 40px rgba(132,204,22,0.12)' }}
              >
                <video autoPlay muted loop playsInline preload="metadata"
                  poster="/assets/molecule-poster.webp"
                  className="w-full h-full object-cover rounded-2xl">
                  <source src="/assets/molecule.mp4" type="video/mp4" />
                </video>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section ref={promoRef as React.RefObject<HTMLElement>} className="py-10 bg-white" style={fadeUp(promoInView)}>
        <div className="container mx-auto px-6">
          <motion.div
            whileHover={{ boxShadow: '0 20px 60px rgba(132,204,22,0.20)' }}
            className="rounded-3xl overflow-hidden flex flex-col md:flex-row items-center relative min-h-[360px]"
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '1.5px solid rgba(132,204,22,0.22)',
              boxShadow: '0 8px 40px rgba(132,204,22,0.10)',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5"
              style={{ background: 'linear-gradient(90deg, #84cc16 0%, #facc15 50%, #84cc16 100%)' }} />
            <div className="flex-1 p-12 lg:p-20 z-10 relative">
              <h3 className="text-4xl md:text-5xl font-black mb-4 leading-none tracking-tighter" style={{ color: '#1a2e05' }}>
                No Prep. No Hassle.<br />
                <span style={{ color: '#84cc16' }}>Just Precision Dosing.</span>
              </h3>
              <p className="text-2xl font-black mb-10" style={{ color: '#ca8a04' }}>Upto 35% off today!</p>
              <Link href="/products"
                className="inline-flex items-center gap-3 lg-btn-accent px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest">
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex-1 w-full h-full min-h-[360px] flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}>
              <div className="absolute left-0 top-0 bottom-0 w-24 hidden md:block"
                style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }} />
              <div className="relative z-10 flex flex-col items-center">
                <h4 className="text-8xl font-black absolute -left-20 top-1/2 -translate-y-1/2 rotate-[-90deg]"
                  style={{ color: '#84cc16', opacity: 0.12 }}>RRC</h4>
                <img src="/phone-app.png" className="w-48 lg:w-56 drop-shadow-xl translate-y-8" alt="" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section ref={trustRef as React.RefObject<HTMLElement>}
        className="py-16"
        style={{ background: '#f7fee7', borderTop: '1px solid rgba(132,204,22,0.10)', borderBottom: '1px solid rgba(132,204,22,0.10)' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <CheckCircle size={22} />, title: 'Lab Certified',     desc: 'Every batch CoA included',   accent: '#65a30d', bg: '#f0fdf4' },
              { icon: <Lock size={22} />,         title: 'Encrypted Orders',  desc: 'SSL & secure checkout',      accent: '#ca8a04', bg: '#fefce8' },
              { icon: <Truck size={22} />,        title: 'Discreet Shipping', desc: 'Plain packaging worldwide',  accent: '#65a30d', bg: '#f0fdf4' },
              { icon: <RotateCcw size={22} />,    title: 'Quality Guarantee', desc: 'Full purity or replacement', accent: '#ca8a04', bg: '#fefce8' },
            ].map((item, i) => (
              <motion.div key={i} {...springIn(i * 80)} className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.10 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: item.bg, border: `1px solid ${item.accent}30`, color: item.accent, boxShadow: `0 2px 12px ${item.accent}18` }}
                >
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

      {/* ── ADD TO CART POPUP ── */}
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
              transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[310] rounded-2xl p-8 text-center"
              style={{ background: '#fff', border: '1.5px solid rgba(132,204,22,0.25)', boxShadow: '0 24px 80px rgba(132,204,22,0.20), 0 8px 32px rgba(0,0,0,0.10)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />
              <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#65a30d' }}>Added to cart</p>
              <img src={addedProduct.main_image_url} className="w-20 h-20 mx-auto object-contain mb-4" alt={addedProduct.name} />
              <h6 className="font-bold text-sm mb-6" style={{ color: '#1a2e05' }}>{addedProduct.name}</h6>
              <div className="flex gap-4">
                <button onClick={() => setAddedProduct(null)}
                  className="flex-1 lg-btn-accent py-3 rounded-lg font-black uppercase text-[10px]">
                  Continue
                </button>
                <Link href="/cart"
                  className="flex-1 lg-btn py-3 rounded-lg font-black uppercase text-[10px] flex items-center justify-center gap-2">
                  Cart <ShoppingCart size={14} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FINAL CTA ── */}
      <section ref={ctaRef as React.RefObject<HTMLElement>}
        className="relative py-32 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f7fee7 50%, #fefce8 100%)', borderTop: '1px solid rgba(132,204,22,0.10)', ...fadeUp(ctaInView) }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full pointer-events-none"
          style={{ background: 'rgba(132,204,22,0.10)', filter: 'blur(60px)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.10, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[160px] rounded-full pointer-events-none"
          style={{ background: 'rgba(250,204,21,0.12)', filter: 'blur(50px)' }}
        />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.p {...springIn(0)} className="font-bold text-lg md:text-xl mb-8 tracking-tight" style={{ color: '#65a30d' }}>
            A Research Haven for Scientific Excellence
          </motion.p>

          <motion.div {...springIn(0.1)} className="flex items-center gap-4 mb-10">
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-[-0.04em] flex items-center gap-3 flex-wrap justify-center" style={{ color: '#1a2e05' }}>
              <span style={{ color: '#84cc16' }}>RETATRUTIDE</span>
              <img src="/leaf-white.png" className="w-12 h-12 md:w-16 md:h-16 object-contain opacity-80" alt="" />
              <span style={{ color: '#ca8a04' }}>RC</span>
            </h2>
          </motion.div>

          <motion.h3 {...springIn(0.2)}
            className="text-2xl md:text-4xl font-semibold mb-12 tracking-tight leading-tight max-w-3xl"
            style={{ color: '#4b7c59' }}>
            Engineered For Research Precision.
          </motion.h3>

          <motion.div {...springIn(0.3)} className="flex gap-4 flex-wrap justify-center">
            <Link href="/products"
              className="group lg-btn-accent inline-flex items-center gap-3 px-10 py-4 rounded-xl text-white font-bold uppercase text-[12px] tracking-[0.15em]">
              Shop RRC Products
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>
            <Link href="/about"
              className="group lg-btn-yellow inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold uppercase text-[12px] tracking-[0.15em]">
              Learn More
            </Link>
          </motion.div>
        </div>

        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #84cc16 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </section>

      <Footer />

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
