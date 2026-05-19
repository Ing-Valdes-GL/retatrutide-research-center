'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  ShoppingCart, ArrowRight, ChevronDown,
  FlaskConical, Microscope, Globe, Shield,
  CheckCircle2, Package, Truck, Lock, Star,
  Zap, Activity, BarChart3, Send,
} from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  main_image_url: string
  category_name?: string
  on_sale?: boolean
}

const ease = [0.16, 1, 0.3, 1] as const

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 32, filter: 'blur(8px)' },
  whileInView:{ opacity: 1, y: 0,  filter: 'blur(0px)' },
  viewport:   { once: true as const },
  transition: { duration: 0.75, ease, delay },
})

export default function LandingPage() {
  const [products, setProducts]     = useState<Product[]>([])
  const [addedProduct, setAddedProduct] = useState<Product | null>(null)
  const [email, setEmail]           = useState('')
  const [emailSent, setEmailSent]   = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true).limit(3)
      .then(({ data }) => setProducts((data as Product[]) || []))
  }, [])

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as Array<Product & { quantity: number }>
    const ex = cart.find(i => i.id === product.id)
    if (ex) { ex.quantity += 1 } else { cart.push({ ...product, quantity: 1 }) }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    setAddedProduct(product)
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#09090b', color: '#fafafa' }}>
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section ref={heroRef as React.RefObject<HTMLElement>}
        className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Aurora blobs */}
        <motion.div animate={{ scale: [1,1.25,1], x: [0,60,0], y: [0,-40,0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-20%] left-[-15%] w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.14) 0%, transparent 65%)' }} />
        <motion.div animate={{ scale: [1,1.18,1], x: [0,-40,0], y: [0,50,0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)' }} />
        <motion.div animate={{ scale: [1,1.3,1], rotate: [0,180,360] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.07) 0%, transparent 70%)' }} />

        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-6 relative z-10 text-center pt-24">

          {/* Eyebrow badge */}
          <motion.div initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full ds-badge mb-10 mx-auto">
            <motion.span animate={{ opacity: [1,0.3,1] }} transition={{ duration: 1.8, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full" style={{ background: '#fbbf24' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.35em]">Advanced Peptide Research — GLP-1 Triple Agonist</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity:0, y:40, filter:'blur(16px)' }}
            animate={{ opacity:1, y:0, filter:'blur(0px)' }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="text-6xl sm:text-7xl md:text-[110px] font-black uppercase leading-[0.85] tracking-[-0.05em] mb-8"
          >
            <span style={{ color: '#fafafa' }}>RETA</span>
            <span className="ds-text-gradient">TRUTIDE</span>
            <br />
            <span className="text-4xl sm:text-5xl md:text-7xl font-black tracking-[-0.04em]" style={{ color: '#27272a' }}>RESEARCH</span>
            <span className="text-4xl sm:text-5xl md:text-7xl font-black tracking-[-0.04em] ml-4" style={{ color: '#3f3f46' }}>CENTER</span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration: 0.7, ease, delay: 0.38 }}
            className="text-base md:text-xl max-w-xl mx-auto leading-relaxed mb-12 ds-mono"
            style={{ color: '#71717a' }}
          >
            ≥99% HPLC-verified GLP-1/GIP/Glucagon triple agonist compounds.<br />
            Supplied exclusively for laboratory and in-vitro research.
          </motion.p>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration: 0.7, ease, delay: 0.52 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products"
              className="group ds-btn-primary inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-sm tracking-[0.12em]">
              Shop Compounds
              <ArrowRight size={17} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link href="/about"
              className="ds-btn-secondary inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-sm tracking-[0.12em]">
              Our Research
            </Link>
          </motion.div>

          {/* Floating stat pills */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-16">
            {[
              { val: '≥99%', label: 'Purity' },
              { val: 'CoA',  label: 'Included' },
              { val: '50+',  label: 'Countries' },
              { val: '3–5d', label: 'Delivery' },
            ].map(s => (
              <div key={s.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full ds-badge-glass text-xs font-bold">
                <span className="ds-mono font-black" style={{ color: '#f59e0b' }}>{s.val}</span>
                <span style={{ color: '#71717a' }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0,10,0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown size={24} style={{ color: '#3f3f46' }} />
        </motion.div>

        {/* Bottom marquee */}
        <div className="absolute bottom-0 w-full py-3 z-20 overflow-hidden"
          style={{ background: 'rgba(217,119,6,0.10)', borderTop: '1px solid rgba(217,119,6,0.20)', borderBottom: '1px solid rgba(217,119,6,0.20)' }}>
          <div className="flex whitespace-nowrap animate-marquee">
            {[1,2,3,4].map(i => (
              <span key={i} className="text-[10px] font-black uppercase tracking-[0.35em] mx-12 ds-mono" style={{ color: '#d97706' }}>
                ★ FREE SHIPPING ABOVE $100 ★ HPLC VERIFIED ★ COA INCLUDED ★ LAB USE ONLY ★ GLOBAL DELIVERY ★&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section style={{ background: '#111113', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '3M+',   label: 'Compounds Studied',  color: '#f59e0b' },
              { val: '99.8%', label: 'Average Purity',     color: '#34d399' },
              { val: '50+',   label: 'Countries Served',   color: '#f59e0b' },
              { val: '4.7k+', label: 'Research Partners',  color: '#34d399' },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)} className="text-center">
                <p className="text-4xl md:text-5xl font-black tracking-tight mb-2 ds-mono" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#52525b' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS — BENTO GRID ─────────────────────────── */}
      <section className="py-28" style={{ background: '#09090b' }}>
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp(0)} className="mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: '#d97706' }}>Catalogue</p>
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <h2 className="text-5xl md:text-6xl font-black tracking-[-0.04em] leading-none" style={{ color: '#fafafa' }}>
                Best<br /><span className="ds-text-gradient">Sellers</span>
              </h2>
              <Link href="/products"
                className="ds-btn-secondary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
                View All <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Brand tall card */}
            <motion.div {...fadeUp(0)}
              className="md:col-span-4 rounded-2xl p-10 flex flex-col justify-between min-h-[460px] relative overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #1a1006, #0d0a05)', border: '1px solid rgba(217,119,6,0.20)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: 'linear-gradient(90deg, #d97706, #f59e0b, #d97706)' }} />
              <motion.div
                animate={{ scale:[1,1.4,1], opacity:[0.4,0.7,0.4] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-12 right-12 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.25) 0%, transparent 70%)' }} />
              <div className="relative z-10">
                <div className="ds-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-8">
                  <Shield size={10} /> Certified RRC
                </div>
                <h3 className="text-4xl font-black leading-none tracking-[-0.03em]">
                  <span style={{ color: '#fafafa' }}>Retatrutide</span><br />
                  <span className="ds-text-gradient">Research</span><br />
                  <span style={{ color: '#52525b' }}>Center</span>
                </h3>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#d97706" stroke="#d97706" />)}
                </div>
                <span className="text-[10px] ds-mono" style={{ color: '#52525b' }}>4.9 — 128 reviews</span>
              </div>
            </motion.div>

            {/* Product cards */}
            {products.map((p, i) => (
              <motion.div key={p.id} {...fadeUp((i+1) * 0.09)}
                className="md:col-span-4 ds-card rounded-2xl p-6 flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: i % 2 === 0 ? '#d97706' : '#34d399' }} />

                <Link href={`/products/${p.id}`}
                  className="aspect-square rounded-xl overflow-hidden flex items-center justify-center mb-5 relative"
                  style={{ background: '#18181b' }}>
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: 'spring' as const, stiffness: 250, damping: 20 }}
                    src={p.main_image_url || '/placeholder.png'}
                    className="w-full h-full object-contain p-6"
                    alt={p.name}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest"
                      style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.35)', color: '#fbbf24' }}>
                      View Details
                    </span>
                  </div>
                </Link>

                {p.on_sale && (
                  <span className="ds-badge text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 w-fit">Sale</span>
                )}
                <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1.5" style={{ color: '#d97706' }}>
                  {p.category_name || 'Research Grade'}
                </p>
                <Link href={`/products/${p.id}`}>
                  <h4 className="font-black text-sm leading-tight mb-3 transition-colors duration-200 group-hover:text-amber-400" style={{ color: '#fafafa' }}>
                    {p.name}
                  </h4>
                </Link>
                <p className="text-2xl font-black tracking-tight mb-5 ds-mono" style={{ color: '#f59e0b' }}>${p.price}</p>
                <div className="mt-auto flex gap-2">
                  <button onClick={() => addToCart(p)}
                    className="flex-1 ds-btn-primary py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                  <Link href={`/products/${p.id}`}
                    className="ds-btn-secondary px-3 py-3 rounded-xl flex items-center justify-center">
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPOUND SPOTLIGHT ───────────────────────────────────── */}
      <section className="py-28" style={{ background: '#111113', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp(0)} className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: '#d97706' }}>Research Focus</p>
            <h2 className="text-5xl md:text-6xl font-black tracking-[-0.04em]" style={{ color: '#fafafa' }}>
              Triple Agonist<br /><span className="ds-text-gradient">Science</span>
            </h2>
          </motion.div>

          {/* Bento feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <FlaskConical size={28} />, title: 'Mechanism', tag: 'Triple Agonist', desc: 'Simultaneously activates GLP-1, GIP, and glucagon receptors producing synergistic metabolic effects in research models.', color: '#d97706' },
              { icon: <Microscope size={28} />,   title: '≥99% Purity', tag: 'HPLC Verified', desc: 'Every batch undergoes rigorous HPLC analysis. Certificate of Analysis included for full traceability.', color: '#10b981' },
              { icon: <Globe size={28} />,        title: 'Applications', tag: 'Lab Use Only', desc: 'Obesity, diabetes, NASH, cardiovascular metabolic research. In-vitro and laboratory settings only.', color: '#d97706' },
            ].map((c, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="ds-card rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-300"
                  style={{ background: c.color, opacity: 0.6 }} />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `rgba(${c.color === '#d97706' ? '217,119,6' : '16,185,129'},0.12)`, border: `1px solid ${c.color}30`, color: c.color }}>
                  {c.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 inline-block"
                  style={{ color: c.color, background: `${c.color}18`, border: `1px solid ${c.color}30` }}>
                  {c.tag}
                </span>
                <h3 className="text-base font-black uppercase tracking-tight mb-3" style={{ color: '#fafafa' }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Monospace data row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Mol. Weight', val: '4,667.4 Da' },
              { label: 'Form',        val: 'Lyophilized' },
              { label: 'Storage',     val: '-20°C' },
              { label: 'Solubility',  val: 'Aq. Buffer' },
            ].map((p, i) => (
              <motion.div key={i} {...fadeUp(0.3 + i * 0.05)}
                className="rounded-xl p-4 text-center ds-surface">
                <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: '#3f3f46' }}>{p.label}</p>
                <p className="font-black text-sm ds-mono" style={{ color: '#f59e0b' }}>{p.val}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION ────────────────────────────────────────── */}
      <section className="py-28" style={{ background: '#09090b' }}>
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: '#10b981' }}>Research in Action</p>
            <h2 className="text-5xl font-black tracking-[-0.04em] text-white">
              Lab <span className="ds-text-gradient-emerald">Footage</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main large video */}
            <motion.div {...fadeUp(0)} className="lg:row-span-2">
              <div className="relative rounded-2xl overflow-hidden ds-card group" style={{ minHeight: '420px' }}>
                <video
                  autoPlay muted loop playsInline preload="metadata"
                  poster="/assets/cells-poster.webp"
                  className="w-full h-full object-cover absolute inset-0"
                  style={{ minHeight: '420px' }}
                >
                  <source src="/assets/cells.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.10) 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="ds-badge-emerald text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-3">
                    Live · In-Vitro Research
                  </span>
                  <h3 className="text-xl font-black text-white mb-1">Cell Receptor Binding Study</h3>
                  <p className="text-sm" style={{ color: '#71717a' }}>GLP-1 receptor activation in adipocyte culture — RRC Lab, 2024</p>
                </div>
              </div>
            </motion.div>

            {/* Top-right: video 2 */}
            <motion.div {...fadeUp(0.1)}>
              <div className="relative rounded-2xl overflow-hidden ds-card group" style={{ minHeight: '200px' }}>
                <video
                  autoPlay muted loop playsInline preload="metadata"
                  poster="/assets/cells-poster.webp"
                  className="w-full h-full object-cover absolute inset-0"
                  style={{ minHeight: '200px' }}
                >
                  <source src="/assets/cells.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.05) 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="ds-badge text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-2">
                    HPLC Analysis
                  </span>
                  <h4 className="text-sm font-black text-white">Purity Verification Process</h4>
                </div>
              </div>
            </motion.div>

            {/* Bottom-right: stat card */}
            <motion.div {...fadeUp(0.2)}>
              <div className="rounded-2xl p-8 ds-surface flex flex-col justify-between" style={{ minHeight: '200px', border: '1px solid rgba(217,119,6,0.20)' }}>
                <div className="h-0.5 w-12 rounded-full mb-6" style={{ background: 'linear-gradient(90deg, #d97706, #f59e0b)' }} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: '#d97706' }}>Research Output</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { val: '12+', label: 'Studies supported' },
                      { val: '≥99%', label: 'Avg purity CoA' },
                      { val: '3M+', label: 'Units dispatched' },
                      { val: '4.9★', label: 'Researcher rating' },
                    ].map(s => (
                      <div key={s.label}>
                        <p className="text-2xl font-black ds-mono ds-text-gradient">{s.val}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#52525b' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-28" style={{ background: '#09090b' }}>
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp(0)} className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: '#10b981' }}>Process</p>
            <h2 className="text-5xl font-black tracking-[-0.04em]" style={{ color: '#fafafa' }}>
              How It <span className="ds-text-gradient-emerald">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { n: '01', icon: <Package size={28} />, title: 'Select Compound', desc: 'Browse our catalogue. Each product ships with full CoA and purity report.', color: '#d97706' },
              { n: '02', icon: <Lock size={28} />,    title: 'Secure Checkout', desc: 'SSL-encrypted order flow. Discreet processing with bank-grade security.', color: '#10b981' },
              { n: '03', icon: <Truck size={28} />,   title: 'Fast Delivery',   desc: 'Temperature-controlled, discreet packaging. Tracked globally in 3–5 days.', color: '#d97706' },
            ].map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.12)} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+48px)] right-[-20%] h-px"
                    style={{ background: 'linear-gradient(90deg, rgba(217,119,6,0.4), transparent)' }} />
                )}
                <div className="ds-card rounded-2xl p-8 text-center">
                  <div className="relative inline-block mb-6">
                    <motion.div whileHover={{ scale: 1.08, rotate: 5 }}
                      transition={{ type: 'spring' as const, stiffness: 300 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                      style={{ background: `${s.color}14`, border: `1.5px solid ${s.color}35`, color: s.color }}>
                      {s.icon}
                    </motion.div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[9px] font-black flex items-center justify-center text-white ds-mono"
                      style={{ background: s.color }}>
                      {s.n}
                    </span>
                  </div>
                  <h3 className="font-black uppercase tracking-tight mb-3 text-sm" style={{ color: '#fafafa' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO SPLIT ───────────────────────────────────────────── */}
      <section className="py-16" style={{ background: '#111113', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp(0)}
            className="rounded-3xl overflow-hidden grid md:grid-cols-2 min-h-[360px]"
            style={{ border: '1px solid rgba(217,119,6,0.20)' }}>
            {/* Left */}
            <div className="p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1a1006 0%, #0d0a05 100%)' }}>
              <motion.div animate={{ scale:[1,1.5,1] }} transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.20) 0%, transparent 70%)' }} />
              <span className="ds-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 w-fit">
                <Zap size={10} /> Limited Offer
              </span>
              <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-none mb-4">
                <span style={{ color: '#fafafa' }}>Precision.</span><br />
                <span className="ds-text-gradient">No Compromise.</span>
              </h3>
              <p className="text-3xl font-black mb-8 ds-mono" style={{ color: '#52525b' }}>Up to 35% off</p>
              <Link href="/products"
                className="ds-btn-primary inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-widest w-fit">
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
            {/* Right — info grid */}
            <div className="p-10 grid grid-cols-2 gap-3 content-center"
              style={{ background: '#0d0a05' }}>
              {[
                { icon: <CheckCircle2 size={18} />, label: 'Purity', val: '≥99%', color: '#10b981' },
                { icon: <Package size={18} />,      label: 'Form',   val: 'Lyophilized', color: '#d97706' },
                { icon: <Truck size={18} />,        label: 'Ships',  val: 'Same Day', color: '#10b981' },
                { icon: <Shield size={18} />,       label: 'CoA',    val: 'Included', color: '#d97706' },
              ].map(item => (
                <div key={item.label} className="ds-card rounded-xl p-5 text-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3"
                    style={{ color: item.color, background: `${item.color}14` }}>
                    {item.icon}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#3f3f46' }}>{item.label}</p>
                  <p className="font-black text-sm ds-mono" style={{ color: item.color }}>{item.val}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-28" style={{ background: '#09090b' }}>
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: '#d97706' }}>Reviews</p>
            <h2 className="text-5xl font-black tracking-[-0.04em]" style={{ color: '#fafafa' }}>
              Trusted by <span className="ds-text-gradient">Researchers</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {[
              { name: 'Dr. Sarah M.', role: 'Metabolic Research Institute', text: 'Exceptional purity and consistency across every batch. The CoA documentation is thorough and delivery was faster than expected. Our gold standard supplier.', stars: 5 },
              { name: 'Prof. James R.', role: 'University Lab, Edinburgh', text: 'The Retatrutide compound arrived perfectly lyophilized. Reconstitution was flawless. Results in our in-vitro study matched published data exactly.', stars: 5 },
              { name: 'Dr. Elena K.', role: 'Endocrinology Research Group', text: 'Fast, discreet, and reliable. Purity levels consistently above what we see elsewhere. RRC has become our go-to for all GLP-1 research compounds.', stars: 5 },
            ].map((r, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="ds-card rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: '#d97706', opacity: 0.5 }} />
                <div className="flex gap-0.5 mb-5">
                  {[...Array(r.stars)].map((_, s) => <Star key={s} size={13} fill="#f59e0b" stroke="#f59e0b" />)}
                </div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: '#71717a' }}>"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: 'rgba(217,119,6,0.20)', color: '#fbbf24' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-xs" style={{ color: '#fafafa' }}>{r.name}</p>
                    <p className="text-[10px]" style={{ color: '#52525b' }}>{r.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Aggregate */}
          <motion.div {...fadeUp(0.3)}
            className="flex items-center justify-center gap-6 pt-10 ds-divider">
            <div className="flex gap-1 mt-10">
              {[...Array(5)].map((_,i) => <Star key={i} size={20} fill="#f59e0b" stroke="#f59e0b" />)}
            </div>
            <div className="mt-10">
              <p className="font-black text-xl ds-mono" style={{ color: '#fafafa' }}>4.9 / 5.0</p>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#52525b' }}>128 verified reviews</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────────── */}
      <section className="py-16" style={{ background: '#111113', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <CheckCircle2 size={20} />, title: 'Lab Certified', desc: 'CoA with every batch', color: '#10b981' },
              { icon: <Lock size={20} />,          title: 'SSL Checkout',  desc: 'Bank-grade encryption', color: '#d97706' },
              { icon: <Truck size={20} />,         title: 'Discreet Ship', desc: 'Plain packaging globally', color: '#10b981' },
              { icon: <BarChart3 size={20} />,     title: 'HPLC Verified', desc: '≥99% purity guaranteed', color: '#d97706' },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}12`, border: `1px solid ${item.color}25`, color: item.color }}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-wider mb-1" style={{ color: '#fafafa' }}>{item.title}</p>
                  <p className="text-[11px]" style={{ color: '#52525b' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────────── */}
      <section className="py-28" style={{ background: '#09090b' }}>
        <div className="container mx-auto px-6 max-w-xl text-center">
          <motion.div {...fadeUp(0)}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.25)' }}>
              <Activity size={26} style={{ color: '#f59e0b' }} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: '#d97706' }}>Research Updates</p>
            <h2 className="text-4xl font-black tracking-[-0.04em] mb-4" style={{ color: '#fafafa' }}>Stay Informed</h2>
            <p className="text-sm leading-relaxed mb-10" style={{ color: '#71717a' }}>
              Latest peptide research updates, compound arrivals, and exclusive offers — direct to your inbox.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <AnimatePresence mode="wait">
              {!emailSent ? (
                <motion.form key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  onSubmit={e => { e.preventDefault(); if(email) setEmailSent(true) }}
                  className="flex gap-3">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com" required
                    className="ds-input flex-1 px-5 py-4 rounded-xl text-sm" />
                  <button type="submit"
                    className="ds-btn-primary px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 whitespace-nowrap">
                    Subscribe <Send size={13} />
                  </button>
                </motion.form>
              ) : (
                <motion.div key="ok"
                  initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                  transition={{ type: 'spring' as const, bounce: 0.3 }}
                  className="flex items-center justify-center gap-3 py-4">
                  <CheckCircle2 size={22} style={{ color: '#10b981' }} />
                  <p className="font-black text-sm" style={{ color: '#fafafa' }}>Welcome to the RRC research community.</p>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-[10px] mt-4" style={{ color: '#3f3f46' }}>No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="relative py-40 overflow-hidden"
        style={{ background: '#0d0a05', borderTop: '1px solid rgba(217,119,6,0.15)' }}>
        <motion.div animate={{ scale:[1,1.3,1], rotate:[0,10,0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(217,119,6,0.12) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.p {...fadeUp(0)} className="text-[10px] font-black uppercase tracking-[0.35em] mb-8" style={{ color: '#d97706' }}>
            Research Haven for Scientific Excellence
          </motion.p>
          <motion.h2 {...fadeUp(0.08)}
            className="text-6xl md:text-9xl font-black uppercase tracking-[-0.05em] leading-none mb-8">
            <span className="ds-text-gradient">RRC</span>
          </motion.h2>
          <motion.p {...fadeUp(0.16)} className="text-xl font-medium mb-14 max-w-lg" style={{ color: '#52525b' }}>
            Engineered for research precision. Delivered with integrity.
          </motion.p>
          <motion.div {...fadeUp(0.22)} className="flex gap-4 flex-wrap justify-center">
            <Link href="/products"
              className="group ds-btn-primary inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-[12px] tracking-[0.12em]">
              Shop Compounds <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link href="/about"
              className="ds-btn-secondary inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-[12px] tracking-[0.12em]">
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* ── CART POPUP ────────────────────────────────────────────── */}
      <AnimatePresence>
        {addedProduct && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm"
              onClick={() => setAddedProduct(null)} />
            <motion.div
              initial={{ scale:0.9, opacity:0, y:20 }}
              animate={{ scale:1, opacity:1, y:0 }}
              exit={{ scale:0.9, opacity:0, y:20 }}
              transition={{ type: 'spring' as const, bounce: 0.35, duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm z-[310] rounded-2xl p-8 text-center ds-card"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, #d97706, #f59e0b)' }} />
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <CheckCircle2 size={22} style={{ color: '#34d399' }} />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest mb-3 ds-badge inline-block px-3 py-1 rounded-full">Added to cart</p>
              <img src={addedProduct.main_image_url} className="w-20 h-20 mx-auto object-contain my-4 rounded-xl"
                style={{ background: '#18181b' }} alt={addedProduct.name} />
              <h6 className="font-black text-sm mb-5" style={{ color: '#fafafa' }}>{addedProduct.name}</h6>
              <div className="flex gap-3">
                <button onClick={() => setAddedProduct(null)}
                  className="flex-1 ds-btn-primary py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">
                  Continue
                </button>
                <Link href="/cart" onClick={() => setAddedProduct(null)}
                  className="flex-1 ds-btn-secondary py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                  Cart <ShoppingCart size={13} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
