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
} from 'lucide-react'
import { useInView } from '@/hooks/useInView'

interface Product {
  id: string
  name: string
  price: number
  main_image_url: string
  category_name?: string
}

export default function HomePage() {
  const [products, setProducts]     = useState<Product[]>([])
  const [loading, setLoading]       = useState(true)
  const [addedProduct, setAddedProduct] = useState<Product | null>(null)

  const [statsRef,    statsInView]    = useInView<HTMLElement>()
  const [sellersRef,  sellersInView]  = useInView<HTMLElement>()
  const [spotlightRef, spotlightInView] = useInView<HTMLElement>()
  const [howRef,      howInView]      = useInView<HTMLElement>()
  const [evalRef,     evalInView]     = useInView<HTMLElement>()
  const [promoRef,    promoInView]    = useInView<HTMLElement>()
  const [trustRef,    trustInView]    = useInView<HTMLElement>()
  const [ctaRef,      ctaInView]      = useInView<HTMLElement>()

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase.from('products').select('*').eq('is_active', true).limit(3)
      setProducts((data as Product[]) || [])
      setLoading(false)
    }
    loadProducts()
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
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  })

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <style>{`
            @media (prefers-reduced-motion: reduce) {
              .hero-video { display: none; }
              .hero-poster { display: block !important; }
            }
          `}</style>
          <video
            className="hero-video absolute inset-0 w-full h-full object-cover scale-105"
            autoPlay muted loop playsInline preload="metadata"
            poster="/assets/hero-poster.webp"
          >
            <source src="/assets/hero-bg.mp4" type="video/mp4" />
          </video>
          <Image src="/assets/hero-poster.webp" alt="" fill className="hero-poster object-cover hidden" priority />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.32) 50%, rgba(0,0,0,0.92) 100%)' }} />

        {/* Subtle green grid */}
        <div className="absolute inset-0 z-[2] opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#84cc16 1px, transparent 1px), linear-gradient(90deg, #84cc16 1px, transparent 1px)', backgroundSize: '6px 6px' }} />

        {/* Green ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#84cc16]/10 blur-[120px] rounded-full pointer-events-none z-[2]" />

        <div className="container mx-auto px-4 relative z-10 flex items-center justify-between">
          {/* Left arch */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-[280px] h-[300px] rounded-t-full overflow-hidden bg-[#1a2e05] flex-shrink-0"
            style={{ border: '1px solid rgba(132,204,22,0.20)', boxShadow: '0 0 60px rgba(132,204,22,0.10)' }}
          >
            <img src="/hero-right-arch.png" className="w-full h-full object-contain p-1 scale-110 relative z-10" alt="" />
          </motion.div>

          {/* Center content */}
          <div className="flex flex-col items-center text-center flex-grow px-4 md:px-10">
            <div className="flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full lg-badge opacity-0"
              style={{ animation: 'rrc-fadeInUp 0.65s ease-out 0.1s forwards' }}>
              <span className="w-2 h-2 rounded-full bg-[#84cc16] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84cc16]">Advanced Peptide Research</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[0.85] tracking-[-0.06em] uppercase mb-6 opacity-0"
              style={{ animation: 'rrc-fadeInUp 0.65s ease-out 0.25s forwards' }}
            >
              RETATRUTIDE<br />
              <span className="text-[#84cc16]">RESEARCH</span><br />
              <span className="text-[#facc15]">CENTER</span>
            </h1>

            <p
              className="text-base md:text-xl text-white/50 font-medium tracking-tight mb-10 max-w-md opacity-0"
              style={{ animation: 'rrc-fadeInUp 0.65s ease-out 0.4s forwards' }}
            >
              Advancing GLP-1 peptide science through precision synthesis, clinical-grade purity, and global research distribution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 opacity-0"
              style={{ animation: 'rrc-fadeInUp 0.65s ease-out 0.55s forwards' }}>
              <Link href="/products"
                className="group lg-btn-accent inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-sm tracking-[0.15em] text-white">
                Browse Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about"
                className="group lg-btn inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase text-sm tracking-[0.15em] text-white/70 hover:text-white">
                About RRC
              </Link>
            </div>
          </div>

          {/* Right arch */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-[280px] h-[300px] rounded-t-full overflow-hidden bg-[#422006] flex-shrink-0"
            style={{ border: '1px solid rgba(250,204,21,0.20)', boxShadow: '0 0 60px rgba(250,204,21,0.10)' }}
          >
            <img src="/hero-left-arch.png" className="w-full h-full object-contain p-1 scale-110 relative z-10" alt="" />
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-40 animate-bounce">
          <ChevronDown size={28} className="text-[#84cc16]" />
        </div>

        {/* Marquee bar */}
        <div className="absolute bottom-0 w-full py-3.5 z-20 overflow-hidden border-t border-[#84cc16]/20"
          style={{ background: 'linear-gradient(90deg, #1a2e05 0%, #14420a 50%, #1a2e05 100%)' }}>
          <div className="flex whitespace-nowrap animate-marquee">
            {[1, 2, 3].map((i) => (
              <span key={i} className="font-black text-[11px] uppercase tracking-[0.3em] mx-10"
                style={{ color: '#84cc16' }}>
                ★ Fast Shipping on orders above £100 ★&nbsp;
                <span style={{ color: '#facc15' }}>100% Lab Tested</span>
                &nbsp;★ Pure Compounds ★ GLP-1 Research Grade ★
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section
        ref={statsRef as React.RefObject<HTMLElement>}
        className="bg-[#040a02] border-b border-[#84cc16]/8 py-12"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '3M+',   label: 'Compounds Studied',  sub: 'cumulative research data', color: '#84cc16' },
              { val: '99.8%', label: 'Purity Rate',        sub: 'HPLC verified batches',    color: '#facc15' },
              { val: '50+',   label: 'Countries Served',   sub: 'global distribution',      color: '#84cc16' },
              { val: '4.7k+', label: 'Research Partners',  sub: 'institutions & labs',      color: '#facc15' },
            ].map((s, i) => (
              <div key={s.label} className="text-center" style={fadeUp(statsInView, i * 80)}>
                <p className="text-3xl md:text-4xl font-black tracking-tight mb-1" style={{ color: s.color }}>{s.val}</p>
                <p className="text-white text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-white/25 text-[10px] uppercase tracking-wider">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section ref={sellersRef as React.RefObject<HTMLElement>} className="py-24 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16" style={fadeUp(sellersInView)}>
            <p className="text-[#84cc16] text-[10px] font-black uppercase tracking-[0.3em] mb-3">Catalogue</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Best Selling Products</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Brand card */}
            <div
              className="rounded-xl p-10 flex flex-col justify-end min-h-[420px] relative overflow-hidden group transition-all"
              style={{
                background: 'linear-gradient(145deg, #1a2e05 0%, #0f1a03 100%)',
                border: '1px solid rgba(132,204,22,0.22)',
                boxShadow: '0 0 0 0 rgba(132,204,22,0)',
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 48px rgba(132,204,22,0.18)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(132,204,22,0)')}
              style={fadeUp(sellersInView, 0) as React.CSSProperties}
            >
              <div className="absolute top-10 left-10 opacity-15 group-hover:scale-110 transition-transform duration-700">
                <img src="/leaf-bg.png" className="w-32" alt="" />
              </div>
              {/* Yellow accent stripe */}
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
                style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />
              <div className="relative z-10">
                <img src="/leaf-white.png" className="w-8 mb-6" alt="" />
                <h3 className="text-3xl font-black text-white leading-tight">
                  Retatrutide<br />
                  <span style={{ color: '#84cc16' }}>Research</span><br />
                  <span style={{ color: '#facc15' }}>Center</span>
                </h3>
              </div>
            </div>

            {products.map((product, i) => (
              <div key={product.id} className="group lg-card rounded-xl p-6 flex flex-col"
                style={fadeUp(sellersInView, (i + 1) * 80)}>
                {/* Yellow top stripe */}
                <div className="w-full h-0.5 rounded-t mb-4"
                  style={{ background: i % 2 === 0 ? '#84cc16' : '#facc15' }} />
                <div className="aspect-square mb-6 overflow-hidden bg-white/3 rounded-lg border border-white/5">
                  <img
                    src={product.main_image_url}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                    alt={product.name}
                  />
                </div>
                <p className="text-[10px] font-bold uppercase mb-1" style={{ color: '#84cc16' }}>
                  {product.category_name || 'Uncategorized'}
                </p>
                <h4 className="font-bold text-sm text-white mb-4 h-10">{product.name}</h4>
                <p className="font-black text-lg mb-6" style={{ color: '#facc15' }}>£{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full lg-btn py-3 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white hover:text-[#84cc16]"
                >
                  <ShoppingCart size={14} /> Add To Cart
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-10" style={fadeUp(sellersInView, 400)}>
            <Link href="/products"
              className="inline-flex items-center gap-2 lg-btn px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest text-white/60 hover:text-white">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── COMPOUND SPOTLIGHT ── */}
      <section
        ref={spotlightRef as React.RefObject<HTMLElement>}
        className="py-24 border-y"
        style={{ background: '#020801', borderColor: 'rgba(132,204,22,0.08)' }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" style={fadeUp(spotlightInView)}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#84cc16' }}>Research Focus</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Retatrutide — Triple Agonist</h2>
            <p className="text-white/40 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
              A GLP-1/GIP/Glucagon triple receptor agonist showing remarkable efficacy in metabolic research studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FlaskConical size={28} />,
                title: 'Mechanism of Action',
                desc: 'Simultaneously activates GLP-1, GIP, and glucagon receptors — producing synergistic metabolic effects in research models.',
                tag: 'Triple Agonist',
                accent: '#84cc16',
              },
              {
                icon: <Microscope size={28} />,
                title: '≥99% Purity',
                desc: 'Every batch undergoes rigorous HPLC analysis. Certificate of Analysis (CoA) included with each shipment for full traceability.',
                tag: 'HPLC Verified',
                accent: '#facc15',
              },
              {
                icon: <Globe size={28} />,
                title: 'Research Applications',
                desc: 'Used in obesity, diabetes, NASH, and cardiovascular metabolic research. Supplied exclusively for laboratory and in-vitro studies.',
                tag: 'Lab Use Only',
                accent: '#84cc16',
              },
            ].map((card, i) => (
              <div key={i} className="lg-card rounded-2xl p-8 relative overflow-hidden" style={fadeUp(spotlightInView, i * 100)}>
                {/* Accent top border */}
                <div className="absolute top-0 left-0 w-full h-0.5 rounded-t-2xl"
                  style={{ background: card.accent }} />
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${card.accent}18`, border: `1px solid ${card.accent}30`, color: card.accent }}>
                  {card.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full mb-4 inline-block"
                  style={{ color: card.accent, background: `${card.accent}14`, border: `1px solid ${card.accent}28` }}>
                  {card.tag}
                </span>
                <h3 className="text-base font-black uppercase tracking-tight text-white mb-3">{card.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Properties grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Molecular Weight', val: '4,667.4 Da',        accent: '#84cc16' },
              { label: 'Form',             val: 'Lyophilized Powder', accent: '#facc15' },
              { label: 'Storage',          val: '-20°C Recommended',  accent: '#84cc16' },
              { label: 'Solubility',       val: 'Aqueous Buffer',     accent: '#facc15' },
            ].map((p, i) => (
              <div key={i} className="lg-surface rounded-xl p-5 text-center" style={fadeUp(spotlightInView, 300 + i * 60)}>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-2">{p.label}</p>
                <p className="font-black text-sm" style={{ color: p.accent }}>{p.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={howRef as React.RefObject<HTMLElement>} className="py-24 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" style={fadeUp(howInView)}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: '#facc15' }}>Process</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', icon: <Package size={32} />, title: 'Select Your Compound', desc: 'Browse our catalogue of research-grade peptides. Each product includes a full CoA and purity report.', accent: '#84cc16' },
              { step: '02', icon: <Lock size={32} />,    title: 'Secure Order',          desc: 'Complete your order through our encrypted checkout. All data is secured with SSL and processed discreetly.', accent: '#facc15' },
              { step: '03', icon: <Truck size={32} />,   title: 'Fast Delivery',         desc: 'Temperature-controlled, discreet packaging. Tracked worldwide with an average 3–5 business day delivery.', accent: '#84cc16' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative" style={fadeUp(howInView, i * 120)}>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+60px)] right-0 h-px border-t border-dashed"
                    style={{ borderColor: 'rgba(132,204,22,0.18)' }} />
                )}
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                  style={{ background: `${step.accent}14`, border: `1px solid ${step.accent}28`, color: step.accent }}>
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[#050505] text-[9px] font-black flex items-center justify-center"
                    style={{ background: step.accent }}>
                    {step.step}
                  </span>
                </div>
                <h3 className="text-base font-black uppercase tracking-tight text-white mb-3">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RETATRUTIDE EVALUATION ── */}
      <section
        ref={evalRef as React.RefObject<HTMLElement>}
        className="py-24 border-y"
        style={{ background: '#020801', borderColor: 'rgba(132,204,22,0.08)', ...fadeUp(evalInView) }}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-8"
                style={{ background: 'linear-gradient(135deg, #84cc16, #65a30d)', boxShadow: '0 8px 32px rgba(132,204,22,0.30)' }}>
                <img src="/leaf-white.png" className="w-6 h-6" alt="" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter text-white">
                Retatrutide – Pre-Filled Pen<br />
                <span style={{ color: '#facc15' }}>Evaluation</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6 max-w-lg">
                Part of <span className="font-bold" style={{ color: '#84cc16' }}>Retatrutide Research Center&apos;s</span> ongoing research program into advanced GLP-1 multi-agonist compounds. Supplied in controlled batches for laboratory analysis of stability, compound behaviour, and injector system performance.
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/25 mb-10">
                Not for human or veterinary consumption.
              </p>
              <Link href="/about"
                className="inline-flex items-center gap-3 lg-btn-accent px-8 py-4 rounded-lg font-black uppercase text-[10px] tracking-widest text-white">
                About Store <ArrowRight size={14} />
              </Link>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="rounded-2xl overflow-hidden transition-all duration-500"
                style={{ aspectRatio: '16/9' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 56px rgba(132,204,22,0.20)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <video autoPlay muted loop playsInline preload="metadata"
                  poster="/assets/molecule-poster.webp"
                  className="w-full h-full object-cover rounded-2xl">
                  <source src="/assets/molecule.mp4" type="video/mp4" />
                </video>
              </div>
              {/* Green glow blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-0 rounded-[40%_60%_70%_30%/40%_50%_60%_70%] animate-pulse pointer-events-none"
                style={{ background: 'rgba(132,204,22,0.05)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section ref={promoRef as React.RefObject<HTMLElement>} className="py-10 bg-[#050505]" style={fadeUp(promoInView)}>
        <div className="container mx-auto px-6">
          <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row items-center relative min-h-[360px]"
            style={{ background: '#020d01', border: '1px solid rgba(132,204,22,0.15)' }}>
            {/* Left content */}
            <div className="flex-1 p-12 lg:p-20 z-10 relative">
              {/* Yellow top stripe */}
              <div className="absolute top-0 left-0 right-0 h-1"
                style={{ background: 'linear-gradient(90deg, #84cc16 0%, #facc15 50%, #84cc16 100%)' }} />
              <h3 className="text-white text-4xl md:text-5xl font-black mb-4 leading-none tracking-tighter">
                No Prep. No Hassle.<br />
                <span style={{ color: '#84cc16' }}>Just Precision Dosing.</span>
              </h3>
              <p className="text-2xl font-black mb-10" style={{ color: '#facc15' }}>Upto 35% off today!</p>
              <Link href="/products"
                className="inline-flex items-center gap-3 lg-btn-accent px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest text-white">
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right panel */}
            <div className="flex-1 w-full h-full min-h-[360px] flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg, #1a2e05 0%, #0f1a03 100%)' }}>
              <div className="absolute left-0 top-0 bottom-0 w-24 hidden md:block"
                style={{ background: '#020d01', clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }} />
              <div className="relative z-10 flex flex-col items-center">
                <h4 className="text-8xl font-black absolute -left-20 top-1/2 -translate-y-1/2 rotate-[-90deg]"
                  style={{ color: '#84cc16', opacity: 0.15 }}>RRC</h4>
                <img src="/phone-app.png" className="w-48 lg:w-56 drop-shadow-2xl translate-y-8" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section
        ref={trustRef as React.RefObject<HTMLElement>}
        className="py-16 border-y"
        style={{ background: '#040a02', borderColor: 'rgba(132,204,22,0.08)' }}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <CheckCircle size={22} />, title: 'Lab Certified',     desc: 'Every batch CoA included',     accent: '#84cc16' },
              { icon: <Lock size={22} />,         title: 'Encrypted Orders',  desc: 'SSL & secure checkout',        accent: '#facc15' },
              { icon: <Truck size={22} />,        title: 'Discreet Shipping', desc: 'Plain packaging worldwide',    accent: '#84cc16' },
              { icon: <RotateCcw size={22} />,    title: 'Quality Guarantee', desc: 'Full purity or replacement',   accent: '#facc15' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4" style={fadeUp(trustInView, i * 80)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${item.accent}14`, border: `1px solid ${item.accent}28`, color: item.accent }}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-wider text-white mb-1">{item.title}</p>
                  <p className="text-white/30 text-[11px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADD TO CART POPUP ── */}
      <AnimatePresence>
        {addedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[300] backdrop-blur-sm"
              onClick={() => setAddedProduct(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md lg-card z-[310] rounded-2xl p-8 shadow-2xl text-center"
            >
              {/* Green top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />
              <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#84cc16' }}>Added to cart</p>
              <img src={addedProduct.main_image_url} className="w-20 h-20 mx-auto object-contain mb-4" alt={addedProduct.name} />
              <h6 className="font-bold text-sm text-white mb-6">{addedProduct.name}</h6>
              <div className="flex gap-4">
                <button onClick={() => setAddedProduct(null)}
                  className="flex-1 lg-btn-accent text-white py-3 rounded-lg font-black uppercase text-[10px]">
                  Continue
                </button>
                <Link href="/cart"
                  className="flex-1 lg-btn text-white py-3 rounded-lg font-black uppercase text-[10px] flex items-center justify-center gap-2">
                  Cart <ShoppingCart size={14} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FINAL CTA ── */}
      <section
        ref={ctaRef as React.RefObject<HTMLElement>}
        className="relative bg-[#050505] py-32 overflow-hidden border-t"
        style={{ borderColor: 'rgba(132,204,22,0.08)', ...fadeUp(ctaInView) }}
      >
        {/* Dual glow */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] blur-[120px] rounded-full pointer-events-none"
          style={{ background: 'rgba(132,204,22,0.08)' }} />
        <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] blur-[100px] rounded-full pointer-events-none"
          style={{ background: 'rgba(250,204,21,0.06)' }} />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-bold text-lg md:text-xl mb-8 tracking-tight"
            style={{ color: '#84cc16' }}
          >
            A Research Haven for Scientific Excellence
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="flex items-center gap-4 mb-10"
          >
            <h2 className="text-white text-4xl md:text-7xl font-black uppercase tracking-[-0.04em] flex items-center gap-3 flex-wrap justify-center">
              <span style={{ color: '#84cc16' }}>RETATRUTIDE</span>
              <img src="/leaf-white.png" className="w-12 h-12 md:w-16 md:h-16 object-contain" alt="" />
              <span style={{ color: '#facc15' }}>RC</span>
            </h2>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl font-semibold mb-12 tracking-tight leading-tight max-w-3xl text-white/70"
          >
            Engineered For Research Precision.
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            <Link href="/products"
              className="group lg-btn-accent inline-flex items-center gap-3 px-10 py-4 rounded-xl text-white font-bold uppercase text-[12px] tracking-[0.15em]">
              Shop RRC Products
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about"
              className="group lg-btn-yellow inline-flex items-center gap-3 px-10 py-4 rounded-xl text-white font-bold uppercase text-[12px] tracking-[0.15em]">
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #84cc16 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
        @keyframes rrc-fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="rrc-fadeInUp"] { animation: none !important; opacity: 1 !important; }
          .animate-bounce, .animate-pulse { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
